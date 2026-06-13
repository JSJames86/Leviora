import type { ComputedQuote, MilestonePlan, QuoteSelection } from "@/lib/quote/compute";
import type { PaletteTokens } from "@/lib/library/roles";

export type UserRole = "admin" | "client";

export type PackageType = "alacarte" | "starter" | "growth" | "elevated";

export type EngagementStatus = "active" | "review" | "completed" | "paused";

export type MilestoneStatus = "pending" | "in_progress" | "complete";

export type DeliverableType = "document" | "link";

export type DocumentStatus = "draft" | "reviewed" | "approved" | "sent";

export type ServiceType = "llc_formation" | "ein_registration" | "website_setup";

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type Client = {
  id: string;
  user_id: string | null;
  company_name: string | null;
  phone: string | null;
  intake_email: string | null;
  notes: string | null;
  created_at: string;
};

export type Engagement = {
  id: string;
  client_id: string;
  title: string;
  package_type: PackageType | null;
  status: EngagementStatus;
  created_at: string;
  updated_at: string;
};

export type Milestone = {
  id: string;
  engagement_id: string;
  title: string;
  status: MilestoneStatus;
  position: number | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
};

export type Deliverable = {
  id: string;
  engagement_id: string;
  milestone_id: string | null;
  title: string;
  type: DeliverableType | null;
  url: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  engagement_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type InternalNote = {
  id: string;
  engagement_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  engagement_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export type QuestionnaireResponse = {
  id: string;
  engagement_id: string;
  question_key: string;
  answer: string | null;
  created_at: string;
};

export type DocumentTemplate = {
  id: string;
  service_type: string;
  template_url: string | null;
  created_at: string;
};

export type GeneratedDocument = {
  id: string;
  engagement_id: string;
  template_id: string | null;
  questionnaire_response_id: string | null;
  storage_url: string | null;
  status: DocumentStatus;
  generated_at: string;
  reviewed_at: string | null;
};

export type LeadStatus = "new" | "call_booked" | "deposit_paid" | "midpoint_paid" | "completed" | "lost";

export type BusinessStage = "idea" | "formed" | "operating";

export type PaymentMilestone = "full" | "deposit" | "midpoint" | "final" | "subscription";

/** Snapshot of the quote builder state at the time a lead was submitted. */
export type LeadQuoteJson = {
  selection: QuoteSelection;
  computed: ComputedQuote;
  milestones: MilestonePlan | null;
};

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_stage: BusinessStage | null;
  state: string | null;
  quote_json: LeadQuoteJson;
  quote_total: number;
  pass_through_total: number;
  status: LeadStatus;
  stripe_customer_id: string | null;
  notes: string | null;
};

export type Payment = {
  id: string;
  created_at: string;
  lead_id: string;
  milestone: PaymentMilestone;
  amount: number;
  stripe_session_id: string | null;
  stripe_invoice_id: string | null;
  paid_at: string | null;
};

export type LibraryCategory = "hero" | "pricing" | "cta" | "portal" | "media-kit";

/** Catalog row for a template library component. Metadata only — the
 * component itself lives in lib/library/registry.ts, joined by `slug`. */
export type Template = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tags: string[];
  preview_image: string | null;
  prompt: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};

/** Semantic color palette — base roles only, shades are generated at render time. */
export type Palette = {
  id: string;
  name: string;
  owner: string;
  tokens: PaletteTokens;
  created_at: string;
};

/** Links a client engagement to a template + palette, with optional per-instance copy overrides. */
export type ProjectTemplate = {
  id: string;
  engagement_id: string;
  template_slug: string;
  palette_id: string;
  content: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
};

type Rel<Name extends string, Column extends string, Referenced extends string, ReferencedColumn extends string = "id"> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Referenced;
  referencedColumns: [ReferencedColumn];
};

