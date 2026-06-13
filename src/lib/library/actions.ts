"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface InstantiateTemplateInput {
  engagementId: string;
  slug: string;
  paletteId: string;
  content?: Record<string, unknown>;
  sortOrder?: number;
}

/**
 * Attaches a library template + palette to a client engagement. This is the
 * hook the quote builder / onboarding flow calls once templates and a
 * palette have been picked for a client's package.
 */
export async function instantiateTemplate(input: InstantiateTemplateInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role as string | undefined) ?? "client";
  if (!user || role !== "admin") return { error: "Only Leviora admins can add templates to a project." };

  const { data, error } = await supabase
    .from("project_templates")
    .insert({
      engagement_id: input.engagementId,
      template_slug: input.slug,
      palette_id: input.paletteId,
      content: input.content ?? null,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error || !data) return { error: "Couldn't add that template to the project — please try again." };

  revalidatePath(`/admin/engagements/${input.engagementId}`);
  return { success: true, projectTemplate: data };
}
