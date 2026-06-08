import { createClient } from "@/lib/supabase/server";
import type { Client, User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();
  return data ?? null;
}

export async function getCurrentClient(): Promise<Client | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase.from("clients").select("*").eq("user_id", authUser.id).maybeSingle();
  return data ?? null;
}
