import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're all set — Leviora Ventures",
  description: "Your payment was received — we're getting started.",
};

export default function IntakeSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-xl border border-border border-t-2 border-t-primary bg-surface p-8 text-center shadow-soft-lg">
        <p className="text-[11px] uppercase tracking-[0.28em] text-text-secondary">Leviora Ventures</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-text-primary">You&apos;re all set.</h1>
        <p className="mt-3 text-[15px] text-text-secondary">
          Thanks — we&apos;ve received your payment and we&apos;re getting started. A confirmation email is on its way to your inbox.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-text-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
