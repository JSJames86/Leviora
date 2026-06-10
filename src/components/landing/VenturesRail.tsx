"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/* ════════════════════════════════════════════════════════
   VENTURES — A LIVING RESUME
   Triggered by the vertical "Ventures" rail on the hero.
   Edit everything in the DATA block below.
   ════════════════════════════════════════════════════════ */

type Venture = {
  id: string;
  kicker: string;
  name: string;
  year: string;
  summary: string;
  proof?: string[];
  link?: string;
  linkLabel?: string;
};

type Work = {
  name: string;
  type: string;
  detail: string;
  link?: string;
};

type SkillGroup = {
  group: string;
  items: string[];
};

const VENTURES: Venture[] = [
  {
    id: "seedspoon",
    kicker: "Nonprofit · Founder & Executive Director",
    name: "Seed & Spoon",
    year: "2026 —",
    summary:
      "A Newark nonprofit fighting youth food insecurity by building modern distribution infrastructure for hunger relief — a full operating platform, commercial kitchen operations, and a community pilot serving local families.",
    proof: [
      "Built & deployed a unified operating platform (Next.js, Supabase, Stripe)",
      "Published white paper: “Modernizing Hunger Relief” (Zenodo, DOI 10.5281/zenodo.20299779)",
      "Full HACCP & food-safety SOP library for commercial kitchen ops",
      "5 Loaves Summer Pilot — launching July 2026",
    ],
    link: "https://seedandspoon.org",
    linkLabel: "seedandspoon.org",
  },
  {
    id: "spoonassist",
    kicker: "Technology · Founder",
    name: "SpoonAssist",
    year: "2026 —",
    summary:
      "Grocery intelligence for families: paste a recipe link, get every ingredient priced at the lowest local cost. Consumer technology built from the same mission as Seed & Spoon — food access through better information.",
    proof: [
      "Recipe → ingredient extraction → live local pricing (Instacart Developer API)",
      "In active investor development",
    ],
  },
  {
    id: "leviora",
    kicker: "Consulting · Founder",
    name: "Leviora Ventures",
    year: "2026 —",
    summary:
      "Formation, infrastructure, and capital readiness for founders. Every service offered is something I've executed for my own ventures first — entities formed, federal filings done, platforms shipped.",
    link: "/quote",
    linkLabel: "Build a quote",
  },
  {
    id: "designpac",
    kicker: "Acquisition · COO → CEO",
    name: "DesignPac Solutions",
    year: "2016 —",
    summary:
      "Joined as an advisor, appointed COO, led the acquisition — then became CEO of the company we acquired. Distributed web development and design services with engineering teams across India and Nepal.",
    proof: ["Led a distributed engineering org across three continents"],
  },
];

const WORKS: Work[] = [
  {
    name: "Modernizing Hunger Relief",
    type: "White paper",
    detail: "Published on Zenodo · CC BY-NC-ND 4.0 · DOI 10.5281/zenodo.20299779",
    link: "https://doi.org/10.5281/zenodo.20299779",
  },
  {
    name: "All the Black-Owned, Babee!",
    type: "Full client engagement",
    detail:
      "For author Kay Martin: book jacket design, built mrsblackowned.com, and ongoing business advisory — operations, setup, and growth strategy. Veteran-owned business certification in progress.",
    link: "https://mrsblackowned.com/",
  },
  {
    name: "OFSA Implementation Planning Toolkit",
    type: "Framework",
    detail: "Complete operational planning toolkit for food security organizations",
  },
  {
    name: "Impact Engine",
    type: "Interactive tool",
    detail: "Scenario modeling on real county-level food-insecurity data",
    link: "https://seedandspoon.org/impact",
  },
];

