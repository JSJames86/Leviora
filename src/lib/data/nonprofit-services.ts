export type NonprofitService = {
  id: string;
  title: string;
  tagline: string;
  bullets: string[];
  proof: {
    label: string;
    href: string | null;
  };
};

export const nonprofitServices: NonprofitService[] = [
  {
    id: "grant-writing",
    title: "Grant Writing & Funding Strategy",
    tagline:
      "From readiness to submitted, with federal credentials already in hand.",
    bullets: [
      "Federal, state, and foundation proposals",
      "Grant-readiness assessments & funder targeting",
      "Funding strategy and pipeline development",
      "Capability statements & federal registration (SAM.gov / UEI / CAGE)",
      "Proposal review and editing",
    ],
    proof: {
      label:
        "Proof: OFSA commitments filed, SSRC application, full federal registration (SAM / UEI / CAGE)",
      href: "https://seedandspoon.org",
    },
  },
  {
    id: "research-evaluation",
    title: "Research, Evaluation & Assessment",
    tagline: "Instrumented impact measurement, not vague outcome claims.",
    bullets: [
      "Needs assessments & program evaluation design",
      "Outcome metrics & pre/post baselines",
      "Data collection, analytics instrumentation, and reporting",
      "Sourced market & landscape analysis",
    ],
    proof: {
      label:
        "Proof: 5-metric research model w/ within-household baselines; Impact Engine; sourced market analysis (USDA ERS, IBISWorld)",
      href: "https://seedandspoon.org/impact",
    },
  },
  {
    id: "strategic-consulting",
    title: "Strategic Consulting",
    tagline:
      "Strategy that comes with a revenue model and a capital stack attached.",
    bullets: [
      "Strategic planning & plan alignment",
      "Organizational & program design",
      "Revenue modeling and financial sustainability",
      "Advisory and implementation support",
    ],
    proof: {
      label:
        "Proof: OFSA strategic-plan alignment; five-stream revenue model; structured capital stack (CDFI, seller financing, OZ equity)",
      href: "https://seedandspoon.org",
    },
  },
  {
    id: "technical-writing",
    title: "Technical Writing & Reporting",
    tagline: "Published, DOI-backed, inspector-ready documents.",
    bullets: [
      "White papers & research summaries",
      "Final reports & program documentation",
      "Compliance documents (HACCP, SOPs)",
      "Literature reviews",
    ],
    proof: {
      label:
        "Proof: peer-style white paper on Zenodo (DOI 10.5281/zenodo.20299779); HACCP plan; production SOP",
      href: "https://doi.org/10.5281/zenodo.20299779",
    },
  },
];
