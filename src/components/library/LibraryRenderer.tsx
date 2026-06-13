import { getEntry } from "@/lib/library/registry";
import { PaletteProvider } from "./PaletteProvider";
import type { PaletteTokens } from "@/lib/library/roles";

/**
 * Ties a registry slug + palette together. The DB only ever stores the slug
 * (and a palette id) — the component itself always comes from the repo
 * registry, never from the database.
 */
export function LibraryRenderer({
  slug,
  tokens,
  content,
}: {
  slug: string;
  tokens: PaletteTokens;
  content?: unknown;
}) {
  const entry = getEntry(slug);
  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`No registry entry for slug "${slug}"`);
    }
    return null;
  }

  const Component = entry.component;
  return (
    <PaletteProvider tokens={tokens}>
      <Component content={content} />
    </PaletteProvider>
  );
}
