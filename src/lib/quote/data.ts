/* ════════════════════════════════════════════════════════════
   LEVIORA PRICING CONFIG — edit everything here
   Leviora fees are yours. State fees are pass-through.
   Verify state filing fees before launch — they change.
   ════════════════════════════════════════════════════════════ */

export type QuoteItem = {
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

export type Package = {
  id: string;
  name: string;
  price: number;
  tag: string;
  includes: string[];
  desc: string;
};

export const STATE_FEES: Record<string, number> = {
  AL: 200, AK: 250, AZ: 50, AR: 45, CA: 70, CO: 50, CT: 120, DE: 110,
  FL: 125, GA: 100, HI: 50, ID: 100, IL: 150, IN: 95, IA: 50, KS: 160,
  KY: 40, LA: 100, ME: 175, MD: 100, MA: 500, MI: 50, MN: 155, MS: 50,
  MO: 50, MT: 35, NE: 100, NV: 425, NH: 100, NJ: 125, NM: 50, NY: 200,
  NC: 125, ND: 135, OH: 99, OK: 100, OR: 100, PA: 125, RI: 150, SC: 110,
  SD: 150, TN: 300, TX: 300, UT: 59, VT: 125, VA: 100, WA: 200, WV: 100,
  WI: 130, WY: 100,
};

export const STATE_NOTES: Record<string, string> = {
  CA: "CA also charges an $800 annual franchise tax",
  NY: "NY requires newspaper publication (~$300–$1,200 extra by county)",
  NV: "Includes required initial list + business license",
};

export const FORMATION: QuoteItem[] = [
  { id: "llc", name: "LLC Formation", leviora: 350, needsState: true,
    desc: "Articles of organization, filed and confirmed" },
  { id: "nonprofit", name: "Nonprofit Formation + 501(c)(3)", leviora: 750, needsState: true, irs: 275,
    desc: "State incorporation + IRS Form 1023-EZ prep & filing" },
  { id: "scorp", name: "S-Corp Election (Form 2553)", leviora: 150, needsState: false,
    desc: "For existing LLCs electing S-corp tax status" },
];

export const ADDONS: QuoteItem[] = [
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

export const DIGITAL: QuoteItem[] = [
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

export const CAPITAL: QuoteItem[] = [
  { id: "duns", name: "DUNS / SAM.gov Registration", leviora: 225,
    desc: "DUNS number, UEI, and SAM.gov setup — required for federal grants & contracts" },
  { id: "grantfind", name: "Grant Finding Report", leviora: 450,
    desc: "Curated list of grants you actually qualify for, with deadlines and fit notes" },
  { id: "grantready", name: "Grant Readiness Package", leviora: 1250,
    desc: "Boilerplate library, budget templates, org docs — apply-ready in weeks, not months" },
  { id: "creditaudit", name: "Business Credit Readiness Audit", leviora: 395,
    desc: "Review of your credit profile, bureau setup, and a roadmap to fundability" },
];

export const ADVISORY: QuoteItem[] = [
  { id: "session", name: "Systems Planning Session", leviora: 250,
    desc: "90-minute working session + written action plan" },
  { id: "audit", name: "Operations Audit", leviora: 950,
    desc: "Full review of tools, workflows, and gaps with roadmap" },
  { id: "retainer", name: "Advisory Retainer", leviora: 497, recurring: "/mo",
    desc: "Ongoing strategy, admin oversight, and priority support" },
];

export const PACKAGES: Package[] = [
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

export const ALL_ITEMS: Record<string, QuoteItem> = {};
[...FORMATION, ...ADDONS.map((a) => ({ ...a, leviora: a.price })), ...DIGITAL, ...CAPITAL, ...ADVISORY].forEach((i) => {
  ALL_ITEMS[i.id] = i;
});

export const fmt = (n: number) => "$" + n.toLocaleString();
