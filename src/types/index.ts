export * from "./database";

export interface QuestionnaireField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "number";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface ServiceDefinition {
  key: import("./database").ServiceType;
  label: string;
  description: string;
  fields: QuestionnaireField[];
}

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    key: "llc_formation",
    label: "LLC Formation",
    description: "Form your limited liability company from the ground up.",
    fields: [
      { key: "legal_business_name", label: "Legal business name", type: "text", required: true },
      { key: "state_of_formation", label: "State of formation", type: "text", required: true },
      { key: "business_address", label: "Business address", type: "textarea", required: true },
      { key: "registered_agent", label: "Registered agent info", type: "textarea", required: true },
      { key: "member_names_ownership", label: "Member names + ownership %", type: "textarea", required: true },
      { key: "business_purpose", label: "Business purpose", type: "textarea", required: true },
      { key: "fiscal_year_end", label: "Fiscal year end", type: "text", placeholder: "e.g. December 31" },
    ],
  },
  {
    key: "ein_registration",
    label: "EIN Registration",
    description: "Register your federal Employer Identification Number.",
    fields: [
      { key: "legal_name", label: "Legal name", type: "text", required: true },
      { key: "ssn_or_itin", label: "SSN or ITIN", type: "text", required: true },
      { key: "business_type", label: "Business type", type: "text", required: true },
      { key: "start_date", label: "Start date", type: "date", required: true },
      { key: "expected_employees", label: "Expected employees", type: "number" },
    ],
  },
  {
    key: "website_setup",
    label: "Website Setup",
    description: "Get a polished, on-brand website up and running.",
    fields: [
      { key: "business_name", label: "Business name", type: "text", required: true },
      { key: "tagline_description", label: "Tagline / description", type: "textarea", required: true },
      { key: "brand_colors", label: "Brand colors", type: "text", placeholder: "e.g. soft blue, cream, charcoal" },
      { key: "pages_needed", label: "Pages needed", type: "textarea", placeholder: "e.g. Home, About, Services, Contact" },
      { key: "domain_preference", label: "Domain preference", type: "text" },
    ],
  },
];

export const PACKAGE_LABELS: Record<import("./database").PackageType, string> = {
  alacarte: "À la carte",
  starter: "Starter",
  growth: "Growth",
  elevated: "Elevated",
};

export const PACKAGE_DESCRIPTIONS: Record<import("./database").PackageType, { tagline: string; included: string[]; timeline: string }> = {
  alacarte: {
    tagline: "Single-service support, scoped to exactly what you need.",
    included: ["One scoped engagement", "Direct access to your specialist", "Deliverables when the work is done"],
    timeline: "Typically wrapped up within 1–3 weeks of kickoff.",
  },
  starter: {
    tagline: "The essentials to get your business off the ground.",
    included: ["Foundational filings & registrations", "Guided intake & document prep", "Email support throughout"],
    timeline: "Most Starter engagements complete within 2–4 weeks.",
  },
  growth: {
    tagline: "Ongoing support as you build momentum.",
    included: ["Multiple coordinated engagements", "Milestone tracking & check-ins", "Priority response times"],
    timeline: "Growth engagements typically run 4–8 weeks, with ongoing touch points.",
  },
  elevated: {
    tagline: "White-glove, full-service partnership.",
    included: ["End-to-end engagement management", "Dedicated specialist & monthly strategy reviews", "Fastest turnaround on deliverables"],
    timeline: "Elevated engagements are tailored — your specialist will share a custom timeline at kickoff.",
  },
};

export const MILESTONE_TEMPLATES: Record<import("./database").ServiceType, string[]> = {
  llc_formation: [
    "Intake & questionnaire received",
    "Name availability check",
    "Articles of organization filed",
    "Registered agent confirmed",
    "Operating agreement drafted",
    "Formation documents delivered",
  ],
  ein_registration: [
    "Intake & questionnaire received",
    "EIN application prepared",
    "Application submitted to IRS",
    "EIN confirmation received",
    "Confirmation letter delivered",
  ],
  website_setup: [
    "Intake & questionnaire received",
    "Brand & content gathering",
    "Site structure & wireframe",
    "Design & build",
    "Review & revisions",
    "Site launched",
  ],
};

export const ONBOARDING_STEPS = [
  "Welcome",
  "Confirm details",
  "Your engagement",
  "Intake questionnaire",
  "Terms & scope",
  "Intake email",
  "All set",
] as const;
