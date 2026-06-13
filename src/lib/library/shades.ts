import chroma from "chroma-js";

// The 50..900 stops used to build a tint/shade scale from a single base color.
export const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type ShadeStop = (typeof SHADE_STOPS)[number];

export type ShadeScale = Record<ShadeStop, string>;

/**
 * Given a base hex color, produce a 50..900 scale by interpolating through
 * white -> base -> black in LAB space. 500 lands just past the base toward
 * black so the base color itself reads as the "mid" tone of the scale.
 */
export function generateScale(base: string): ShadeScale {
  const scale = chroma.scale(["white", base, "black"]).mode("lab");
  return Object.fromEntries(SHADE_STOPS.map((stop) => [stop, scale(stop / 1000 + 0.05).hex()])) as ShadeScale;
}
