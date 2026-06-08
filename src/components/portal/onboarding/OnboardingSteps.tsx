"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CopyButton } from "@/components/ui/CopyButton";
import { CheckCircleIcon, SparkleIcon } from "@/components/ui/icons";
import { PACKAGE_DESCRIPTIONS, PACKAGE_LABELS, type PackageType, type QuestionnaireField } from "@/types";
import type { ContactInfo } from "./OnboardingWizard";

export function StepShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardBody className="space-y-6 pt-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-text-primary sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-text-secondary">{description}</p>}
        </div>
        {children}
        <div className="flex items-center justify-between border-t border-border pt-6">{footer}</div>
      </CardBody>
    </Card>
  );
}

export function WelcomeStep({ name, onNext }: { name: string; onNext: () => void }) {
  const points = [
    "A short questionnaire so we can prepare your paperwork accurately.",
    "A quick review of your engagement scope, timeline, and what to expect.",
    "Everything you need to send us documents — at your own pace.",
  ];
  return (
    <StepShell title={`Welcome ${name}, let's get you set up`} footer={<span />}>
      <p className="text-text-secondary">Before we dive in, here&apos;s what to expect over the next few minutes:</p>
      <ul className="space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-text-primary">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/60 text-primary">
              <SparkleIcon className="size-3.5" />
            </span>
            {point}
          </li>
        ))}
      </ul>
      <div className="flex justify-end pt-2">
        <Button onClick={onNext} size="lg">
          Let&apos;s go
        </Button>
      </div>
    </StepShell>
  );
}

export function ContactInfoStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: ContactInfo;
  onChange: (value: ContactInfo) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <StepShell
      title="Confirm your contact info"
      description="We've pre-filled what we have — update anything that's changed."
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Continue</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" value={value.fullName} onChange={(e) => onChange({ ...value, fullName: e.target.value })} required />
        <Input label="Company" value={value.companyName} onChange={(e) => onChange({ ...value, companyName: e.target.value })} required />
        <Input label="Phone" type="tel" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        <Input label="Email" type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} required disabled />
      </div>
    </StepShell>
  );
}

export function EngagementReviewStep({
  engagementTitle,
  packageType,
  onNext,
  onBack,
}: {
  engagementTitle: string;
  packageType: PackageType | null;
  onNext: () => void;
  onBack: () => void;
}) {
  const pkg = packageType ? PACKAGE_DESCRIPTIONS[packageType] : null;
  return (
    <StepShell
      title="Review your engagement"
      description={engagementTitle}
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Looks good</Button>
        </>
      }
    >
      {pkg ? (
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Package</p>
            <p className="font-heading text-xl font-medium text-text-primary">{packageType ? PACKAGE_LABELS[packageType] : ""}</p>
            <p className="mt-1 text-sm text-text-secondary">{pkg.tagline}</p>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">What&apos;s included</p>
            <ul className="space-y-2">
              {pkg.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-primary">
                  <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-accent/30 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-text-secondary">Timeline expectation</p>
            <p className="mt-1 text-sm text-text-primary">{pkg.timeline}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">Your specialist will share package details shortly.</p>
      )}
    </StepShell>
  );
}

export function QuestionnaireStep({
  fields,
  serviceLabel,
  value,
  onChange,
  onNext,
  onBack,
}: {
  fields: QuestionnaireField[];
  serviceLabel: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const answered = fields.filter((f) => value[f.key]?.trim()).length;
  const requiredMissing = fields.some((f) => f.required && !value[f.key]?.trim());

  return (
    <StepShell
      title="Intake questionnaire"
      description={`A few details we need for your ${serviceLabel} engagement.`}
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={requiredMissing}>
            Save and continue
          </Button>
        </>
      }
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
          <span>Progress</span>
          <span>
            {answered} of {fields.length} answered
          </span>
        </div>
        <ProgressBar value={answered} max={fields.length} />
      </div>

      <div className="space-y-4">
        {fields.map((field) =>
          field.type === "textarea" ? (
            <Textarea
              key={field.key}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              value={value[field.key] ?? ""}
              onChange={(e) => onChange({ ...value, [field.key]: e.target.value })}
            />
          ) : (
            <Input
              key={field.key}
              label={field.label}
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              required={field.required}
              placeholder={field.placeholder}
              value={value[field.key] ?? ""}
              onChange={(e) => onChange({ ...value, [field.key]: e.target.value })}
            />
          )
        )}
      </div>
    </StepShell>
  );
}

