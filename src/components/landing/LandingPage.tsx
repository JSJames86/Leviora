"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIDEOS = ["/hero-sky.mp4", "/hero-hills.mp4"];

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
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      animate={{ backgroundColor: scrolled ? "rgba(240,249,255,0.93)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
      style={{ borderBottom: scrolled ? "1px solid rgba(100,170,220,0.18)" : "1px solid transparent" }}
    >
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-heading text-sm tracking-[0.18em] uppercase"
          style={{ color: scrolled ? "#1a3347" : "rgba(255,255,255,0.9)" }}
        >
          Leviora Ventures
        </motion.span>
        <Link
          href="/login"
          className="text-xs font-medium tracking-wider uppercase transition-colors px-4 py-1.5 rounded-full border"
          style={{
            color: scrolled ? "#1a3347" : "rgba(255,255,255,0.85)",
            borderColor: scrolled ? "rgba(26,51,71,0.25)" : "rgba(255,255,255,0.35)",
          }}
        >
          Sign In
        </Link>
      </div>
    </motion.header>
  );
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
      {/* Gradient overlay for text legibility */}
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
      <Nav />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <HeroVideo />

        {/* Top-left logo — screen blend removes the white box on dark backgrounds */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10"
        >
          <Image
            src="/logo-black.png"
            alt="Leviora Ventures"
            width={140}
            height={56}
            className="h-10 sm:h-12 w-auto"
            style={{ filter: "invert(1)", mixBlendMode: "screen", opacity: 0.9 }}
            priority
          />
        </motion.div>

        {/* Vertical "VENTURES" — right side */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="absolute right-6 sm:right-8 top-1/2 z-10 select-none"
          style={{
            writingMode: "vertical-rl",
            transform: "translateY(-50%) rotate(180deg)",
          }}
        >
          <span className="font-heading text-sm sm:text-base tracking-[0.45em] uppercase text-white/50">
            Ventures
          </span>
        </motion.div>

        {/* Bottom-left headline + CTAs */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 pb-12 sm:pb-14">
          <h1
            ref={headlineRef}
            className="font-heading font-medium text-white leading-[1.05] mb-8 opacity-0"
            style={{ fontSize: "clamp(2.6rem,6.5vw,5.2rem)" }}
          >
            Business dreams,<br />elevated.
          </h1>

          <div ref={ctaRef} className="flex flex-wrap gap-3 opacity-0">
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 bg-white/15 border border-white/40 text-white backdrop-blur-sm hover:bg-white/25 transition-colors rounded-sm"
            >
              Sign In to Portal
            </Link>
            <a
              href="mailto:hello@levioraventures.com"
              className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-6 py-3 border border-white/30 text-white/80 hover:bg-white/10 transition-colors rounded-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Scroll to explore */}
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
              <a href="mailto:hello@levioraventures.com" className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors">
                Get in touch
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a3347]/[0.08]" style={{ background: "#e8f5fc" }}>
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <Image src="/logo-black.png" alt="Leviora Ventures" width={80} height={32} className="h-6 w-auto opacity-35" style={{ mixBlendMode: "multiply" }} />
          <p className="text-xs tracking-wider text-[#1a3347]/30 uppercase">© {new Date().getFullYear()} Leviora Ventures</p>
        </div>
      </footer>
    </div>
  );
}
