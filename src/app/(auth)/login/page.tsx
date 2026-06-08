"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { login, type ActionState } from "../actions";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Leviora client portal.">
      <form action={formAction} className="space-y-4">
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />

        {state?.error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-[#a85a5a]">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Sign in
        </Button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-text-secondary hover:text-primary">
            Forgot your password?
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
