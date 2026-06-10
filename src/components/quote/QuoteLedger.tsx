import type { ReactNode } from "react";
import { fmt } from "@/lib/quote/data";
import type { ComputedQuote, MilestonePlan } from "@/lib/quote/compute";

export function QuoteLedger({
  quote,
  milestones,
  footer,
}: {
  quote: ComputedQuote;
  milestones: MilestonePlan | null;
  footer?: ReactNode;
}) {
  const empty = quote.lines.length === 0;

  return (
    <div className="rounded-xl border border-border border-t-2 border-t-primary bg-surface shadow-soft-lg">
      <div className="border-b border-dashed border-border px-5 pb-3 pt-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-text-secondary">Your quote</p>
      </div>

      <div className="px-5 py-3" aria-live="polite">
        {empty ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            Select a service to start your quote.
          </p>
        ) : (
          <ul className="space-y-2">
            {quote.lines.map((l, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className={l.kind === "pass" ? "text-text-secondary" : "text-text-primary"}>
                  {l.label}
                  {l.kind === "pass" && <span className="ml-1.5 rounded bg-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-secondary">pass-through</span>}
                </span>
                <span className="tabular-nums font-medium">{fmt(l.amt)}{l.per || ""}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!empty && (
        <div className="border-t border-dashed border-border px-5 py-4">
          <div className="flex justify-between text-[13px] text-text-secondary">
            <span>Leviora services</span><span className="tabular-nums">{fmt(quote.oneTime)}</span>
          </div>
          <div className="flex justify-between text-[13px] text-text-secondary">
            <span>Government fees (pass-through)</span><span className="tabular-nums">{fmt(quote.passThrough)}</span>
          </div>
          {quote.savings > 0 && (
            <div className="flex justify-between text-[13px] font-semibold text-success">
              <span>Bundle savings</span><span className="tabular-nums">−{fmt(quote.savings)}</span>
            </div>
          )}
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[15px] font-semibold text-text-primary">Due today</span>
            <span className="font-heading text-2xl font-bold tabular-nums text-text-primary">
              {fmt(quote.dueToday)}
            </span>
          </div>
          {quote.recurring.length > 0 && (
            <p className="mt-2 text-[12.5px] text-text-secondary">
              Then {quote.recurring.map((r) => `${fmt(r.amt)}${r.per ?? ""} ${r.label.toLowerCase()}`).join(" · ")}
            </p>
          )}
          {milestones && (
            <p className="mt-2 text-[12.5px] text-text-secondary">
              Split into 3 milestone payments — deposit of <span className="font-semibold text-text-primary">{fmt(milestones.deposit)}</span> to start
              {milestones.depositPassThrough > 0
                ? ` (${fmt(milestones.depositServices)} for 1/3 of services + ${fmt(milestones.depositPassThrough)} in government fees)`
                : ` (1/3 of services)`}
              .
            </p>
          )}
          {footer}
        </div>
      )}
    </div>
  );
}
