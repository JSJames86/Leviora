import { createClient } from "@/lib/supabase/server";
import type { Client, Engagement, GeneratedDocument, InternalNote, Note, User } from "@/types";

export interface AdminStats {
  activeClients: number;
  activeEngagements: number;
  documentsPendingReview: number;
  unreadNotes: number;
}

export interface ActivityItem {
  id: string;
  kind: "note" | "milestone" | "document" | "engagement";
  message: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  kind: "document" | "note" | "idle";
  label: string;
  href: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [{ count: activeClients }, { count: activeEngagements }, { count: documentsPendingReview }, { data: recentNotes }] =
    await Promise.all([
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase.from("engagements").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("generated_documents").select("id", { count: "exact", head: true }).in("status", ["draft", "reviewed"]),
      supabase.from("notes").select("id, created_at").order("created_at", { ascending: false }).limit(50),
    ]);

  // "Unread notes" = client notes posted in the last 7 days (admin notification proxy).
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const unreadNotes = (recentNotes ?? []).filter((n) => new Date(n.created_at).getTime() > weekAgo).length;

  return {
    activeClients: activeClients ?? 0,
    activeEngagements: activeEngagements ?? 0,
    documentsPendingReview: documentsPendingReview ?? 0,
    unreadNotes,
  };
}

