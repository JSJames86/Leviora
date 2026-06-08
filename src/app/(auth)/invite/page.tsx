"use client";

import { useActionState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { setPassword, type ActionState } from "../actions";

const initialState: ActionState = {};

export default function InvitePage() {
  const [state, formAction, pending] = useActionState(setPassword, initialState);

  return (
    <AuthCard
      title="You've been invited to your Leviora client portal"
      subtitle="Set a password to finish creating your account."
    >
      <form action={formAction} className="space-y-4">
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          minLength={8}
          required
        />

        {state?.error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-[#a85a5a]">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Get started
        </Button>
      </form>
    </AuthCard>
  );
}
