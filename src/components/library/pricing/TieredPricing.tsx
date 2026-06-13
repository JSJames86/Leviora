import { CheckCircleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { TieredPricingContent } from "../_types";

export const meta = {
  slug: "tiered-pricing",
  name: "Tiered Pricing",
  category: "pricing",
  tags: ["pricing", "comparison", "cta"],
} as const;

const DEFAULT_CONTENT: TieredPricingContent = {
  eyebrow: "Our packages",
  headline: "Engagements designed around your stage.",
  subheadline: "Every tier includes full portal access, milestone tracking, and direct access to your specialist.",
  tiers: [
    {
      name: "Starter",
      price: "$997",
      tagline: "The essentials to get your business off the ground.",
      features: ["Foundational filings & registrations", "Guided intake & document prep", "Email support throughout"],
      cta: { label: "Get started", href: "#contact" },
    },
    {
      name: "Growth",
      price: "$2,997",
      tagline: "Ongoing support as you build momentum.",
      features: [
        "Everything in Starter",
        "Multiple coordinated engagements",
        "Milestone tracking & check-ins",
        "Priority response times",
      ],
      cta: { label: "Start a conversation", href: "#contact" },
      featured: true,
    },
    {
      name: "Elevated",
      price: "$7,997",
      tagline: "White-glove, full-service partnership.",
      features: [
        "Everything in Growth",
        "End-to-end engagement management",
        "Dedicated specialist & monthly strategy reviews",
        "Fastest turnaround on deliverables",
      ],
      cta: { label: "Talk to us", href: "#contact" },
    },
  ],
};

export default function TieredPricing({ content = DEFAULT_CONTENT }: { content?: TieredPricingContent }) {
  const { eyebrow, headline, subheadline, tiers } = content;

  return (
    <section className="bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-600">{eyebrow}</p>
          ) : null}
          <h2 className="font-heading mt-4 text-3xl font-medium leading-[1.1] text-text sm:text-5xl">{headline}</h2>
          {subheadline ? <p className="mt-4 text-base text-text-muted sm:text-lg">{subheadline}</p> : null}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-2xl border p-8",
                tier.featured
                  ? "border-primary-600 bg-primary-50 shadow-[var(--shadow-soft-lg)] lg:-translate-y-3"
                  : "border-border bg-surface"
              )}
            >
              {tier.featured ? (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-background">
                  Most popular
                </span>
              ) : null}

              <h3 className="font-heading text-xl font-medium text-text">{tier.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-heading text-4xl font-medium text-text">{tier.price}</span>
                {tier.period ? <span className="text-sm text-text-muted">{tier.period}</span> : null}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-text">
                    <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-primary-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.cta.href}
                className={cn(
                  "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors",
                  tier.featured
                    ? "bg-primary-600 text-background hover:bg-primary-700"
                    : "border border-border text-text hover:border-primary-600 hover:text-primary-600"
                )}
              >
                {tier.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
