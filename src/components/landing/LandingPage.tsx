"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ── Scroll-triggered fade-up ── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Line-by-line headline reveal ── */
function AnimatedHeadline({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.55 + li * 0.13,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </>
  );
}

/* ── Sticky nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(240,249,255,0.92)" : "rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
      style={{ borderBottom: scrolled ? "1px solid rgba(100,170,220,0.15)" : "1px solid transparent" }}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="inline-flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full border border-sky-600/30 bg-white/50 text-sky-700">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c3 3.5 5 6.7 5 9.5a5 5 0 0 1-10 0C7 9.7 9 6.5 12 3Z" />
              <path d="M12 3c-3 3.5-5 6.7-5 9.5" opacity="0.4" />
            </svg>
          </span>
          <span className="font-heading text-2xl font-medium tracking-wide text-[#1a3347]">
            Leviora
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-[#1a3347]/80 hover:text-[#1a3347] transition-colors border border-[#1a3347]/20 hover:border-[#1a3347]/40 px-4 py-1.5 rounded-full"
        >
          Sign in
        </Link>
      </div>
    </motion.header>
  );
}

/* ── Main ── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="min-h-screen" style={{ background: "#f0f8fd", color: "#1a3347" }}>
      <Nav />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Daytime sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #87c4e8 0%, #aed8f0 25%, #cde9f7 55%, #e6f5fc 80%, #f2f9fd 100%)",
          }}
        />

        {/* Cloud-like drifting orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large cloud left */}
          <div
            className="absolute"
            style={{
              width: "65vw",
              height: "35vw",
              top: "8vw",
              left: "-10vw",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.3) 50%, transparent 70%)",
              filter: "blur(22px)",
              animation: "cloudDrift1 30s ease-in-out infinite alternate",
            }}
          />
          {/* Large cloud right */}
          <div
            className="absolute"
            style={{
              width: "55vw",
              height: "28vw",
              top: "5vw",
              right: "-8vw",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.65) 0%, rgba(240,250,255,0.25) 55%, transparent 70%)",
              filter: "blur(28px)",
              animation: "cloudDrift2 38s ease-in-out infinite alternate",
            }}
          />
          {/* Smaller cloud centre-top */}
          <div
            className="absolute"
            style={{
              width: "40vw",
              height: "20vw",
              top: "2vw",
              left: "30vw",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 65%)",
              filter: "blur(18px)",
              animation: "cloudDrift3 25s ease-in-out infinite alternate",
            }}
          />
          {/* Soft lower glow — horizon light */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{
              height: "40%",
              background:
                "linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Parallax hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-sky-700/60 mb-10"
          >
            Leviora Ventures
          </motion.p>

          <h1 className="font-heading text-[clamp(3.5rem,9.5vw,7.5rem)] leading-[0.94] font-medium text-[#0f2030] mb-10">
            <AnimatedHeadline lines={["Clarity for", "every stage", "of growth."]} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
            className="text-base sm:text-lg text-[#1a3347]/55 max-w-md mx-auto leading-relaxed mb-12"
          >
            Strategic advisory and execution support for ambitious businesses —
            delivered through your dedicated client portal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-sm font-medium px-7 py-3 rounded-full bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors shadow-sm"
            >
              Sign in to your portal
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center text-sm font-medium px-7 py-3 rounded-full border border-[#1a3347]/20 text-[#1a3347]/70 hover:border-[#1a3347]/40 hover:text-[#1a3347] transition-colors bg-white/30 backdrop-blur-sm"
            >
              Learn more
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#1a3347]/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#1a3347]/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Editorial intro ── */}
      <section id="about" className="mx-auto max-w-2xl px-6 py-32">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-600/70 mb-8">
            Our approach
          </p>
        </FadeUp>
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp delay={0.05}>
            <p>
              Every business reaches moments where the path forward is unclear — where the gap
              between where you are and where you want to be feels wider than it should.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              Leviora Ventures exists to close that gap. We work alongside leadership teams to build
              the strategies, systems, and clarity that move businesses forward — not in theory, but
              in practice.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#1a3347]/35 italic font-heading text-3xl leading-snug">
              &ldquo;Strategy without execution is just a wish.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>
              Your dedicated portal keeps every milestone, deliverable, and document in one
              transparent place — so you always know exactly where your engagement stands.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Services ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-600/70 mb-16">
            What we do
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-10">
          {[
            {
              num: "01",
              title: "Strategic Planning",
              body: "Define where your business is headed. We help you build a concrete roadmap — clear priorities, measurable goals, and a path that makes sense for where you actually are.",
            },
            {
              num: "02",
              title: "Execution Support",
              body: "Strategy means nothing without follow-through. We stay alongside you through implementation, tracking milestones and keeping momentum where it tends to stall.",
            },
            {
              num: "03",
              title: "Transparent Reporting",
              body: "Every deliverable, every report, every insight lives in your secure portal. No chasing emails. No wondering what's been done. Just clarity.",
            },
          ].map((item, i) => (
            <FadeUp key={item.num} delay={i * 0.1}>
              <div className="border-t border-[#1a3347]/10 pt-8">
                <span className="font-heading text-5xl font-medium text-[#1a3347]/10 block mb-6">
                  {item.num}
                </span>
                <h3 className="font-heading text-2xl font-medium text-[#0f2030] mb-4">
                  {item.title}
                </h3>
                <p className="text-sm text-[#1a3347]/55 leading-[1.85]">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-[#1a3347]/[0.07]" />
      </div>

      {/* ── Process ── */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <FadeUp>
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-600/70 mb-4">
            How it works
          </p>
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
                <div className="font-heading text-6xl font-medium text-sky-400/40 mb-4">
                  {item.step}
                </div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#1a3347]/60 mb-3">
                  {item.label}
                </h4>
                <p className="text-sm text-[#1a3347]/45 leading-[1.85]">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-40">
        {/* Sky backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #f2f9fd 0%, #d8eef8 50%, #c2e3f5 100%)",
          }}
        />
        {/* Cloud puffs */}
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
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-sm font-medium px-8 py-3.5 rounded-full bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors shadow-sm"
              >
                Sign in to your portal
              </Link>
              <a
                href="mailto:hello@levioraventures.com"
                className="inline-flex items-center justify-center text-sm font-medium px-8 py-3.5 rounded-full border border-[#1a3347]/20 text-[#1a3347]/70 hover:border-[#1a3347]/40 hover:text-[#1a3347] transition-colors bg-white/50"
              >
                Get in touch
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a3347]/[0.08]" style={{ background: "#e8f5fc" }}>
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full border border-sky-600/20 text-sky-700/60">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c3 3.5 5 6.7 5 9.5a5 5 0 0 1-10 0C7 9.7 9 6.5 12 3Z" />
              </svg>
            </span>
            <span className="font-heading text-base text-[#1a3347]/50">Leviora</span>
          </div>
          <p className="text-xs text-[#1a3347]/30">
            © {new Date().getFullYear()} Leviora Ventures
          </p>
        </div>
      </footer>

      {/* Cloud drift keyframes */}
      <style>{`
        @keyframes cloudDrift1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(4vw, -2vw) scale(1.06); }
        }
        @keyframes cloudDrift2 {
          0%   { transform: translate(0, 0) scale(1.04); }
          100% { transform: translate(-3vw, 2vw) scale(1); }
        }
        @keyframes cloudDrift3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-2vw, -3vw) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