export async function getActivityFeed(limit = 12): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const [{ data: notes }, { data: milestones }, { data: documents }] = await Promise.all([
    supabase.from("notes").select("id, body, created_at, engagement_id").order("created_at", { ascending: false }).limit(limit),
    supabase
      .from("milestones")
      .select("id, title, status, completed_at, engagement_id")
      .eq("status", "complete")
      .order("completed_at", { ascending: false })
      .limit(limit),
    supabase
      .from("generated_documents")
      .select("id, status, generated_at, engagement_id")
      .order("generated_at", { ascending: false })
      .limit(limit),
  ]);

  const engagementIds = Array.from(
    new Set([...(notes ?? []), ...(milestones ?? []), ...(documents ?? [])].map((row) => row.engagement_id).filter(Boolean) as string[])
  );
  const titleByEngagement = await getEngagementTitles(engagementIds);

  const items: ActivityItem[] = [
    ...(notes ?? []).map((n) => ({
      id: `note-${n.id}`,
      kind: "note" as const,
      message: `New note on ${titleByEngagement[n.engagement_id ?? ""] ?? "an engagement"}`,
      createdAt: n.created_at,
    })),
    ...(milestones ?? []).map((m) => ({
      id: `milestone-${m.id}`,
      kind: "milestone" as const,
      message: `“${m.title}” marked complete on ${titleByEngagement[m.engagement_id ?? ""] ?? "an engagement"}`,
      createdAt: m.completed_at ?? "",
    })),
    ...(documents ?? []).map((d) => ({
      id: `document-${d.id}`,
      kind: "document" as const,
      message: `Document ${d.status === "draft" ? "generated" : d.status} for ${titleByEngagement[d.engagement_id ?? ""] ?? "an engagement"}`,
      createdAt: d.generated_at,
    })),
  ];

  return items
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getActionItems(): Promise<ActionItem[]> {
  const supabase = await createClient();

  const [{ data: docs }, { data: notes }, { data: engagements }] = await Promise.all([
    supabase.from("generated_documents").select("id, status, engagement_id").in("status", ["draft", "reviewed"]).limit(5),
    supabase.from("notes").select("id, engagement_id, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("engagements").select("id, title, status, updated_at").eq("status", "active"),
  ]);

  const engagementIds = Array.from(
    new Set([...(docs ?? []), ...(notes ?? [])].map((row) => row.engagement_id).filter(Boolean) as string[])
  );
  const titleByEngagement = await getEngagementTitles(engagementIds);

  const idleCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const idle = (engagements ?? []).filter((e) => new Date(e.updated_at).getTime() < idleCutoff);

  const items: ActionItem[] = [
    ...(docs ?? []).map((d) => ({
      id: `doc-${d.id}`,
      kind: "document" as const,
      label: `Review document for ${titleByEngagement[d.engagement_id ?? ""] ?? "an engagement"}`,
      href: `/admin/documents/${d.id}`,
    })),
    ...(notes ?? []).slice(0, 3).map((n) => ({
      id: `note-${n.id}`,
      kind: "note" as const,
      label: `Reply to note on ${titleByEngagement[n.engagement_id ?? ""] ?? "an engagement"}`,
      href: `/admin/engagements/${n.engagement_id}?tab=notes`,
    })),
    ...idle.map((e) => ({
      id: `idle-${e.id}`,
      kind: "idle" as const,
      label: `No activity on ${e.title} — check in?`,
      href: `/admin/engagements/${e.id}`,
    })),
  ];

  return items.slice(0, 8);
}

async function getEngagementTitles(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("engagements").select("id, title").in("id", ids);
  return Object.fromEntries((data ?? []).map((e) => [e.id, e.title]));
}

export interface ClientListRow extends Client {
  user: User | null;
  engagements: Engagement[];
}

export async function getClientsList(): Promise<ClientListRow[]> {
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (!clients?.length) return [];

  const userIds = clients.map((c) => c.user_id).filter(Boolean) as string[];
  const [{ data: users }, { data: engagements }] = await Promise.all([
    userIds.length ? supabase.from("users").select("*").in("id", userIds) : Promise.resolve({ data: [] as User[] }),
    supabase.from("engagements").select("*").in("client_id", clients.map((c) => c.id)),
  ]);

  const userById = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

  return clients.map((client) => ({
    ...client,
    user: client.user_id ? userById[client.user_id] ?? null : null,
    engagements: (engagements ?? []).filter((e) => e.client_id === client.id),
  }));
}

export interface ClientDetail {
  client: Client;
  user: User | null;
  engagements: Engagement[];
  notes: (Note & { engagementTitle: string })[];
  internalNotes: (InternalNote & { engagementTitle: string })[];
}

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", clientId).maybeSingle();
  if (!client) return null;

  const [{ data: user }, { data: engagements }] = await Promise.all([
    client.user_id ? supabase.from("users").select("*").eq("id", client.user_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("engagements").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
  ]);

  const engagementIds = (engagements ?? []).map((e) => e.id);
  let notes: (Note & { engagementTitle: string })[] = [];
  let internalNotes: (InternalNote & { engagementTitle: string })[] = [];

  if (engagementIds.length) {
    const titleById = Object.fromEntries((engagements ?? []).map((e) => [e.id, e.title]));
    const [{ data: noteRows }, { data: internalRows }] = await Promise.all([
      supabase.from("notes").select("*").in("engagement_id", engagementIds).order("created_at", { ascending: false }),
      supabase.from("internal_notes").select("*").in("engagement_id", engagementIds).order("created_at", { ascending: false }),
    ]);
    notes = (noteRows ?? []).map((n) => ({ ...n, engagementTitle: titleById[n.engagement_id] ?? "" }));
    internalNotes = (internalRows ?? []).map((n) => ({ ...n, engagementTitle: titleById[n.engagement_id] ?? "" }));
  }

  return { client, user: user ?? null, engagements: engagements ?? [], notes, internalNotes };
}

export interface DocumentRow extends GeneratedDocument {
  engagementTitle: string;
  clientName: string;
}

export async function getDocumentsQueue(): Promise<DocumentRow[]> {
  const supabase = await createClient();
  const { data: documents } = await supabase.from("generated_documents").select("*").order("generated_at", { ascending: false });
  if (!documents?.length) return [];

  const engagementIds = Array.from(new Set(documents.map((d) => d.engagement_id).filter(Boolean) as string[]));
  const { data: engagements } = await supabase.from("engagements").select("id, title, client_id").in("id", engagementIds);
  const clientIds = Array.from(new Set((engagements ?? []).map((e) => e.client_id).filter(Boolean) as string[]));
  const { data: clients } = await supabase.from("clients").select("id, company_name").in("id", clientIds);

  const clientNameById = Object.fromEntries((clients ?? []).map((c) => [c.id, c.company_name ?? "Unnamed client"]));
  const engagementById = Object.fromEntries((engagements ?? []).map((e) => [e.id, e]));

  return documents.map((doc) => {
    const engagement = doc.engagement_id ? engagementById[doc.engagement_id] : null;
    return {
      ...doc,
      engagementTitle: engagement?.title ?? "—",
      clientName: engagement?.client_id ? clientNameById[engagement.client_id] ?? "—" : "—",
    };
  });
}

export async function getDocumentDetail(documentId: string) {
  const supabase = await createClient();
  const { data: document } = await supabase.from("generated_documents").select("*").eq("id", documentId).maybeSingle();
  if (!document) return null;

  const { data: engagement } = document.engagement_id
    ? await supabase.from("engagements").select("*").eq("id", document.engagement_id).maybeSingle()
    : { data: null };

  const { data: client } = engagement?.client_id
    ? await supabase.from("clients").select("*").eq("id", engagement.client_id).maybeSingle()
    : { data: null };

  return { document, engagement: engagement ?? null, client: client ?? null };
}
