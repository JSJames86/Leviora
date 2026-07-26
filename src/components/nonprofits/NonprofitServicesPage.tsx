"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Nav } from "@/components/landing/Nav";
import { FadeUp } from "@/components/landing/FadeUp";
import { nonprofitServices } from "@/lib/data/nonprofit-services";

const CALENDLY_URL = "https://calendly.com/levioraventures";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

function openCalendly() {
  window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "grant-writing": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  "research-evaluation": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  "strategic-consulting": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
  "technical-writing": (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
};

export default function NonprofitServicesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f0f8fd", color: "#1a3347" }}>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <Nav solid />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(100,170,220,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <FadeUp>
            <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-6">
              For Nonprofits & Public Agencies
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1
              className="font-heading font-medium text-[#0f2030] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)" }}
            >
              Strategy, Built and Proven.
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/60 text-lg leading-[1.8] max-w-2xl mx-auto mb-10">
              Leviora partners with nonprofits and mission-driven organizations to secure
              funding, strengthen programs, and stand up the systems that make impact
              measurable — from someone who has built and run a funded nonprofit end to end.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors"
              >
                Book a Discovery Call
              </button>
              <a
                href="https://seedandspoon.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors"
              >
                See the Proof &rarr;
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Services Grid ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">
            What I Help You Do
          </p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-6 max-w-2xl leading-[1.1]">
            Comprehensive support across the funding lifecycle.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-[#1a3347]/50 text-lg mb-16 max-w-2xl leading-[1.7]">
            Every service backed by work I&rsquo;ve already shipped, not just advised on.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {nonprofitServices.map((service, i) => (
            <FadeUp key={service.id} delay={i * 0.08}>
              <div
                className="rounded-sm p-8 h-full flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(26,51,71,0.08)",
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="shrink-0 w-12 h-12 rounded-sm flex items-center justify-center"
                    style={{
                      background: "rgba(100,170,220,0.1)",
                      color: "#5a9fc4",
                    }}
                  >
                    {SERVICE_ICONS[service.id]}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-medium text-[#0f2030] leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#1a3347]/50 mt-1 leading-[1.6]">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span
                        className="mt-2 w-1 h-1 rounded-full shrink-0"
                        style={{ background: "rgba(96,165,250,0.6)" }}
                      />
                      <span className="text-sm text-[#1a3347]/60 leading-[1.7]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {service.proof.href && (
                  <a
                    href={service.proof.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-wide px-3.5 py-2 rounded-full transition-colors self-start"
                    style={{
                      background: "rgba(100,170,220,0.1)",
                      color: "#3d7fa5",
                      border: "1px solid rgba(100,170,220,0.2)",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {service.proof.label}
                  </a>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Why Partner Strip ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">
            Why Partner With Leviora
          </p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-16 max-w-lg leading-[1.1]">
            Not just advice. The full build.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              label: "Built, Not Just Advised",
              desc: "A live, funded nonprofit as the case study — not a slide deck.",
            },
            {
              label: "Federal-Ready",
              desc: "SAM.gov, UEI, and CAGE already in hand. Your registration won’t start from zero.",
            },
            {
              label: "Technical Depth",
              desc: "I build the platform and write the grant. Strategy and systems from the same person.",
            },
            {
              label: "Published & Credentialed",
              desc: "DOI-backed white paper, ORCID 0009-0002-2978-2707. Work that stands up to peer review.",
            },
          ].map((item, i) => (
            <FadeUp key={item.label} delay={i * 0.08}>
              <div className="border-t-2 border-sky-400/30 pt-6">
                <h3 className="font-heading text-xl font-medium text-[#0f2030] mb-3">
                  {item.label}
                </h3>
                <p className="text-sm text-[#1a3347]/50 leading-[1.8]">
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Differentiator Quote ── */}
      <section className="mx-auto max-w-2xl px-6 py-28">
        <FadeUp>
          <p className="text-[#1a3347]/30 italic font-heading text-3xl leading-snug text-center">
            &ldquo;Most consultants hand you a strategy. I built and run a tech-enabled
            nonprofit end to end — the grants, the evaluation, the compliance, the
            platform. You get the playbook from someone who has actually done it, not just
            advised on it.&rdquo;
          </p>
        </FadeUp>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Anchor Case Study: Seed & Spoon ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-12 items-start">
          <div className="sm:col-span-3">
            <FadeUp>
              <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">
                The Proof
              </p>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-8 leading-[1.1]">
                Seed & Spoon
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[#1a3347]/60 text-lg leading-[1.8] mb-8">
                Janelle founded and runs Seed & Spoon, a tech-enabled food-distribution
                nonprofit — incorporated, federally registered, with a published white
                paper, a live impact platform, filed state funding commitments, and a full
                operational compliance stack (HACCP, SOPs). Every service on this page is
                something done there first.
              </p>
            </FadeUp>
            <FadeUp delay={0.14}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/case-studies/seed-and-spoon"
                  className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-sm bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors"
                >
                  Read the full case study &rarr;
                </Link>
                <a
                  href="https://seedandspoon.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors"
                >
                  Visit seedandspoon.org &rarr;
                </a>
              </div>
            </FadeUp>
          </div>
          <div className="sm:col-span-2">
            <FadeUp delay={0.12}>
              <div
                className="rounded-sm p-6"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(26,51,71,0.08)",
                }}
              >
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1a3347]/40 mb-5">
                  Artifacts
                </h4>
                <ul className="space-y-4">
                  {[
                    "501(c)(3) incorporated",
                    "SAM.gov / UEI / CAGE registered",
                    "White paper on Zenodo (DOI-backed)",
                    "HACCP plan & production SOPs",
                    "Live impact measurement platform",
                    "Filed OFSA funding commitments",
                    "5-metric research model",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5a9fc4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-[#1a3347]/60 leading-[1.7]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative overflow-hidden py-40">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #f2f9fd 0%, #d8eef8 50%, #c2e3f5 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <FadeUp>
            <h2 className="font-heading text-5xl sm:text-6xl font-medium text-[#0f2030] leading-[1.05] mb-6">
              Let&rsquo;s get your work
              <br className="hidden sm:block" /> funded and legible.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/50 text-lg mb-12 max-w-sm mx-auto leading-relaxed">
              Start with a discovery call. Bring your mission — I&rsquo;ll bring the
              infrastructure.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors"
              >
                Book a Discovery Call
              </button>
              <a
                href="https://seedandspoon.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors"
              >
                See Seed & Spoon &rarr;
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t border-[#1a3347]/[0.08]"
        style={{ background: "#e8f5fc" }}
      >
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <Image
            src="/logo-black.png"
            alt="Leviora Ventures"
            width={80}
            height={32}
            className="h-6 w-auto opacity-40"
          />
          <p className="text-xs tracking-wider text-[#1a3347]/30 uppercase">
            &copy; {new Date().getFullYear()} Leviora Ventures
          </p>
        </div>
      </footer>
    </div>
  );
}