type Table<Row, Insert, Update, Relationships extends readonly unknown[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export interface Database {
  public: {
    Tables: {
      users: Table<User, Partial<User> & { email: string }, Partial<User>>;
      clients: Table<
        Client,
        Partial<Client>,
        Partial<Client>,
        [Rel<"clients_user_id_fkey", "user_id", "users">]
      >;
      engagements: Table<
        Engagement,
        Partial<Engagement> & { client_id: string; title: string },
        Partial<Engagement>,
        [Rel<"engagements_client_id_fkey", "client_id", "clients">]
      >;
      milestones: Table<
        Milestone,
        Partial<Milestone> & { engagement_id: string; title: string },
        Partial<Milestone>,
        [Rel<"milestones_engagement_id_fkey", "engagement_id", "engagements">]
      >;
      deliverables: Table<
        Deliverable,
        Partial<Deliverable> & { engagement_id: string; title: string },
        Partial<Deliverable>,
        [
          Rel<"deliverables_engagement_id_fkey", "engagement_id", "engagements">,
          Rel<"deliverables_milestone_id_fkey", "milestone_id", "milestones">,
        ]
      >;
      notes: Table<
        Note,
        Partial<Note> & { engagement_id: string; body: string },
        Partial<Note>,
        [
          Rel<"notes_author_id_fkey", "author_id", "users">,
          Rel<"notes_engagement_id_fkey", "engagement_id", "engagements">,
        ]
      >;
      internal_notes: Table<
        InternalNote,
        Partial<InternalNote> & { engagement_id: string; body: string },
        Partial<InternalNote>,
        [
          Rel<"internal_notes_author_id_fkey", "author_id", "users">,
          Rel<"internal_notes_engagement_id_fkey", "engagement_id", "engagements">,
        ]
      >;
      notifications: Table<
        Notification,
        Partial<Notification> & { user_id: string; message: string },
        Partial<Notification>,
        [
          Rel<"notifications_engagement_id_fkey", "engagement_id", "engagements">,
          Rel<"notifications_user_id_fkey", "user_id", "users">,
        ]
      >;
      questionnaire_responses: Table<
        QuestionnaireResponse,
        Partial<QuestionnaireResponse> & { engagement_id: string; question_key: string },
        Partial<QuestionnaireResponse>,
        [Rel<"questionnaire_responses_engagement_id_fkey", "engagement_id", "engagements">]
      >;
      document_templates: Table<DocumentTemplate, Partial<DocumentTemplate> & { service_type: string }, Partial<DocumentTemplate>>;
      generated_documents: Table<
        GeneratedDocument,
        Partial<GeneratedDocument> & { engagement_id: string },
        Partial<GeneratedDocument>,
        [
          Rel<"generated_documents_engagement_id_fkey", "engagement_id", "engagements">,
          Rel<"generated_documents_questionnaire_response_id_fkey", "questionnaire_response_id", "questionnaire_responses">,
          Rel<"generated_documents_template_id_fkey", "template_id", "document_templates">,
        ]
      >;
      leads: Table<
        Lead,
        Partial<Lead> & { name: string; email: string; quote_json: LeadQuoteJson; quote_total: number },
        Partial<Lead>
      >;
      payments: Table<
        Payment,
        Partial<Payment> & { lead_id: string; milestone: PaymentMilestone; amount: number },
        Partial<Payment>,
        [Rel<"payments_lead_id_fkey", "lead_id", "leads">]
      >;
      templates: Table<Template, Partial<Template> & { slug: string; name: string; category: string }, Partial<Template>>;
      palettes: Table<Palette, Partial<Palette> & { name: string; tokens: PaletteTokens }, Partial<Palette>>;
      project_templates: Table<
        ProjectTemplate,
        Partial<ProjectTemplate> & { engagement_id: string; template_slug: string; palette_id: string },
        Partial<ProjectTemplate>,
        [
          Rel<"project_templates_engagement_id_fkey", "engagement_id", "engagements">,
          Rel<"project_templates_template_slug_fkey", "template_slug", "templates", "slug">,
          Rel<"project_templates_palette_id_fkey", "palette_id", "palettes">,
        ]
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
