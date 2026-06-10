"use client";

import { useState } from "react";
import Script from "next/script";

const CALENDLY_URL = "https://calendly.com/levioraventures";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

function openCalendly() {
  window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

/* ════════════════════════════════════════════════════════════
   LEVIORA PRICING CONFIG — edit everything here
   Leviora fees are yours. State fees are pass-through.
   Verify state filing fees before launch — they change.
   ════════════════════════════════════════════════════════════ */

type QuoteItem = {
  id: string;
  name: string;
  desc: string;
  leviora?: number;
  price?: number;
  needsState?: boolean;
  irs?: number;
  recurring?: string;
  group?: string;
  plus?: boolean;
};

type Package = {
  id: string;
  name: string;
  price: number;
  tag: string;
  includes: string[];
  desc: string;
};

const STATE_FEES: Record<string, number> = {
  AL: 200, AK: 250, AZ: 50, AR: 45, CA: 70, CO: 50, CT: 120, DE: 110,
  FL: 125, GA: 100, HI: 50, ID: 100, IL: 150, IN: 95, IA: 50, KS: 160,
  KY: 40, LA: 100, ME: 175, MD: 100, MA: 500, MI: 50, MN: 155, MS: 50,
  MO: 50, MT: 35, NE: 100, NV: 425, NH: 100, NJ: 125, NM: 50, NY: 200,
  NC: 125, ND: 135, OH: 99, OK: 100, OR: 100, PA: 125, RI: 150, SC: 110,
  SD: 150, TN: 300, TX: 300, UT: 59, VT: 125, VA: 100, WA: 200, WV: 100,
  WI: 130, WY: 100,
};

const STATE_NOTES: Record<string, string> = {
  CA: "CA also charges an $800 annual franchise tax",
  NY: "NY requires newspaper publication (~$300–$1,200 extra by county)",
  NV: "Includes required initial list + business license",
};

const FORMATION: QuoteItem[] = [
  { id: "llc", name: "LLC Formation", leviora: 350, needsState: true,
    desc: "Articles of organization, filed and confirmed" },
  { id: "nonprofit", name: "Nonprofit Formation + 501(c)(3)", leviora: 750, needsState: true, irs: 275,
    desc: "State incorporation + IRS Form 1023-EZ prep & filing" },
  { id: "scorp", name: "S-Corp Election (Form 2553)", leviora: 150, needsState: false,
    desc: "For existing LLCs electing S-corp tax status" },
];

const ADDONS: QuoteItem[] = [
  { id: "ra", name: "Registered Agent", price: 149, recurring: "/yr",
    desc: "Required in every state — we receive legal mail for you" },
  { id: "ein", name: "EIN (Federal Tax ID)", price: 75,
    desc: "Same-week IRS employer ID number" },
  { id: "oa", name: "Operating Agreement", price: 200,
    desc: "Custom-drafted, not a template fill-in" },
  { id: "compliance", name: "Annual Report Filing", price: 99, recurring: "/yr",
    desc: "We track and file your state annual report" },
  { id: "boi", name: "Beneficial Ownership (BOI) Filing", price: 95,
    desc: "FinCEN compliance filing" },
];

const DIGITAL: QuoteItem[] = [
  { id: "site1", name: "Starter Website", leviora: 1200, group: "site",
    desc: "1–3 pages, mobile-first, launched on your domain" },
  { id: "site2", name: "Business Website", leviora: 2500, group: "site",
    desc: "Up to 7 pages, booking/intake forms, SEO foundations" },
  { id: "site3", name: "Custom Web App", leviora: 5000, group: "site", plus: true,
    desc: "Custom functionality, dashboards, integrations" },
  { id: "brand", name: "Brand Identity Kit", leviora: 750,
    desc: "Logo, palette, type system, usage guide" },
  { id: "intake", name: "Client Intake & CRM Setup", leviora: 850,
    desc: "Automated intake, pipeline, and follow-up system" },
];

const CAPITAL: QuoteItem[] = [
  { id: "duns", name: "DUNS / SAM.gov Registration", leviora: 225,
    desc: "DUNS number, UEI, and SAM.gov setup — required for federal grants & contracts" },
  { id: "grantfind", name: "Grant Finding Report", leviora: 450,
    desc: "Curated list of grants you actually qualify for, with deadlines and fit notes" },
  { id: "grantready", name: "Grant Readiness Package", leviora: 1250,
    desc: "Boilerplate library, budget templates, org docs — apply-ready in weeks, not months" },
  { id: "creditaudit", name: "Business Credit Readiness Audit", leviora: 395,
    desc: "Review of your credit profile, bureau setup, and a roadmap to fundability" },
];

const ADVISORY: QuoteItem[] = [
  { id: "session", name: "Systems Planning Session", leviora: 250,
    desc: "90-minute working session + written action plan" },
  { id: "audit", name: "Operations Audit", leviora: 950,
    desc: "Full review of tools, workflows, and gaps with roadmap" },
  { id: "retainer", name: "Advisory Retainer", leviora: 497, recurring: "/mo",
    desc: "Ongoing strategy, admin oversight, and priority support" },
];

const PACKAGES: Package[] = [
  { id: "launch", name: "Launch", price: 997, tag: "Get legal, fast",
    includes: ["llc", "ein", "ra", "boi"],
    desc: "LLC formation, EIN, registered agent (yr 1), BOI filing" },
  { id: "build", name: "Build", price: 2997, tag: "Most popular",
    includes: ["llc", "ein", "ra", "boi", "oa", "site2"],
    desc: "Everything in Launch + operating agreement + business website" },
  { id: "elevate", name: "Elevate", price: 7997, tag: "Idea to launch",
    includes: ["llc", "ein", "ra", "boi", "oa", "site3", "brand", "intake", "audit"],
    desc: "Everything in Build, upgraded to a custom web app + brand kit + intake system + ops audit" },
];

const ALL_ITEMS: Record<string, QuoteItem> = {};
[...FORMATION, ...ADDONS.map((a) => ({ ...a, leviora: a.price })), ...DIGITAL, ...CAPITAL, ...ADVISORY].forEach((i) => {
  ALL_ITEMS[i.id] = i;
});

const fmt = (n: number) => "$" + n.toLocaleString();

const FocusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e6b66]";