const SKILLS: SkillGroup[] = [
  {
    group: "Engineering",
    items: ["PostgreSQL", "Python · Django · FastAPI", "Next.js · React", "Supabase", "Docker", "Google Cloud", "Stripe & payments infrastructure"],
  },
  {
    group: "Operations",
    items: ["Nonprofit formation & 501(c)(3)", "HACCP & food-safety systems", "SAM.gov / federal registration", "Event planning & production", "Process & SOP design", "Distributed team leadership"],
  },
  {
    group: "Strategy",
    items: ["Business model design", "Capital & grant readiness", "Financial modeling", "Brand & go-to-market", "Systems thinking"],
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

function VentureLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className =
    "mt-4 inline-block border-b border-white/50 pb-0.5 text-sm tracking-wide text-white transition-colors hover:border-white";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export function VenturesRail() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActive(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Ventures — a living resume"
        className="group fixed right-6 top-1/2 z-40 sm:right-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
      >
        <span className="font-heading text-sm uppercase tracking-[0.45em] text-white/50 transition-colors group-hover:text-white/80 sm:text-base">
          Ventures
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Ventures — the work"
            style={{ background: "linear-gradient(180deg,#0b1f4b 0%,#16306b 55%,#27448c 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(60% 28% at 20% 88%, rgba(255,255,255,.5), transparent 70%), radial-gradient(50% 22% at 85% 75%, rgba(255,255,255,.35), transparent 70%)",
              }}
            />

            <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-10 text-white">
              <div className="mb-10 flex items-start justify-between">
                <motion.div {...fadeIn(0.05)}>
                  <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">A living resume</p>
                  <h2 className="mt-2 font-heading text-4xl font-medium sm:text-5xl">The work.</h2>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
                    Everything here was built, filed, shipped, or run by me. Not advised on — done.
                  </p>
                </motion.div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setActive(null);
                  }}
                  aria-label="Close"
                  className="rounded-full border border-white/40 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  Close
                </button>
              </div>

              {/* Ventures */}
              <motion.section {...fadeIn(0.12)}>
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.4em] text-white/55">Ventures</h3>
                <div className="space-y-3">
                  {VENTURES.map((v) => {
                    const isOpen = active === v.id;
                    return (
                      <div
                        key={v.id}
                        className="overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-sm transition-colors hover:border-white/30"
                      >
                        <button
                          onClick={() => setActive(isOpen ? null : v.id)}
                          aria-expanded={isOpen}
                          className="flex w-full items-baseline justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                          <span>
                            <span className="block text-[11px] uppercase tracking-[0.25em] text-white/55">{v.kicker}</span>
                            <span className="block font-heading text-2xl font-medium">{v.name}</span>
                          </span>
                          <span className="shrink-0 text-sm text-white/50">{v.year}</span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-white/10 px-5 pb-5 pt-4">
                            <p className="text-[15px] leading-relaxed text-white/85">{v.summary}</p>
                            {v.proof && (
                              <ul className="mt-3 space-y-1.5">
                                {v.proof.map((p) => (
                                  <li key={p} className="flex gap-2.5 text-[14px] text-white/70">
                                    <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/60" />
                                    {p}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {v.link && v.linkLabel && <VentureLink href={v.link}>{v.linkLabel} →</VentureLink>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {/* Selected works */}
              <motion.section {...fadeIn(0.19)} className="mt-12">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.4em] text-white/55">Selected works &amp; frameworks</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {WORKS.map((w) => {
                    const content = (
                      <>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{w.type}</p>
                        <p className="mt-1 font-heading text-lg font-medium leading-snug">{w.name}</p>
                        <p className="mt-1.5 text-[13px] leading-snug text-white/65">{w.detail}</p>
                      </>
                    );
                    const cardClassName = "rounded-xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors";
                    return w.link ? (
                      <a key={w.name} href={w.link} target="_blank" rel="noopener noreferrer" className={`${cardClassName} hover:border-white/40`}>
                        {content}
                      </a>
                    ) : (
                      <div key={w.name} className={`${cardClassName} cursor-default`}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {/* Skills */}
              <motion.section {...fadeIn(0.26)} className="mt-12">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.4em] text-white/55">Capabilities</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {SKILLS.map((s) => (
                    <div key={s.group}>
                      <p className="mb-2 font-heading text-base font-semibold text-white/90">{s.group}</p>
                      <ul className="space-y-1">
                        {s.items.map((it) => (
                          <li key={it} className="text-[13.5px] leading-relaxed text-white/70">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>

              <p className="mt-14 text-center font-heading text-sm italic text-white/55">Readiness, waiting for timing.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
