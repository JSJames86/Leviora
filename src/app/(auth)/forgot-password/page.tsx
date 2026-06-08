"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CheckCircleIcon } from "@/components/ui/icons";
import { requestPasswordReset, type ActionState } from "../actions";

const initialState: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state?.success) {
    return (
      <AuthCard title="Check your inbox" subtitle="If that email is on file, a reset link is on its way.">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/20 text-[#3f7a5d]">
            <CheckCircleIcon className="size-6" />
          </span>
          <p className="text-sm text-text-secondary">
            Follow the link in the email to set a new password. It may take a minute or two to arrive — be sure to check spam.
          </p>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="We'll send a link to reset it.">
      <form action={formAction} className="space-y-4">
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />

        {state?.error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-[#a85a5a]">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Send reset link
        </Button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-text-secondary hover:text-primary">
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
