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

type Rel<Name extends string, Column extends string, Referenced extends string> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Referenced;
  referencedColumns: ["id"];
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
