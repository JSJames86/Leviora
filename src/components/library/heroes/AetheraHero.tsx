import type { AetheraHeroContent } from "../_types";

export const meta = {
  slug: "aethera-hero",
  name: "Aethera Cinematic Hero",
  category: "hero",
  tags: ["dark", "cinematic", "gradient"],
} as const;

const DEFAULT_CONTENT: AetheraHeroContent = {
  eyebrow: "Strategy, elevated",
  headline: "Business dreams, elevated.",
  subheadline:
    "We help startups, nonprofits, and enterprises turn ambitious goals into measurable outcomes — with full transparency at every step.",
  primaryCta: { label: "Start a conversation", href: "#contact" },
  secondaryCta: { label: "See how it works", href: "#process" },
  stats: [
    { value: "120+", label: "Engagements delivered" },
    { value: "98%", label: "Client retention" },
    { value: "4–8 wks", label: "Typical timeline" },
    { value: "24/7", label: "Portal access" },
  ],
};

export default function AetheraHero({ content = DEFAULT_CONTENT }: { content?: AetheraHeroContent }) {
  const { eyebrow, headline, subheadline, primaryCta, secondaryCta, stats } = content;

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-1/3 right-[-10%] size-[60vw] rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[45vw] rounded-full bg-primary-500/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        {eyebrow ? (
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-primary-100/70">{eyebrow}</p>
        ) : null}

        <h1 className="font-heading max-w-3xl text-4xl font-medium leading-[1.05] text-background sm:text-6xl">
          {headline}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-50/70 sm:text-lg">{subheadline}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-primary-900 transition-transform duration-200 hover:scale-[1.03]"
          >
            {primaryCta.label}
          </a>
          {secondaryCta ? (
            <a
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-primary-100/30 px-7 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-100/10"
            >
              {secondaryCta.label}
            </a>
          ) : null}
        </div>

        {stats && stats.length > 0 ? (
          <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-primary-100/15 pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-heading text-3xl font-medium text-background sm:text-4xl">{stat.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-primary-100/60">{stat.label}</dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
