import { createClient } from "@/lib/supabase/server";
import type { Deliverable, Engagement, InternalNote, Milestone, Note, QuestionnaireResponse, User } from "@/types";

export interface EngagementWithMilestones extends Engagement {
  milestones: Milestone[];
}

export async function getEngagementsForClient(clientId: string): Promise<EngagementWithMilestones[]> {
  const supabase = await createClient();
  const { data: engagements } = await supabase
    .from("engagements")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (!engagements?.length) return [];

  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .in("engagement_id", engagements.map((e) => e.id))
    .order("position", { ascending: true });

  return engagements.map((engagement) => ({
    ...engagement,
    milestones: (milestones ?? []).filter((m) => m.engagement_id === engagement.id),
  }));
}

export interface EngagementDetail {
  engagement: Engagement;
  milestones: Milestone[];
  deliverables: Deliverable[];
  notes: Note[];
  internalNotes: InternalNote[];
  authors: Record<string, User>;
}

export async function getEngagementDetail(engagementId: string): Promise<EngagementDetail | null> {
  const supabase = await createClient();

  const { data: engagement } = await supabase.from("engagements").select("*").eq("id", engagementId).maybeSingle();
  if (!engagement) return null;

  const [{ data: milestones }, { data: deliverables }, { data: notes }, { data: internalNotes }] = await Promise.all([
    supabase.from("milestones").select("*").eq("engagement_id", engagementId).order("position", { ascending: true }),
    supabase.from("deliverables").select("*").eq("engagement_id", engagementId).order("created_at", { ascending: false }),
    supabase.from("notes").select("*").eq("engagement_id", engagementId).order("created_at", { ascending: true }),
    supabase.from("internal_notes").select("*").eq("engagement_id", engagementId).order("created_at", { ascending: true }),
  ]);

  const authorIds = Array.from(
    new Set([...(notes ?? []).map((n) => n.author_id), ...(internalNotes ?? []).map((n) => n.author_id)].filter(Boolean) as string[])
  );

  let authors: Record<string, User> = {};
  if (authorIds.length) {
    const { data: authorRows } = await supabase.from("users").select("*").in("id", authorIds);
    authors = Object.fromEntries((authorRows ?? []).map((u) => [u.id, u]));
  }

  return {
    engagement,
    milestones: milestones ?? [],
    deliverables: deliverables ?? [],
    notes: notes ?? [],
    internalNotes: internalNotes ?? [],
    authors,
  };
}

export async function getQuestionnaireResponses(engagementId: string): Promise<QuestionnaireResponse[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("questionnaire_responses").select("*").eq("engagement_id", engagementId);
  return data ?? [];
}

export function milestoneProgress(milestones: Milestone[]) {
  const total = milestones.length;
  const complete = milestones.filter((m) => m.status === "complete").length;
  return { complete, total };
}

export interface OnboardingStatus {
  needsOnboarding: boolean;
  engagement: Engagement | null;
}

export async function getOnboardingStatus(clientId: string): Promise<OnboardingStatus> {
  const supabase = await createClient();

  const { data: engagements } = await supabase
    .from("engagements")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  const engagement = engagements?.[0] ?? null;
  if (!engagement) return { needsOnboarding: false, engagement: null };

  const { data: responses } = await supabase
    .from("questionnaire_responses")
    .select("id")
    .eq("engagement_id", engagement.id)
    .limit(1);

  return { needsOnboarding: !responses?.length, engagement };
}
