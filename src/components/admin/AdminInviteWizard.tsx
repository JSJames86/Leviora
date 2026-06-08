"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { PACKAGE_LABELS, PACKAGE_DESCRIPTIONS, SERVICE_DEFINITIONS, type PackageType, type ServiceType } from "@/types";

const STEPS = ["Contact info", "Package & services", "Review & send"];
const PACKAGE_TYPES: PackageType[] = ["alacarte", "starter", "growth", "elevated"];

interface FormState {
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  packageType: PackageType | null;
  services: ServiceType[];
}

const initialForm: FormState = { fullName: "", email: "", companyName: "", phone: "", packageType: null, services: [] };

export function AdminInviteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ intakeEmail: string; clientId: string } | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleService(service: ServiceType) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service) ? prev.services.filter((s) => s !== service) : [...prev.services, service],
    }));
  }

  const canContinueStep0 = Boolean(form.fullName.trim() && form.email.trim() && form.companyName.trim());
  const canContinueStep1 = Boolean(form.packageType && form.services.length > 0);

  function handleSend() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          companyName: form.companyName,
          phone: form.phone || undefined,
          packageType: form.packageType,
          services: form.services,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Couldn't send the invite — please try again.");
        return;
      }
      setResult({ intakeEmail: data.intakeEmail, clientId: data.client.id });
    });
  }

  if (result) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardBody className="space-y-6 pt-8 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/20 text-[#3f7a5d]">
            <CheckCircleIcon className="size-8" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-medium text-text-primary">Invite sent to {form.fullName.split(" ")[0]}</h1>
            <p className="mt-2 text-text-secondary">
              {form.companyName} has been added with the intake address{" "}
              <span className="font-medium text-text-primary">{result.intakeEmail}</span>. They&apos;ll get an email to set up their
              account.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => router.push("/admin/clients")}>
              Back to clients
            </Button>
            <Button onClick={() => router.push(`/admin/clients/${result.clientId}`)}>View client</Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="font-medium text-text-primary">{STEPS[step]}</span>
      </div>
      <ProgressBar value={step + 1} max={STEPS.length} />

      {error && <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

      <Card>
        <CardBody className="space-y-6 pt-8">
          {step === 0 && (
            <>
              <div>
                <h2 className="font-heading text-2xl font-medium text-text-primary">Who are we inviting?</h2>
                <p className="mt-1 text-text-secondary">We&apos;ll use this to create their account and client record.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
                <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                <Input label="Company name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
                <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="flex justify-end border-t border-border pt-6">
                <Button onClick={() => setStep(1)} disabled={!canContinueStep0}>
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <h2 className="font-heading text-2xl font-medium text-text-primary">Package & services</h2>
                <p className="mt-1 text-text-secondary">
                  Choose the package and the engagements to set up for {form.companyName || "this client"}.
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Package</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PACKAGE_TYPES.map((pkg) => (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => update("packageType", pkg)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-colors",
                        form.packageType === pkg ? "border-primary bg-accent/30" : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-text-primary">{PACKAGE_LABELS[pkg]}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{PACKAGE_DESCRIPTIONS[pkg].tagline}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Engagements to create</p>
                <div className="space-y-2">
                  {SERVICE_DEFINITIONS.map((service) => (
                    <label
                      key={service.key}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                        form.services.includes(service.key) ? "border-primary bg-accent/30" : "border-border hover:border-primary/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service.key)}
                        onChange={() => toggleService(service.key)}
                        className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/30"
                      />
                      <span>
                        <span className="block text-sm font-medium text-text-primary">{service.label}</span>
                        <span className="block text-xs text-text-secondary">{service.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={() => setStep(2)} disabled={!canContinueStep1}>
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="font-heading text-2xl font-medium text-text-primary">Review & send</h2>
                <p className="mt-1 text-text-secondary">
                  Double check the details below — we&apos;ll send the invite as soon as you confirm.
                </p>
              </div>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Name</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{form.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Email</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{form.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Company</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{form.companyName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Phone</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{form.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Package</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{form.packageType ? PACKAGE_LABELS[form.packageType] : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-text-secondary">Engagements</dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">
                    {form.services.map((s) => SERVICE_DEFINITIONS.find((d) => d.key === s)?.label).join(", ") || "—"}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSend} loading={pending}>
                  Send invite
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