function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-[#0e6b66] bg-[#0e6b66]" : "border-[#b9b2a4] bg-transparent"}`}>
      {on && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9L9.5 3.5" stroke="#f7f4ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </span>
  );
}

function Row({ item, on, onClick, priceLabel, inPkg }: {
  item: QuoteItem;
  on: boolean;
  onClick: () => void;
  priceLabel: string;
  inPkg?: boolean;
}) {
  if (inPkg) return (
    <div className="flex w-full items-start gap-3 border-b border-[#e6e0d2] px-1 py-3.5 text-left opacity-70">
      <Toggle on={true} />
      <span className="flex-1 min-w-0">
        <span className="block font-medium leading-snug text-[#0e3c39]">{item.name}</span>
        <span className="block text-[13px] leading-snug text-[#7d7669]">{item.desc}</span>
      </span>
      <span className="shrink-0 rounded bg-[#0e6b66]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0e6b66]">Included</span>
    </div>
  );
  return (
    <button onClick={onClick}
      className={`group flex w-full items-start gap-3 border-b border-[#e6e0d2] px-1 py-3.5 text-left transition-colors hover:bg-[#0e6b66]/[0.04] ${FocusRing}`}>
      <Toggle on={on} />
      <span className="flex-1 min-w-0">
        <span className={`block font-medium leading-snug ${on ? "text-[#0e3c39]" : "text-[#2b2a26]"}`}>{item.name}</span>
        <span className="block text-[13px] leading-snug text-[#7d7669]">{item.desc}</span>
      </span>
      <span className="shrink-0 pt-px font-medium tabular-nums text-[#0e6b66]">{priceLabel}</span>
    </button>
  );
}

type LineItem = { label: string; amt: number; kind?: "leviora" | "pass"; per?: string };
type RecurringItem = { label: string; amt: number; per?: string };
type BoolMap = Record<string, boolean>;
type BoolMapSetter = (updater: (prev: BoolMap) => BoolMap) => void;

