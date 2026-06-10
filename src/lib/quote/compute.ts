import { ADDONS, ADVISORY, ALL_ITEMS, CAPITAL, DIGITAL, FORMATION, PACKAGES, STATE_FEES } from "./data";

export type LineItem = { label: string; amt: number; kind?: "leviora" | "pass"; per?: string };
export type RecurringItem = { label: string; amt: number; per?: string };
export type BoolMap = Record<string, boolean>;

export type QuoteSelection = {
  state: string;
  pkg: string | null;
  formation: string | null;
  addons: BoolMap;
  digital: BoolMap;
  capital: BoolMap;
  advisory: BoolMap;
};

export const EMPTY_SELECTION: QuoteSelection = {
  state: "NJ",
  pkg: null,
  formation: null,
  addons: {},
  digital: {},
  capital: {},
  advisory: {},
};

export type ComputedQuote = {
  lines: LineItem[];
  /** Leviora's one-time service fees, in dollars. */
  oneTime: number;
  /** Government pass-through fees (state filing, IRS), in dollars. */
  passThrough: number;
  recurring: RecurringItem[];
  savings: number;
  /** oneTime + passThrough + first cycle of any recurring items — what shows as "due today". */
  dueToday: number;
  /** oneTime + passThrough — the amount that gets split into milestones. */
  projectTotal: number;
};

/** Converts a dollar amount to integer cents for Stripe and database storage. */
export const toCents = (dollars: number) => Math.round(dollars * 100);

/** Pure function: turns the quote builder's selections into itemized totals. */
export function computeQuote(selection: QuoteSelection): ComputedQuote {
  const { state, pkg, formation, addons, digital, capital, advisory } = selection;
  const pkgDef = PACKAGES.find((p) => p.id === pkg);
  const included = new Set<string>(pkgDef ? pkgDef.includes : []);

  const lines: LineItem[] = [];
  let oneTime = 0, passThrough = 0, savings = 0;
  const recurring: RecurringItem[] = [];

  if (pkgDef) {
    lines.push({ label: `${pkgDef.name} package`, amt: pkgDef.price, kind: "leviora" });
    oneTime += pkgDef.price;
    const alaCarte = pkgDef.includes.reduce((s, id) => s + (ALL_ITEMS[id]?.leviora || 0), 0);
    savings = Math.max(0, alaCarte - pkgDef.price);
    if (included.has("llc") || included.has("nonprofit")) {
      const sf = STATE_FEES[state] ?? 0;
      lines.push({ label: `${state} state filing fee`, amt: sf, kind: "pass" });
      passThrough += sf;
    }
  }

  const f = FORMATION.find((x) => x.id === formation);
  if (f && !included.has(f.id)) {
    lines.push({ label: f.name, amt: f.leviora ?? 0, kind: "leviora" });
    oneTime += f.leviora ?? 0;
    if (f.needsState) {
      const sf = STATE_FEES[state] ?? 0;
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
  return {
    lines,
    oneTime,
    passThrough,
    recurring,
    savings,
    dueToday: oneTime + passThrough + recurringFirst,
    projectTotal: oneTime + passThrough,
  };
}

export type MilestonePlan = {
  /** oneTime + passThrough, dollars. */
  total: number;
  /** 1/3 of Leviora's one-time fees, due with the deposit. */
  depositServices: number;
  /** Pass-through fees, collected in full with the deposit. */
  depositPassThrough: number;
  /** depositServices + depositPassThrough. */
  deposit: number;
  midpoint: number;
  final: number;
};

/**
 * Splits the project total into a 3-milestone plan when it exceeds $1,000.
 * Pass-through fees ride with the deposit (paid out immediately on filing).
 * The first two installments of Leviora's fee are rounded down to whole
 * dollars; the remainder lands on the final installment.
 */
export function computeMilestones(quote: ComputedQuote): MilestonePlan | null {
  if (quote.projectTotal <= 1000) return null;

  const third = Math.floor(quote.oneTime / 3);
  const depositServices = third;
  const midpoint = third;
  const final = quote.oneTime - third * 2;

  return {
    total: quote.projectTotal,
    depositServices,
    depositPassThrough: quote.passThrough,
    deposit: depositServices + quote.passThrough,
    midpoint,
    final,
  };
}
