"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ONBOARDING_STEPS, type PackageType, type QuestionnaireField } from "@/types";
import { completeOnboarding, type OnboardingPayload } from "@/app/portal/onboarding/actions";
import {
  WelcomeStep,
  ContactInfoStep,
  EngagementReviewStep,
  QuestionnaireStep,
  TermsStep,
  IntakeEmailStep,
  AllSetStep,
} from "./OnboardingSteps";

export interface ContactInfo {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
}

interface WizardState {
  step: number;
  contactInfo: ContactInfo;
  questionnaire: Record<string, string>;
  agreedToTerms: boolean;
  signature: string;
}

function storageKey(clientId: string) {
  return `leviora-onboarding-${clientId}`;
}

export function OnboardingWizard({
  clientId,
  engagementId,
  engagementTitle,
  packageType,
  serviceType,
  serviceLabel,
  questionnaireFields,
  intakeEmail,
  initialContactInfo,
}: {
  clientId: string;
  engagementId: string;
  engagementTitle: string;
  packageType: PackageType | null;
  serviceType: string;
  serviceLabel: string;
  questionnaireFields: QuestionnaireField[];
  intakeEmail: string;
  initialContactInfo: ContactInfo;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<WizardState>(() => {
    const initial: WizardState = {
      step: 0,
      contactInfo: initialContactInfo,
      questionnaire: {},
      agreedToTerms: false,
      signature: "",
    };
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(storageKey(clientId));
    if (!raw) return initial;
    try {
      const saved = JSON.parse(raw) as Partial<WizardState>;
      return {
        step: saved.step ?? initial.step,
        contactInfo: saved.contactInfo ?? initial.contactInfo,
        questionnaire: saved.questionnaire ?? initial.questionnaire,
        agreedToTerms: saved.agreedToTerms ?? initial.agreedToTerms,
        signature: saved.signature ?? initial.signature,
      };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey(clientId), JSON.stringify(state));
  }, [clientId, state]);

  const goNext = () => setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, ONBOARDING_STEPS.length - 1) }));
  const goBack = () => setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));

  function handleFinish() {
    setError(null);
    const payload: OnboardingPayload = {
      contactInfo: state.contactInfo,
      questionnaire: state.questionnaire,
      signature: state.signature,
      agreedToTerms: state.agreedToTerms,
    };
    startTransition(async () => {
      const result = await completeOnboarding(engagementId, serviceType, payload);
      if (result.error) {
        setError(result.error);
        return;
      }
      window.localStorage.removeItem(storageKey(clientId));
      router.push("/portal");
      router.refresh();
    });
  }

  const step = state.step;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span className="font-medium text-text-primary">{ONBOARDING_STEPS[step]}</span>
      </div>
      <ProgressBar value={step + 1} max={ONBOARDING_STEPS.length} />

      {error && (
        <p className="mx-auto max-w-2xl rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
      )}

      {step === 0 && <WelcomeStep name={state.contactInfo.fullName.split(" ")[0] || "there"} onNext={goNext} />}

      {step === 1 && (
        <ContactInfoStep
          value={state.contactInfo}
          onChange={(contactInfo) => setState((prev) => ({ ...prev, contactInfo }))}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 2 && (
        <EngagementReviewStep engagementTitle={engagementTitle} packageType={packageType} onNext={goNext} onBack={goBack} />
      )}

      {step === 3 && (
        <QuestionnaireStep
          fields={questionnaireFields}
          serviceLabel={serviceLabel}
          value={state.questionnaire}
          onChange={(questionnaire) => setState((prev) => ({ ...prev, questionnaire }))}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <TermsStep
          agreed={state.agreedToTerms}
          signature={state.signature}
          onAgreedChange={(agreedToTerms) => setState((prev) => ({ ...prev, agreedToTerms }))}
          onSignatureChange={(signature) => setState((prev) => ({ ...prev, signature }))}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 5 && <IntakeEmailStep intakeEmail={intakeEmail} onNext={goNext} onBack={goBack} />}

      {step === 6 && <AllSetStep onFinish={handleFinish} pending={pending} />}
    </div>
  );
}
