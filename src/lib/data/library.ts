import { createClient } from "@/lib/supabase/server";
import type { Palette, Template } from "@/types";

export async function getTemplateLibrary(): Promise<{ templates: Template[]; palettes: Palette[] }> {
  const supabase = await createClient();
  const [{ data: templates }, { data: palettes }] = await Promise.all([
    supabase.from("templates").select("*").order("category").order("name"),
    supabase.from("palettes").select("*").order("owner").order("name"),
  ]);
  return { templates: templates ?? [], palettes: palettes ?? [] };
}
