// Shared prop contracts for the template library. Every library component
// accepts a typed `content` prop holding its copy/CTA fields so the same
// component can be instantiated with different text per project.

export type LibraryCta = {
  label: string;
  href: string;
};

export type LibraryStat = {
  value: string;
  label: string;
};

export type AetheraHeroContent = {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  primaryCta: LibraryCta;
  secondaryCta?: LibraryCta;
  stats?: LibraryStat[];
};

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: LibraryCta;
  featured?: boolean;
};

export type TieredPricingContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  tiers: PricingTier[];
};

export type LibraryComponentProps<T> = {
  content: T;
};
