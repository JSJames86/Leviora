import { Nav } from "@/components/landing/Nav";
import { FadeUp } from "@/components/landing/FadeUp";
import { Footer } from "@/components/landing/Footer";

export function LegalPageShell({
  eyebrow,
  title,
  updated,
  notice,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  notice?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "#f0f8fd", color: "#1a3347" }}>
      <Nav solid />

      <section className="mx-auto max-w-2xl px-6 pt-36 pb-16 sm:pt-44">
        <FadeUp>
          <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600/60 mb-6">{eyebrow}</p>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium text-[#0f2030] leading-[1.1] mb-4">
            {title}
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-sm uppercase tracking-[0.2em] text-[#1a3347]/40">Last updated {updated}</p>
        </FadeUp>
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="border-t border-[#1a3347]/[0.07]" /></div>

      <section className="mx-auto max-w-2xl px-6 py-16">
        {notice && (
          <FadeUp>
            <div className="mb-10 rounded-lg border border-[#1a3347]/15 bg-white/70 px-5 py-4 text-sm leading-relaxed text-[#1a3347]/70">
              {notice}
            </div>
          </FadeUp>
        )}
        <FadeUp delay={notice ? 0.05 : 0}>
          <div className="space-y-8 text-[15px] leading-[1.8] text-[#1a3347]/65 [&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#0f2030] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:text-[#1a3347] [&_a]:underline [&_a]:decoration-[#1a3347]/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-[#1a3347]">
            {children}
          </div>
        </FadeUp>
      </section>

      <Footer />
    </div>
  );
}
