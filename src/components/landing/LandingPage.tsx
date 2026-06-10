"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav } from "./Nav";
import { FadeUp } from "./FadeUp";
import { VenturesRail } from "./VenturesRail";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIDEOS = ["/hero-sky.mp4", "/hero-hills.mp4"];
const CALENDLY_URL = "https://calendly.com/levioraventures";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

function openCalendly() {
  window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

/* ── Hero video — key-based remount so autoPlay fires on every switch (iOS-safe) ── */
function HeroVideo() {
  const [index, setIndex] = useState(0);

  return (
    <div className="absolute inset-0 scale-110">
      <AnimatePresence initial={false}>
        <motion.video
          key={index}
          src={VIDEOS[index]}
          autoPlay
          muted
          playsInline
          onEnded={() => setIndex((i) => (i + 1) % VIDEOS.length)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(5,18,30,0.60) 0%, rgba(5,18,30,0.25) 50%, rgba(5,18,30,0.12) 100%)",
        }}
      />
    </div>
  );
}

/* ── Main ── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.95 }
      );
      gsap.fromTo(
        scrollLabelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1.8 }
      );

      gsap.to([headlineRef.current, ctaRef.current, scrollLabelRef.current], {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "30% top",
          end: "70% top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f0f8fd", color: "#1a3347" }}>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <Nav />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <HeroVideo />

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10"
        >
          <Image
            src="/logo-white.png"
            alt="Leviora Ventures"
            width={140}
            height={56}
            className="h-10 sm:h-12 w-auto"
            style={{ opacity: 0.9 }}
            priority
          />
        </motion.div>

        <VenturesRail />

        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 pb-12 sm:pb-14">
          <h1
            ref={headlineRef}
            className="font-heading font-medium text-white leading-[1.05] mb-3 opacity-0"
            style={{ fontSize: "clamp(2.6rem,6.5vw,5.2rem)" }}
          >
            Business dreams,<br />elevated.
          </h1>
          <p className="text-white/55 text-sm mb-8 max-w-sm leading-relaxed opacity-0" ref={undefined}
            style={{ opacity: 1 }}
          >
            Helping startups, nonprofits, and enterprises turn ambitious goals into measurable outcomes.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-3 opacity-0">
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 bg-white/15 border border-white/40 text-white backdrop-blur-sm hover:bg-white/25 transition-colors rounded-sm"
            >
              Sign In to Portal
            </Link>
            <button
              onClick={openCalendly}
              className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 border border-white/30 text-white/80 hover:bg-white/10 transition-colors rounded-sm"
            >
              Schedule a Discovery Call
            </button>
          </div>
        </div>

        <div
          ref={scrollLabelRef}
          className="absolute bottom-6 right-6 sm:right-10 z-10 flex items-center gap-3 opacity-0"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ── Editorial intro ── */}
      <section id="about" className="mx-auto max-w-2xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-8">Our approach</p>
        </FadeUp>
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp delay={0.05}>
            <p>Every business reaches moments where the path forward is unclear — where the gap between where you are and where you want to be feels wider than it should.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>Leviora Ventures exists to close that gap. We work alongside leadership teams to build the strategies, systems, and clarity that move businesses forward — not in theory, but in practice.</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#1a3347]/30 italic font-heading text-3xl leading-snug">
              &ldquo;Strategy without execution is just a wish.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>Your dedicated portal keeps every milestone, deliverable, and document in one transparent place — so you always know exactly where your engagement stands.</p>
          </FadeUp>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── Who We Work With ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">Who we work with</p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-16 max-w-lg leading-[1.1]">
            Built for organizations that are serious about growth.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              label: "Startups",
              desc: "Early-stage and growth-stage ventures building scalable foundations and executing on ambitious roadmaps.",
            },
            {
              label: "Nonprofits",
              desc: "Mission-driven organizations navigating growth, grant readiness, program delivery, and operational clarity.",
            },
            {
              label: "Enterprises",
              desc: "Established businesses seeking strategic alignment, process improvement, and transparent project execution.",
            },
            {
              label: "Projects",
              desc: "Specific initiatives — product launches, restructuring, grant cycles — that need dedicated strategy and support.",
            },
          ].map((item, i) => (
            <FadeUp key={item.label} delay={i * 0.08}>
              <div className="border-t-2 border-sky-400/30 pt-6">
                <h3 className="font-heading text-xl font-medium text-[#0f2030] mb-3">{item.label}</h3>
                <p className="text-sm text-[#1a3347]/50 leading-[1.8]">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── Services ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-16">What we do</p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-10">
          {[
            { num: "01", title: "Strategic Planning", body: "Define where your business is headed. We help you build a concrete roadmap — clear priorities, measurable goals, and a path that makes sense for where you actually are." },
            { num: "02", title: "Execution Support", body: "Strategy means nothing without follow-through. We stay alongside you through implementation, tracking milestones and keeping momentum where it tends to stall." },
            { num: "03", title: "Transparent Reporting", body: "Every deliverable, every report, every insight lives in your secure portal. No chasing emails. No wondering what's been done. Just clarity." },
          ].map((item, i) => (
            <FadeUp key={item.num} delay={i * 0.1}>
              <div className="border-t border-[#1a3347]/10 pt-8">
                <span className="font-heading text-5xl font-medium text-[#1a3347]/10 block mb-6">{item.num}</span>
                <h3 className="font-heading text-2xl font-medium text-[#0f2030] mb-4">{item.title}</h3>
                <p className="text-sm text-[#1a3347]/55 leading-[1.85]">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── Packages ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">Our packages</p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-16 max-w-lg leading-[1.1]">
            Engagements designed around your stage.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              name: "Business Foundation",
              tagline: "For organizations establishing their strategic footing.",
              items: ["Strategic assessment", "Goal-setting & roadmap", "Portal setup & onboarding", "30-day execution plan"],
            },
            {
              name: "Growth Acceleration",
              tagline: "For teams ready to move from planning to measurable momentum.",
              items: ["Full execution support", "Weekly milestone tracking", "Live portal reporting", "Monthly strategy reviews"],
              featured: true,
            },
            {
              name: "Grant Readiness",
              tagline: "For nonprofits and mission-driven organizations pursuing funding.",
              items: ["Documentation preparation", "Financial modeling", "Impact reporting", "Funder-ready deliverables"],
            },
          ].map((pkg, i) => (
            <FadeUp key={pkg.name} delay={i * 0.1}>
              <div
                className="rounded-sm p-8 h-full flex flex-col"
                style={{
                  background: pkg.featured ? "#1a3347" : "rgba(255,255,255,0.6)",
                  border: pkg.featured ? "none" : "1px solid rgba(26,51,71,0.08)",
                }}
              >
                <div className="mb-6">
                  <h3
                    className="font-heading text-xl font-medium mb-2"
                    style={{ color: pkg.featured ? "#ffffff" : "#0f2030" }}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className="text-sm leading-[1.7]"
                    style={{ color: pkg.featured ? "rgba(255,255,255,0.55)" : "rgba(26,51,71,0.5)" }}
                  >
                    {pkg.tagline}
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                        style={{ background: pkg.featured ? "rgba(255,255,255,0.4)" : "rgba(96,165,250,0.6)" }}
                      />
                      <span
                        className="text-sm leading-[1.7]"
                        style={{ color: pkg.featured ? "rgba(255,255,255,0.7)" : "rgba(26,51,71,0.6)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={openCalendly}
                  className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-sm transition-colors"
                  style={{
                    background: pkg.featured ? "rgba(255,255,255,0.12)" : "transparent",
                    border: pkg.featured ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(26,51,71,0.2)",
                    color: pkg.featured ? "rgba(255,255,255,0.85)" : "rgba(26,51,71,0.65)",
                  }}
                >
                  Start a Conversation
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── Process ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-4">How it works</p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] mb-20 max-w-lg leading-[1.1]">
            Your engagement, start to finish.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {[
            { step: "01", label: "Scoping", desc: "We align on goals, scope, and success criteria before anything begins." },
            { step: "02", label: "Portal Access", desc: "You receive a dedicated portal with full visibility into your engagement." },
            { step: "03", label: "Live Tracking", desc: "Milestones and deliverables update in real time as work progresses." },
            { step: "04", label: "Delivery", desc: "Final reports and documentation delivered, archived, and yours to keep." },
          ].map((item, i) => (
            <FadeUp key={item.step} delay={i * 0.09}>
              <div>
                <div className="font-heading text-6xl font-medium text-sky-400/35 mb-4">{item.step}</div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#1a3347]/55 mb-3">{item.label}</h4>
                <p className="text-sm text-[#1a3347]/45 leading-[1.85]">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-40">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #f2f9fd 0%, #d8eef8 50%, #c2e3f5 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <FadeUp>
            <h2 className="font-heading text-5xl sm:text-6xl font-medium text-[#0f2030] leading-[1.05] mb-6">
              Ready to move<br className="hidden sm:block" /> forward?
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/50 text-lg mb-12 max-w-sm mx-auto leading-relaxed">
              Sign in to your client portal, or reach out to begin a new engagement.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login" className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors">
                Sign in to your portal
              </Link>
              <button onClick={openCalendly} className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors">
                Schedule a Discovery Call
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a3347]/[0.08]" style={{ background: "#e8f5fc" }}>
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <Image src="/logo-black.png" alt="Leviora Ventures" width={80} height={32} className="h-6 w-auto opacity-40" />
          <p className="text-xs tracking-wider text-[#1a3347]/30 uppercase">© {new Date().getFullYear()} Leviora Ventures</p>
        </div>
      </footer>
    </div>
  );
}