export default function QuoteBuilder() {
  const [state, setState] = useState("NJ");
  const [pkg, setPkg] = useState<string | null>(null);
  const [formation, setFormation] = useState<string | null>(null);
  const [addons, setAddons] = useState<BoolMap>({});
  const [digital, setDigital] = useState<BoolMap>({});
  const [capital, setCapital] = useState<BoolMap>({});
  const [advisory, setAdvisory] = useState<BoolMap>({});

  const pkgDef = PACKAGES.find((p) => p.id === pkg);
  const included = new Set<string>(pkgDef ? pkgDef.includes : []);

  const toggle = (setter: BoolMapSetter) => (id: string, group?: string) =>
    setter((prev) => {
      const next = { ...prev };
      if (group) Object.keys(next).forEach((k) => {
        const g = DIGITAL.find((d) => d.id === k)?.group;
        if (g === group && k !== id) delete next[k];
      });
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const lines: LineItem[] = [];
  let oneTime = 0, passThrough = 0, savings = 0;
  const recurring: RecurringItem[] = [];

  if (pkgDef) {
    lines.push({ label: `${pkgDef.name} package`, amt: pkgDef.price, kind: "leviora" });
    oneTime += pkgDef.price;
    const alaCarte = pkgDef.includes.reduce((s, id) => s + (ALL_ITEMS[id]?.leviora || 0), 0);
    savings = Math.max(0, alaCarte - pkgDef.price);
    if (included.has("llc") || included.has("nonprofit")) {
      const sf = STATE_FEES[state];
      lines.push({ label: `${state} state filing fee`, amt: sf, kind: "pass" });
      passThrough += sf;
    }
  }

  const f = FORMATION.find((x) => x.id === formation);
  if (f && !included.has(f.id)) {
    lines.push({ label: f.name, amt: f.leviora ?? 0, kind: "leviora" });
    oneTime += f.leviora ?? 0;
    if (f.needsState) {
      const sf = STATE_FEES[state];
      lines.push({ label: `${state} state filing fee`, amt: sf, kind: "pass" });
      passThrough += sf;
    }
    if (f.irs) {
      lines.push({ label: "IRS 1023-EZ user fee", amt: f.irs, kind: "pass" });
      passThrough += f.irs;
    }
  }
  ADDONS.forEach((a) => {
    if (!addons[a.id] || included.has(a.id)) return;
    const price = a.price ?? 0;
    if (a.recurring) recurring.push({ label: a.name, amt: price, per: a.recurring });
    else { lines.push({ label: a.name, amt: price, kind: "leviora" }); oneTime += price; }
    if (a.recurring) lines.push({ label: a.name, amt: price, kind: "leviora", per: a.recurring });
  });
  DIGITAL.forEach((d) => {
    if (!digital[d.id] || included.has(d.id)) return;
    const amt = d.leviora ?? 0;
    lines.push({ label: d.name + (d.plus ? " (from)" : ""), amt, kind: "leviora" });
    oneTime += amt;
  });
  CAPITAL.forEach((c) => {
    if (!capital[c.id] || included.has(c.id)) return;
    const amt = c.leviora ?? 0;
    lines.push({ label: c.name, amt, kind: "leviora" });
    oneTime += amt;
  });
  ADVISORY.forEach((a) => {
    if (!advisory[a.id] || included.has(a.id)) return;
    const amt = a.leviora ?? 0;
    if (a.recurring) { recurring.push({ label: a.name, amt, per: a.recurring }); lines.push({ label: a.name, amt, kind: "leviora", per: a.recurring }); }
    else { lines.push({ label: a.name, amt, kind: "leviora" }); oneTime += amt; }
  });

  const recurringFirst = recurring.reduce((s, r) => s + r.amt, 0);
  const quote = { lines, oneTime, passThrough, recurring, savings, dueToday: oneTime + passThrough + recurringFirst };

  const empty = quote.lines.length === 0;

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#2b2a26]" style={{ fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif" }}>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600&display=swap');
        @media (prefers-reduced-motion: reduce){ *{transition:none!important} }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#0e6b66]/20 bg-[#0e3c39] px-5 py-7 text-[#f7f4ec] sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#9fc8c2]">Leviora Ventures</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
          Build your quote.
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] text-[#cfe2de]">
          Select what you need. Every line is itemized — our fee, the state&apos;s fee, and anything recurring. No surprises at checkout.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-9 sm:px-10 lg:grid-cols-[1fr_360px]">
        {/* ───────── Services ───────── */}
        <div className="space-y-10">
          {/* Packages */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Packages</h2>
            <p className="mb-3 text-sm text-[#7d7669]">One tap, fully bundled. Tap again to go à la carte.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PACKAGES.map((p) => {
                const on = pkg === p.id;
                const alaCarte = p.includes.reduce((s, id) => s + (ALL_ITEMS[id]?.leviora || 0), 0);
                return (
                  <button key={p.id} onClick={() => setPkg(on ? null : p.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${FocusRing} ${on ? "border-[#0e6b66] bg-[#0e6b66] text-[#f7f4ec]" : "border-[#e6e0d2] bg-white hover:border-[#0e6b66]/50"}`}>
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${on ? "text-[#9fc8c2]" : "text-[#a05c2a]"}`}>{p.tag}</p>
                    <p className="mt-1 text-lg" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>{p.name}</p>
                    <p className={`text-xl tabular-nums ${on ? "" : "text-[#0e6b66]"}`} style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>{fmt(p.price)}</p>
                    <p className={`mt-1.5 text-[12.5px] leading-snug ${on ? "text-[#cfe2de]" : "text-[#7d7669]"}`}>{p.desc}</p>
                    {alaCarte > p.price && (
                      <p className={`mt-2 text-[12px] font-semibold ${on ? "text-[#9fc8c2]" : "text-[#0e6b66]"}`}>
                        Save {fmt(alaCarte - p.price)} vs à la carte
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Formation */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Formation</h2>
            <p className="mb-2 text-sm text-[#7d7669]">Pick one — state fees added automatically.</p>

            <label className="mb-1 mt-3 block text-xs font-semibold uppercase tracking-wider text-[#7d7669]" htmlFor="state">
              Filing state
            </label>
            <select id="state" value={state} onChange={(e) => setState(e.target.value)}
              className={`mb-1 w-full max-w-[220px] rounded-md border border-[#b9b2a4] bg-white px-3 py-2 text-[15px] ${FocusRing}`}>
              {Object.keys(STATE_FEES).sort().map((s) => (
                <option key={s} value={s}>{s} — {fmt(STATE_FEES[s])} state fee</option>
              ))}
            </select>
            {STATE_NOTES[state] && (
              <p className="mb-1 text-[13px] text-[#a05c2a]">⚠ {STATE_NOTES[state]}</p>
            )}

            <div className="mt-2 rounded-lg border border-[#e6e0d2] bg-white px-3">
              {FORMATION.map((f) => (
                <Row key={f.id} item={f} on={formation === f.id} inPkg={included.has(f.id)}
                  onClick={() => setFormation(formation === f.id ? null : f.id)}
                  priceLabel={fmt(f.leviora ?? 0) + (f.needsState ? " + state" : "")} />
              ))}
            </div>
          </section>

          {/* Add-ons */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Formation add-ons</h2>
            <p className="mb-2 text-sm text-[#7d7669]">Stack onto any formation package.</p>
            <div className="rounded-lg border border-[#e6e0d2] bg-white px-3">
              {ADDONS.map((a) => (
                <Row key={a.id} item={a} on={!!addons[a.id]} inPkg={included.has(a.id)}
                  onClick={() => toggle(setAddons)(a.id)}
                  priceLabel={fmt(a.price ?? 0) + (a.recurring || "")} />
              ))}
            </div>
          </section>

          {/* Digital */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Digital</h2>
            <p className="mb-2 text-sm text-[#7d7669]">Websites are either/or — pick the tier that fits.</p>
            <div className="rounded-lg border border-[#e6e0d2] bg-white px-3">
              {DIGITAL.map((d) => (
                <Row key={d.id} item={d} on={!!digital[d.id]} inPkg={included.has(d.id)}
                  onClick={() => toggle(setDigital)(d.id, d.group)}
                  priceLabel={(d.plus ? "from " : "") + fmt(d.leviora ?? 0)} />
              ))}
            </div>
          </section>

          {/* Capital readiness */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Capital readiness</h2>
            <p className="mb-2 text-sm text-[#7d7669]">Get fundable — grants, contracts, and credit.</p>
            <div className="rounded-lg border border-[#e6e0d2] bg-white px-3">
              {CAPITAL.map((c) => (
                <Row key={c.id} item={c} on={!!capital[c.id]} inPkg={included.has(c.id)}
                  onClick={() => toggle(setCapital)(c.id)}
                  priceLabel={fmt(c.leviora ?? 0)} />
              ))}
            </div>
          </section>

          {/* Advisory */}
          <section>
            <h2 className="text-xl text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Advisory & systems</h2>
            <div className="mt-2 rounded-lg border border-[#e6e0d2] bg-white px-3">
              {ADVISORY.map((a) => (
                <Row key={a.id} item={a} on={!!advisory[a.id]} inPkg={included.has(a.id)}
                  onClick={() => toggle(setAdvisory)(a.id)}
                  priceLabel={fmt(a.leviora ?? 0) + (a.recurring || "")} />
              ))}
            </div>
          </section>
        </div>

        {/* ───────── The Ledger ───────── */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <div className="rounded-xl border border-[#0e6b66]/25 bg-white shadow-[0_1px_0_#0e6b66_inset,0_8px_24px_-12px_rgba(14,60,57,0.25)]">
            <div className="border-b border-dashed border-[#cfc8b8] px-5 pb-3 pt-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#7d7669]">Your quote</p>
            </div>

            <div className="px-5 py-3" aria-live="polite">
              {empty ? (
                <p className="py-6 text-center text-sm text-[#9a9385]">
                  Select a service to start your quote.
                </p>
              ) : (
                <ul className="space-y-2">
                  {quote.lines.map((l, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-3 text-[14px]">
                      <span className={l.kind === "pass" ? "text-[#7d7669]" : "text-[#2b2a26]"}>
                        {l.label}
                        {l.kind === "pass" && <span className="ml-1.5 rounded bg-[#efe9da] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[#8a8273]">pass-through</span>}
                      </span>
                      <span className="tabular-nums font-medium">{fmt(l.amt)}{l.per || ""}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!empty && (
              <div className="border-t border-dashed border-[#cfc8b8] px-5 py-4">
                <div className="flex justify-between text-[13px] text-[#7d7669]">
                  <span>Leviora services</span><span className="tabular-nums">{fmt(quote.oneTime)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-[#7d7669]">
                  <span>Government fees (pass-through)</span><span className="tabular-nums">{fmt(quote.passThrough)}</span>
                </div>
                {quote.savings > 0 && (
                  <div className="flex justify-between text-[13px] font-semibold text-[#0e6b66]">
                    <span>Bundle savings</span><span className="tabular-nums">−{fmt(quote.savings)}</span>
                  </div>
                )}
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold text-[#0e3c39]">Due today</span>
                  <span className="text-2xl tabular-nums text-[#0e3c39]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
                    {fmt(quote.dueToday)}
                  </span>
                </div>
                {quote.recurring.length > 0 && (
                  <p className="mt-2 text-[12.5px] text-[#7d7669]">
                    Then {quote.recurring.map((r) => `${fmt(r.amt)}${r.per ?? ""} ${r.label.toLowerCase()}`).join(" · ")}
                  </p>
                )}
                <button onClick={openCalendly} className={`mt-4 w-full rounded-md bg-[#0e6b66] px-4 py-3 text-[15px] font-semibold text-[#f7f4ec] transition-colors hover:bg-[#0e3c39] ${FocusRing}`}>
                  Book your discovery call
                </button>
                <p className="mt-2 text-center text-[11.5px] text-[#9a9385]">
                  Quote is an estimate — confirmed on your call.
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 px-1 text-[11.5px] leading-relaxed text-[#9a9385]">
            State fees shown are standard filing fees and may change; expedited processing available in most states.
          </p>
        </aside>
      </main>
    </div>
  );
}