export function TermsStep({
  agreed,
  signature,
  onAgreedChange,
  onSignatureChange,
  onNext,
  onBack,
}: {
  agreed: boolean;
  signature: string;
  onAgreedChange: (value: boolean) => void;
  onSignatureChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const canContinue = agreed && signature.trim().length > 1;

  return (
    <StepShell
      title="Terms and scope"
      description="Please review the scope of work and sign below to confirm you're ready to proceed."
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={() => {
              setTouched(true);
              if (canContinue) onNext();
            }}
          >
            Sign and continue
          </Button>
        </>
      }
    >
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Scope of work summary</p>
        <p className="text-sm leading-relaxed text-text-primary">
          Leviora Ventures will perform the services outlined in your engagement, including preparation and filing of required
          documentation, coordination with relevant agencies, and delivery of final materials through your client portal.
          Engagements proceed in the order of the milestones shown on your dashboard, and we&apos;ll reach out anytime we need
          additional information from you.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Terms</p>
        <div className="h-40 overflow-y-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-text-secondary">
          <p className="mb-3">
            These Terms of Engagement (&quot;Terms&quot;) govern the working relationship between Leviora Ventures (&quot;Leviora,&quot; &quot;we,&quot; &quot;us&quot;)
            and the client identified in this portal (&quot;you,&quot; &quot;Client&quot;). By signing below, you authorize Leviora to act on your
            behalf for the limited purposes described in your engagement scope, including filing documents with relevant state
            and federal agencies where applicable.
          </p>
          <p className="mb-3">
            Timelines shared in your portal are estimates based on agency processing times and the completeness of information
            you provide. Delays caused by third parties (e.g., state filing offices, the IRS) are outside Leviora&apos;s control.
            You agree to respond to requests for information in a timely manner so your engagement can proceed on schedule.
          </p>
          <p className="mb-3">
            All deliverables remain available in your client portal. Fees for your selected package are billed according to the
            payment schedule shared at signup. Either party may end the engagement with written notice; completed milestones
            remain billable.
          </p>
          <p>
            Leviora maintains confidentiality of all information you share and uses it solely to deliver the services described
            in your engagement. Questions about these Terms can be sent any time through the Notes tab on your engagement.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/30"
        />
        I agree to the terms and scope of work described above.
      </label>
      {touched && !agreed && <p className="text-xs text-error">Please check the box to continue.</p>}

      <Input
        label="Digital signature"
        placeholder="Type your full legal name"
        value={signature}
        onChange={(e) => onSignatureChange(e.target.value)}
        hint="Typing your name here serves as your digital signature on these terms."
      />
      {touched && signature.trim().length <= 1 && <p className="-mt-3 text-xs text-error">Please add your signature to continue.</p>}
    </StepShell>
  );
}

export function IntakeEmailStep({
  intakeEmail,
  onNext,
  onBack,
}: {
  intakeEmail: string;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <StepShell
      title="Your intake email address"
      description="Forward documents and information here any time — we'll route them straight to your engagement."
      footer={
        <>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>I&apos;m done</Button>
        </>
      }
    >
      <div className="rounded-xl border border-border bg-accent/20 p-5">
        <p className="text-xs uppercase tracking-wide text-text-secondary">Your unique intake address</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary">{intakeEmail}</code>
          <CopyButton value={intakeEmail} />
        </div>
      </div>
      <div className="space-y-2 text-sm text-text-primary">
        <p className="font-medium">What to send</p>
        <p className="text-text-secondary">
          Any documents, IDs, or reference material relevant to your engagement — formation paperwork, brand assets, prior
          filings, or anything your specialist requests.
        </p>
        <p className="font-medium">How to title it</p>
        <p className="text-text-secondary">
          Use a subject line like <span className="font-medium text-text-primary">&quot;[Your company] — [what it is]&quot;</span> (e.g.
          &quot;Bright Path Consulting — Articles of Organization draft&quot;) so we can file it correctly the first time.
        </p>
      </div>
    </StepShell>
  );
}

export function AllSetStep({ onFinish, pending }: { onFinish: () => void; pending: boolean }) {
  return (
    <StepShell
      title="We've got everything we need — we're on it"
      footer={
        <div className="ml-auto">
          <Button onClick={onFinish} loading={pending} size="lg">
            Go to my dashboard
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success/20 text-[#3f7a5d]">
          <CheckCircleIcon className="size-8" />
        </span>
        <p className="max-w-sm text-text-secondary">
          Your specialist is reviewing what you shared and will reach out with next steps. You can track everything from your
          dashboard from here on out.
        </p>
      </div>
    </StepShell>
  );
}
