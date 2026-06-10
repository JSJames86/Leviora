"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADDONS,
  ADVISORY,
  ALL_ITEMS,
  CAPITAL,
  DIGITAL,
  FORMATION,
  PACKAGES,
  STATE_FEES,
  STATE_NOTES,
  fmt,
  type QuoteItem,
} from "@/lib/quote/data";
import { computeMilestones, computeQuote, type BoolMap, type QuoteSelection } from "@/lib/quote/compute";
import { saveQuoteSelection } from "@/lib/quote/store";
import { QuoteLedger } from "./QuoteLedger";

const FocusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-primary bg-primary" : "border-border bg-transparent"}`}>
      {on && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9L9.5 3.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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
    <div className="flex w-full items-start gap-3 border-b border-border px-1 py-3.5 text-left opacity-70">
      <Toggle on={true} />
      <span className="flex-1 min-w-0">
        <span className="block font-medium leading-snug text-text-primary">{item.name}</span>
        <span className="block text-[13px] leading-snug text-text-secondary">{item.desc}</span>
      </span>
      <span className="shrink-0 rounded bg-success/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-success">Included</span>
    </div>
  );
  return (
    <button onClick={onClick}
      className={`group flex w-full items-start gap-3 border-b border-border px-1 py-3.5 text-left transition-colors hover:bg-primary/5 ${FocusRing}`}>
      <Toggle on={on} />
      <span className="flex-1 min-w-0">
        <span className="block font-medium leading-snug text-text-primary">{item.name}</span>
        <span className="block text-[13px] leading-snug text-text-secondary">{item.desc}</span>
      </span>
      <span className="shrink-0 pt-px font-medium tabular-nums text-primary">{priceLabel}</span>
    </button>
  );
}

type BoolMapSetter = (updater: (prev: BoolMap) => BoolMap) => void;

export default function QuoteBuilder() {
  const router = useRouter();
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

  const selection: QuoteSelection = { state, pkg, formation, addons, digital, capital, advisory };
  const quote = computeQuote(selection);
  const milestones = computeMilestones(quote);

  const handleGetStarted = () => {
    saveQuoteSelection(selection);
    router.push("/intake");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-text-primary px-5 py-7 text-background sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">Leviora Ventures</p>
        <h1 className="mt-1.5 font-heading text-3xl font-semibold sm:text-4xl">
          Build your quote.
        </h1>
        <p className="mt-1.5 max-w-xl text-[15px] text-accent">
          Select what you need. Every line is itemized — our fee, the state&apos;s fee, and anything recurring. No surprises at checkout.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-9 sm:px-10 lg:grid-cols-[1fr_360px]">
        {/* ───────── Services ───────── */}
        <div className="space-y-10">
          {/* Packages */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-text-primary">Packages</h2>
            <p className="mb-3 text-sm text-text-secondary">One tap, fully bundled. Tap again to go à la carte.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PACKAGES.map((p) => {
                const on = pkg === p.id;
                const alaCarte = p.includes.reduce((s, id) => s + (ALL_ITEMS[id]?.leviora || 0), 0);
                return (
                  <button key={p.id} onClick={() => setPkg(on ? null : p.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${FocusRing} ${on ? "border-primary bg-primary text-white" : "border-border bg-surface hover:border-primary/50"}`}>
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${on ? "text-white/70" : "text-primary"}`}>{p.tag}</p>
                    <p className="mt-1 font-heading text-lg font-bold">{p.name}</p>
                    <p className={`font-heading text-xl font-semibold tabular-nums ${on ? "" : "text-primary"}`}>{fmt(p.price)}</p>
                    <p className={`mt-1.5 text-[12.5px] leading-snug ${on ? "text-white/80" : "text-text-secondary"}`}>{p.desc}</p>
                    {alaCarte > p.price && (
                      <p className={`mt-2 text-[12px] font-semibold ${on ? "text-white/90" : "text-success"}`}>
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
            <h2 className="font-heading text-xl font-semibold text-text-primary">Formation</h2>
            <p className="mb-2 text-sm text-text-secondary">Pick one — state fees added automatically.</p>

            <label className="mb-1 mt-3 block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="state">
              Filing state
            </label>
            <select id="state" value={state} onChange={(e) => setState(e.target.value)}
              className={`mb-1 w-full max-w-[220px] rounded-md border border-border bg-surface px-3 py-2 text-[15px] ${FocusRing}`}>
              {Object.keys(STATE_FEES).sort().map((s) => (
                <option key={s} value={s}>{s} — {fmt(STATE_FEES[s])} state fee</option>
              ))}
            </select>
            {STATE_NOTES[state] && (
              <p className="mb-1 text-[13px] text-primary">⚠ {STATE_NOTES[state]}</p>
            )}

            <div className="mt-2 rounded-lg border border-border bg-surface px-3">
              {FORMATION.map((f) => (
                <Row key={f.id} item={f} on={formation === f.id} inPkg={included.has(f.id)}
                  onClick={() => setFormation(formation === f.id ? null : f.id)}
                  priceLabel={fmt(f.leviora ?? 0) + (f.needsState ? " + state" : "")} />
              ))}
            </div>
          </section>

          {/* Add-ons */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-text-primary">Formation add-ons</h2>
            <p className="mb-2 text-sm text-text-secondary">Stack onto any formation package.</p>
            <div className="rounded-lg border border-border bg-surface px-3">
              {ADDONS.map((a) => (
                <Row key={a.id} item={a} on={!!addons[a.id]} inPkg={included.has(a.id)}
                  onClick={() => toggle(setAddons)(a.id)}
                  priceLabel={fmt(a.price ?? 0) + (a.recurring || "")} />
              ))}
            </div>
          </section>

          {/* Digital */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-text-primary">Digital</h2>
            <p className="mb-2 text-sm text-text-secondary">Websites are either/or — pick the tier that fits.</p>
            <div className="rounded-lg border border-border bg-surface px-3">
              {DIGITAL.map((d) => (
                <Row key={d.id} item={d} on={!!digital[d.id]} inPkg={included.has(d.id)}
                  onClick={() => toggle(setDigital)(d.id, d.group)}
                  priceLabel={(d.plus ? "from " : "") + fmt(d.leviora ?? 0)} />
              ))}
            </div>
          </section>

          {/* Capital readiness */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-text-primary">Capital readiness</h2>
            <p className="mb-2 text-sm text-text-secondary">Get fundable — grants, contracts, and credit.</p>
            <div className="rounded-lg border border-border bg-surface px-3">
              {CAPITAL.map((c) => (
                <Row key={c.id} item={c} on={!!capital[c.id]} inPkg={included.has(c.id)}
                  onClick={() => toggle(setCapital)(c.id)}
                  priceLabel={fmt(c.leviora ?? 0)} />
              ))}
            </div>
          </section>

          {/* Advisory */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-text-primary">Advisory & systems</h2>
            <div className="mt-2 rounded-lg border border-border bg-surface px-3">
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
          <QuoteLedger
            quote={quote}
            milestones={milestones}
            footer={
              <>
                <button onClick={handleGetStarted}
                  className={`mt-4 w-full rounded-md bg-primary px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-text-primary ${FocusRing}`}>
                  Get started
                </button>
                <p className="mt-2 text-center text-[11.5px] text-text-secondary">
                  Quote is an estimate — final details confirmed during intake.
                </p>
              </>
            }
          />
          <p className="mt-3 px-1 text-[11.5px] leading-relaxed text-text-secondary">
            State fees shown are standard filing fees and may change; expedited processing available in most states.
          </p>
        </aside>
      </main>
    </div>
  );
}
