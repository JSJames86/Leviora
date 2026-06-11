import Link from "next/link";

/* ════════════════════════════════════════════════════════
   SITE FOOTER
   Matches the navy-sky landing aesthetic. Edit links in NAV.
   ════════════════════════════════════════════════════════ */

type FooterLinkItem = { label: string; href: string };

const NAV: Record<string, FooterLinkItem[]> = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Ventures", href: "/about#ventures" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Client Sign In", href: "/portal" },
  ],
  Services: [
    { label: "Business Formation", href: "/quote#formation" },
    { label: "Websites & Digital", href: "/quote#digital" },
    { label: "Event Planning", href: "/quote" },
    { label: "Capital Readiness", href: "/quote#capital" },
    { label: "Advisory & Systems", href: "/quote#advisory" },
  ],
  Connect: [
    { label: "hello@levioraventures.com", href: "mailto:hello@levioraventures.com" },
    { label: "Threads", href: "https://threads.net/@levioraventures" },
    { label: "Instagram", href: "https://instagram.com/levioraventures" },
    { label: "LinkedIn", href: "https://linkedin.com/company/leviora-ventures" },
  ],
};

function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(180deg,#16306b 0%,#0b1f4b 70%,#081637 100%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-25"
        style={{ background: "radial-gradient(55% 90% at 50% 0%, rgba(255,255,255,.55), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="font-heading text-3xl font-medium leading-snug sm:text-4xl">Systems determine outcomes.</p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/65">
            We don&rsquo;t just file your paperwork — we build the system your business runs on.
          </p>
          <Link
            href="/quote"
            className="mt-6 inline-block rounded-full border border-white/50 px-6 py-2.5 text-sm tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-[#0b1f4b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Build your quote
          </Link>
        </div>

        <div className="grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3 lg:grid-cols-4">
          <div className="lg:pr-8">
            <p className="font-heading text-lg tracking-[0.18em]">LEVIORA VENTURES</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/60">
              Business dreams, elevated. Formation, infrastructure, and capital readiness for founders, small
              businesses, and nonprofits.
            </p>
            <p className="mt-4 text-[13px] text-white/45">Newark, NJ · Washington, DC · Worldwide</p>
          </div>
          {Object.entries(NAV).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/50">{heading}</p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <FooterLink
                      href={l.href}
                      className="text-[14px] text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      {l.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Leviora Ventures LLC. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white/80">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">Terms</Link>
            <Link href="/accessibility" className="transition-colors hover:text-white/80">Accessibility</Link>
          </div>
        </div>

        <p className="mt-8 text-center font-heading text-[13px] italic text-white/35">Readiness, waiting for timing.</p>
      </div>
    </footer>
  );
}
