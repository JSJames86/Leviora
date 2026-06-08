"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password to continue." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "We couldn't sign you in with those details. Please try again." };
  }

  const role = (data.user?.app_metadata?.role as string | undefined) ?? "client";
  redirect(role === "admin" ? "/admin" : "/portal");
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Enter the email associated with your account." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/invite?type=recovery`,
  });

  // Always report success to avoid revealing whether an email is registered.
  return { success: true };
}

export async function setPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Your password should be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match — give it another try." };
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getUser();
  if (!sessionData.user) {
    return { error: "Your invite link has expired. Ask your Leviora contact to resend it." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "We couldn't set your password. Please try again." };
  }

  const role = (sessionData.user.app_metadata?.role as string | undefined) ?? "client";
  redirect(role === "admin" ? "/admin" : "/portal");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
