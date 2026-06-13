// Seeds the `templates` catalog from the code registry (lib/library/registry.ts)
// and the Leviora reference palette. Code is the source of truth: adding a
// component to the registry and re-running this script keeps the DB index in
// sync. Run with `npm run seed:library` (add `--prune` to remove templates
// rows whose slug no longer exists in the registry).

import { createAdminClient } from "@/lib/supabase/admin";
import { registry } from "@/lib/library/registry";
import type { PaletteTokens } from "@/lib/library/roles";

const LEVIORA_PALETTE: { name: string; owner: string; tokens: PaletteTokens } = {
  name: "Leviora",
  owner: "leviora",
  tokens: {
    primary: "#7bb8d4",
    secondary: "#a8d4e8",
    accent: "#c5e4f3",
    background: "#fafaf7",
    surface: "#ffffff",
    text: "#1c2b35",
    "text-muted": "#6b8a99",
    border: "#e8f0f4",
    success: "#7bc4a0",
    warning: "#f0d9a8",
    error: "#e8a0a0",
  },
};

async function main() {
  const prune = process.argv.includes("--prune");
  const supabase = createAdminClient();

  const rows = Object.values(registry).map(({ meta }) => ({
    slug: meta.slug,
    name: meta.name,
    category: meta.category,
    tags: [...meta.tags],
  }));

  const { error: upsertError } = await supabase.from("templates").upsert(rows, { onConflict: "slug" });
  if (upsertError) throw upsertError;
  console.log(`Upserted ${rows.length} template${rows.length === 1 ? "" : "s"} from the registry.`);

  if (prune) {
    const slugs = rows.map((row) => row.slug);
    const { data: existing, error: selectError } = await supabase.from("templates").select("slug");
    if (selectError) throw selectError;

    const stale = (existing ?? []).map((row) => row.slug).filter((slug) => !slugs.includes(slug));
    if (stale.length) {
      const { error: deleteError } = await supabase.from("templates").delete().in("slug", stale);
      if (deleteError) throw deleteError;
      console.log(`Pruned ${stale.length} stale template${stale.length === 1 ? "" : "s"}: ${stale.join(", ")}`);
    }
  }

  const { data: existingPalette, error: paletteSelectError } = await supabase
    .from("palettes")
    .select("id")
    .eq("name", LEVIORA_PALETTE.name)
    .eq("owner", LEVIORA_PALETTE.owner)
    .maybeSingle();
  if (paletteSelectError) throw paletteSelectError;

  if (existingPalette) {
    const { error } = await supabase.from("palettes").update({ tokens: LEVIORA_PALETTE.tokens }).eq("id", existingPalette.id);
    if (error) throw error;
    console.log(`Updated "${LEVIORA_PALETTE.name}" palette.`);
  } else {
    const { error } = await supabase.from("palettes").insert(LEVIORA_PALETTE);
    if (error) throw error;
    console.log(`Seeded "${LEVIORA_PALETTE.name}" palette.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
