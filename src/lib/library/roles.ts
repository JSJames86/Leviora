// Canonical semantic color roles for the template library.
// Library components style themselves only via these roles (and the
// generated `primary-*` shade scale) — never with literal hex values or
// brand-name classes like `bg-teal-600`.
export const PALETTE_ROLES = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "text",
  "text-muted",
  "border",
  "success",
  "warning",
  "error",
] as const;

export type PaletteRole = (typeof PALETTE_ROLES)[number];

export type PaletteTokens = Record<PaletteRole, string>;
