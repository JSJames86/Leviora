import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Leviora Ventures — Business Consulting",
  description:
    "Strategic advisory and execution support for growing businesses. Track engagements, milestones, and deliverables through your dedicated client portal.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Nav */}
      <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-xl bg-primary text-white hover:bg-[#6aa7c3] transition-colors shadow-[var(--shadow-soft)]"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
          Business Consulting
        </p>
        <h1 className="font-heading text-5xl sm:text-6xl font-medium text-text-primary leading-[1.1] mb-6">
          Strategic clarity for<br className="hidden sm:block" /> every stage of growth
        </h1>
        <p className="max-w-xl mx-auto text-lg text-text-secondary leading-relaxed mb-10">
          Leviora Ventures partners with businesses to define strategy, drive
          execution, and deliver results — all tracked through your dedicated
          client portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-sm font-medium px-6 py-3 rounded-xl bg-primary text-white hover:bg-[#6aa7c3] transition-colors shadow-[var(--shadow-soft)]"
          >
            Sign in to your portal
          </Link>
          <a
            href="#services"
            className="inline-flex items-center justify-center text-sm font-medium px-6 py-3 rounded-xl border border-border bg-surface text-text-primary hover:border-primary/40 transition-colors"
          >
            Our services
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6 w-full">
        <div className="border-t border-border" />
      </div>

      {/* Services */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text-primary mb-3">
            How we work with you
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Every engagement is structured around clear goals, transparent
            progress, and polished deliverables.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 20h20" />
                  <path d="M5 20V8l7-5 7 5v12" />
                  <rect x="9" y="14" width="6" height="6" />
                </svg>
              ),
              title: "Strategic Planning",
              body: "We work with you to define where your business is headed and build a concrete roadmap to get there.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              ),
              title: "Execution Support",
              body: "Track milestones, review deliverables, and stay aligned at every step through your real-time client portal.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              ),
              title: "Transparent Reporting",
              body: "Receive professionally prepared reports and analyses, delivered directly to your secure portal.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-surface border border-border rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-accent/60 text-primary mb-4">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl font-medium text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text-primary mb-3">
              Your engagement, start to finish
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              From kickoff to final delivery, your portal keeps everything in
              one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { step: "01", label: "Scoping", desc: "We define goals, timeline, and deliverables together." },
              { step: "02", label: "Portal access", desc: "You receive a dedicated portal with your full engagement view." },
              { step: "03", label: "Live tracking", desc: "Monitor milestones and deliverables as they progress." },
              { step: "04", label: "Delivery", desc: "Download polished reports and close the engagement." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-heading text-4xl font-medium text-primary/30 mb-2">{item.step}</div>
                <h4 className="font-heading text-lg font-medium text-text-primary mb-1">{item.label}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-medium text-text-primary mb-4">
          Ready to get started?
        </h2>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          Sign in to your client portal or reach out to begin a new engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-sm font-medium px-6 py-3 rounded-xl bg-primary text-white hover:bg-[#6aa7c3] transition-colors shadow-[var(--shadow-soft)]"
          >
            Sign in to your portal
          </Link>
          <a
            href="mailto:hello@levioraventures.com"
            className="inline-flex items-center justify-center text-sm font-medium px-6 py-3 rounded-xl border border-border bg-surface text-text-primary hover:border-primary/40 transition-colors"
          >
            Contact us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Leviora Ventures. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
