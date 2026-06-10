"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { QuoteLedger } from "@/components/quote/QuoteLedger";
import { computeMilestones, computeQuote, type MilestonePlan, type QuoteSelection } from "@/lib/quote/compute";
import { fmt } from "@/lib/quote/data";
import { clearQuoteSelection, loadQuoteSelection } from "@/lib/quote/store";

const BUSINESS_STAGE_OPTIONS = [
  { label: "Just an idea", value: "idea" },
  { label: "Formed, not yet operating", value: "formed" },
  { label: "Up and running", value: "operating" },
];

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "booking"; bookingUrl: string | null; subscriptionUrl: string | null };

function Loading() {
  return <div className="min-h-screen bg-background" />;
}

function BookingConfirmation({
  bookingUrl,
  subscriptionUrl,
  milestones,
}: {
  bookingUrl: string | null;
  subscriptionUrl: string | null;
  milestones: MilestonePlan | null;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-text-primary px-5 py-7 text-background sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">Leviora Ventures</p>
        <h1 className="mt-1.5 font-heading text-3xl font-semibold sm:text-4xl">You&apos;re all set.</h1>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-10">
        <div className="rounded-xl border border-border border-t-2 border-t-primary bg-surface p-6 shadow-soft-lg">
          <p className="text-[15px] text-text-primary">
            We&apos;ve got your quote and sent a confirmation to your inbox. Since your project is over $1,000, let&apos;s
            book a quick discovery call to confirm scope before anything is billed.
          </p>
          {milestones && (
            <p className="mt-3 text-[13px] text-text-secondary">
              Once we&apos;ve confirmed scope, we&apos;ll send a deposit link for{" "}
              <span className="font-semibold text-text-primary">{fmt(milestones.deposit)}</span> to kick things off,
              with {fmt(milestones.midpoint)} due at the midpoint and {fmt(milestones.final)} due on completion.
            </p>
          )}
          {bookingUrl ? (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-text-primary"
            >
              Book your discovery call
            </a>
          ) : (
            <p className="mt-5 text-[13px] text-text-secondary">We&apos;ll be in touch shortly to schedule your discovery call.</p>
          )}
          {subscriptionUrl && (
            <a href={subscriptionUrl} className="mt-3 block text-center text-[13px] font-medium text-primary underline">
              Set up your recurring services
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

export default function IntakeForm() {
  const router = useRouter();
  const [selection] = useState<QuoteSelection | null>(() => {
    const loaded = loadQuoteSelection();
    if (!loaded || computeQuote(loaded).lines.length === 0) return null;
    return loaded;
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessStage, setBusinessStage] = useState("");
  const [notes, setNotes] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    if (!selection) router.replace("/quote");
  }, [selection, router]);

  if (!selection) return <Loading />;

  const quote = computeQuote(selection);
  const milestones = computeMilestones(quote);

  if (submit.status === "booking") {
    return <BookingConfirmation bookingUrl={submit.bookingUrl} subscriptionUrl={submit.subscriptionUrl} milestones={milestones} />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmit({ status: "submitting" });

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selection,
          name,
          email,
          phone: phone || undefined,
          businessName: businessName || undefined,
          businessStage: businessStage || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmit({ status: "error", message: data.error ?? "Something went wrong — please try again." });
        return;
      }

      if (data.checkoutUrl) {
        clearQuoteSelection();
        window.location.href = data.checkoutUrl;
        return;
      }

      clearQuoteSelection();
      setSubmit({ status: "booking", bookingUrl: data.bookingUrl ?? null, subscriptionUrl: data.subscriptionUrl ?? null });
    } catch {
      setSubmit({ status: "error", message: "Something went wrong — please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-text-primary px-5 py-7 text-background sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">Leviora Ventures</p>
        <h1 className="mt-1.5 font-heading text-3xl font-semibold sm:text-4xl">Let&apos;s get started.</h1>
        <p className="mt-1.5 max-w-xl text-[15px] text-accent">
          A few details so we can confirm your quote and get things moving.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-9 sm:px-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Business name" name="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          <Select
            label="Where's your business at?"
            name="businessStage"
            placeholder="Select one"
            options={BUSINESS_STAGE_OPTIONS}
            value={businessStage}
            onChange={(e) => setBusinessStage(e.target.value)}
          />
          <Textarea
            label="Anything else we should know?"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {submit.status === "error" && (
            <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-[#a85a5a]">
              {submit.message}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={submit.status === "submitting"}>
            {quote.projectTotal > 1000 ? "Continue" : "Continue to payment"}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-6 h-fit">
          <QuoteLedger quote={quote} milestones={milestones} />
        </aside>
      </main>
    </div>
  );
}
