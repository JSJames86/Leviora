import type { ComponentType } from "react";
import AetheraHero, { meta as aetheraHeroMeta } from "@/components/library/heroes/AetheraHero";
import TieredPricing, { meta as tieredPricingMeta } from "@/components/library/pricing/TieredPricing";

export type LibraryCategory = "hero" | "pricing" | "cta" | "portal" | "media-kit";

export type LibraryMeta = {
  slug: string;
  name: string;
  category: LibraryCategory;
  tags: readonly string[];
};

type RegistryEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- entries hold components with different `content` prop shapes
  component: ComponentType<any>;
  meta: LibraryMeta;
};

/**
 * Single source of truth mapping `slug -> component + meta`. The seed script
 * reads this registry and upserts a `templates` row per entry — the code
 * drives the database, never the reverse.
 */
export const registry: Record<string, RegistryEntry> = {
  [aetheraHeroMeta.slug]: { component: AetheraHero, meta: aetheraHeroMeta },
  [tieredPricingMeta.slug]: { component: TieredPricing, meta: tieredPricingMeta },
};

export function getEntry(slug: string): RegistryEntry | null {
  return registry[slug] ?? null;
}

export function listEntries(): RegistryEntry[] {
  return Object.values(registry);
}
