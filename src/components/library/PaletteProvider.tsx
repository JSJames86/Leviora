import type { CSSProperties, ReactNode } from "react";
import type { PaletteTokens } from "@/lib/library/roles";
import { generateScale } from "@/lib/library/shades";

/**
 * Injects a palette's semantic color tokens as CSS variables for its
 * subtree. Library components style themselves with Tailwind utilities
 * (`bg-primary`, `text-text-muted`, `bg-primary-700`, ...) that resolve to
 * these variables, so swapping the palette reskins every component beneath
 * with no component changes.
 */
export function PaletteProvider({ tokens, children }: { tokens: PaletteTokens; children: ReactNode }) {
  const vars: Record<string, string> = {};
  for (const [role, hex] of Object.entries(tokens)) {
    vars[`--color-${role}`] = hex;
  }
  for (const [stop, hex] of Object.entries(generateScale(tokens.primary))) {
    vars[`--color-primary-${stop}`] = hex;
  }
  return <div style={vars as CSSProperties}>{children}</div>;
}
