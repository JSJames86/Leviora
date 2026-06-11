"use client";

import Link from "next/link";
import Script from "next/script";
import { Nav } from "@/components/landing/Nav";
import { FadeUp } from "@/components/landing/FadeUp";
import { Footer } from "@/components/landing/Footer";

const CALENDLY_URL = "https://calendly.com/levioraventures";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

function openCalendly() {
  window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

const VENTURES = [
  {
    name: "Seed & Spoon",
    desc: "A Newark nonprofit fighting youth food insecurity by building modern distribution infrastructure for hunger relief.",
  },
  {
    name: "SpoonAssist",
    desc: "Grocery technology that finds families the lowest local prices on the food they already plan to eat.",
  },
  {
    name: "Leviora Ventures",
    desc: "Everything learned forming entities, filing with the IRS, building websites, registering with SAM.gov, and standing up operations from nothing — put to work for founders who are where she's been.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f0f8fd", color: "#1a3347" }}>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <Nav solid />

      {/* ── Intro ── */}
      <section className="mx-auto max-w-2xl px-6 pt-36 pb-20 sm:pt-44">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-6">About</p>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] leading-[1.1] mb-6">
            Janelle Glanville
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-[#1a3347]/60 text-lg leading-[1.8] max-w-xl">
            Engineer, operator, and founder of three ventures. From the projects in Elizabeth, NJ —
            building systems people use to save their own personal worlds.
          </p>
        </FadeUp>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── It started with a VCR. ── */}
      <section className="mx-auto max-w-2xl px-6 py-28">
        <FadeUp>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#0f2030] mb-10 leading-[1.15]">
            It started with a VCR.
          </h2>
        </FadeUp>
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp delay={0.05}>
            <p>
              I was five years old, growing up in the projects in Elizabeth, New Jersey, when I took
              apart our VCR just to see what was inside. Then I put it back together. It worked. That
              wasn&rsquo;t the start of a career — it was the start of how I think.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/30 italic font-heading text-3xl leading-snug">
              &ldquo;Everything is made of parts, parts can be understood, and what can be understood
              can be rebuilt.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p>
              My uncle saw something in that and gave me a full A/V system — not a toy, the real
              thing. I never stopped taking things apart after that.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>
              In college I built computers for fun. I also burned DVDs with uTorrent and Nero and
              sold them — which I mention not because I&rsquo;m proud of the catalog, but because it
              taught me something school never did: find what people want, figure out how to deliver
              it, handle your own operations. I&rsquo;ve been running supply chains since before I
              knew the word.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p>
              That&rsquo;s the thread through everything I do. The ideas have always come from lived
              experience. I studied code, binary, the Harvard CS curriculum, international studies,
              and business — and that education refined my process. But the ideas come from a place
              the process could never imagine.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── The work since. ── */}
      <section className="mx-auto max-w-2xl px-6 py-28">
        <FadeUp>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#0f2030] mb-10 leading-[1.15]">
            The work since.
          </h2>
        </FadeUp>
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp delay={0.05}>
            <p>My career didn&rsquo;t follow a clean line, because real ones rarely do.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              At 19, I was working at Helzberg Diamonds — a Berkshire Hathaway company — when I was
              introduced to Warren Buffett and Charlie Munger. They told me: whatever you invest in
              yourself, we&rsquo;ll match it. I took them at their word, and I invested. And they
              kept theirs — I had a T. Rowe Price portfolio before I turned 21, built on that match.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p>
              The bigger day-to-day education came from my boss there, who taught me how to read a
              business: what trends mean, where value hides, what&rsquo;s worth investing in. Those
              principles never left. I went looking for more of that thinking and found it in Ray
              Dalio&rsquo;s principles and Jeffrey Sachs&rsquo; economics — one taught me how systems
              of money work, the other taught me who they&rsquo;re supposed to work for. My mentors
              have always been heavy hitters; I just had to be ready to listen.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>
              That second question pulled me into politics. I worked on both of Bernie
              Sanders&rsquo; presidential campaigns, and that work taught me how systems move people —
              and how people move systems. Sales taught me how people actually make decisions.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p>
              My tech career started in 2016, when I came on as an advisor — and that advisory role
              got me appointed COO. From that seat, we acquired DesignPac Solutions: a business
              selling web development and design services, with all of our engineers based in India
              and Nepal. We basically did what the H-1B visa does without moving anyone. I eventually
              became CEO of DesignPac itself — the company we acquired, now mine to run. Leading a
              distributed engineering operation across continents taught me what breaks inside
              organizations — and that most businesses don&rsquo;t fail from lack of vision.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-[#1a3347]/30 italic font-heading text-3xl leading-snug">
              &ldquo;They fail from lack of infrastructure.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.35}>
            <p>Now I&rsquo;m a founder several times over.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Ventures grid ── */}
      <section id="ventures" className="mx-auto max-w-6xl px-6 pb-28 scroll-mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {VENTURES.map((v, i) => (
            <FadeUp key={v.name} delay={i * 0.08}>
              <div className="border-t-2 border-sky-400/30 pt-6 h-full">
                <h3 className="font-heading text-xl font-medium text-[#0f2030] mb-3">{v.name}</h3>
                <p className="text-sm text-[#1a3347]/50 leading-[1.8]">{v.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── Closing of work-since ── */}
      <section className="mx-auto max-w-2xl px-6 py-28">
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp>
            <p>
              I&rsquo;ve registered the LLCs. I&rsquo;ve filed the 1023-EZ. I&rsquo;ve built the
              systems, written the bylaws, deployed the platforms, and navigated the government
              portals that seem designed to make you quit. When I tell you I can get your business
              formed, funded, and functional — it&rsquo;s because I&rsquo;ve done it for my own, more
              than once.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      {/* ── What I believe. ── */}
      <section className="mx-auto max-w-2xl px-6 py-28">
        <FadeUp>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#0f2030] mb-10 leading-[1.15]">
            What I believe.
          </h2>
        </FadeUp>
        <div className="space-y-7 text-[#1a3347]/60 text-lg leading-[1.8]">
          <FadeUp delay={0.05}>
            <p>
              I&rsquo;m not trying to save the world. No one person can. What I can do is build
              systems and tools people use to save their own personal worlds — and that&rsquo;s not a
              smaller mission. It&rsquo;s the only one that actually works.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/30 italic font-heading text-3xl leading-snug">
              &ldquo;The money follows the problem, every time — never the other way around.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p>
              Every engagement I take has to be something I believe in, and it has to connect to
              something larger. Your LLC isn&rsquo;t just paperwork to me. It&rsquo;s the legal
              foundation of somebody&rsquo;s way out, somebody&rsquo;s family wealth, somebody&rsquo;s
              answer to a problem their community has been living with.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p>
              And I believe in readiness. Not waiting for opportunity — being ready when it arrives.
              That&rsquo;s what I build for my clients: businesses that are ready before the moment
              comes.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="text-[#0f2030] font-heading text-2xl leading-snug">
              New Jersey birthed me and shaped me. Washington, DC refined me. And the rest of the
              world made me a force to be reckoned with.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-sm uppercase tracking-[0.2em] text-[#1a3347]/40">
              — Janelle Glanville, Founder, Leviora Ventures
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-40">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #f2f9fd 0%, #d8eef8 50%, #c2e3f5 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <FadeUp>
            <h2 className="font-heading text-5xl sm:text-6xl font-medium text-[#0f2030] leading-[1.05] mb-6">
              Let&rsquo;s build something<br className="hidden sm:block" /> that lasts.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[#1a3347]/50 text-lg mb-12 max-w-sm mx-auto leading-relaxed">
              Get a custom quote, or schedule time to talk through where your business is headed.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote" className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm bg-[#1a3347] text-white hover:bg-[#243e55] transition-colors">
                Get a Quote
              </Link>
              <button onClick={openCalendly} className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-sm border border-[#1a3347]/25 text-[#1a3347]/70 hover:border-[#1a3347]/50 hover:text-[#1a3347] transition-colors">
                Schedule a Discovery Call
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
