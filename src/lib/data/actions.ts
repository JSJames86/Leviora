"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/resend";
import type { Deliverable, DeliverableType, Milestone, MilestoneStatus } from "@/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role as string | undefined) ?? "client";
  return { supabase, user, isAdmin: Boolean(user) && role === "admin" };
}

async function loadEngagementWithClient(engagementId: string) {
  const admin = createAdminClient();
  const { data: engagement } = await admin
    .from("engagements")
    .select("*, clients(company_name, user_id)")
    .eq("id", engagementId)
    .maybeSingle();
  if (!engagement) return null;
  const client = (engagement as unknown as { clients: { company_name: string; user_id: string | null } | null }).clients;
  return { engagement, client };
}

export async function addNote(engagementId: string, body: string, revalidatePathTarget: string) {
  const trimmed = body.trim();
  if (!trimmed) return { error: "Write something before sending." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in to post a note." };

  const role = (user.app_metadata?.role as string | undefined) ?? "client";

  const { error } = await supabase.from("notes").insert({ engagement_id: engagementId, author_id: user.id, body: trimmed });
  if (error) return { error: "Couldn't post your note — please try again." };

  await notifyOnNewNote({ engagementId, authorRole: role, authorName: user.user_metadata?.full_name as string | undefined });

  revalidatePath(revalidatePathTarget);
  return { success: true };
}

async function notifyOnNewNote({
  engagementId,
  authorRole,
  authorName,
}: {
  engagementId: string;
  authorRole: string;
  authorName?: string;
}) {
  const admin = createAdminClient();
  const { data: engagement } = await admin.from("engagements").select("*, clients(company_name, user_id)").eq("id", engagementId).maybeSingle();
  if (!engagement) return;

  const client = (engagement as unknown as { clients: { company_name: string; user_id: string | null } | null }).clients;

  if (authorRole === "client") {
    // Notify admins that a client left a note.
    const { data: admins } = await admin.from("users").select("id, email").eq("role", "admin");
    if (admins?.length) {
      await admin.from("notifications").insert(
        admins.map((a) => ({ user_id: a.id, engagement_id: engagementId, message: `New note from ${client?.company_name ?? "a client"}` }))
      );
      await Promise.all(
        admins.map((a) =>
          sendNotificationEmail({ trigger: "client_note_added", to: a.email, vars: { name: client?.company_name ?? "A client", engagementTitle: engagement.title, engagementId } })
        )
      );
    }
  } else if (client?.user_id) {
    // Notify the client that Leviora replied.
    const { data: clientUser } = await admin.from("users").select("email, full_name").eq("id", client.user_id).maybeSingle();
    await admin.from("notifications").insert({ user_id: client.user_id, engagement_id: engagementId, message: `Leviora responded to your note on ${engagement.title}` });
    if (clientUser?.email) {
      await sendNotificationEmail({ trigger: "note_replied", to: clientUser.email, vars: { name: clientUser.full_name ?? "", engagementTitle: engagement.title, engagementId } });
    }
  }

  void authorName;
}

export async function addInternalNote(engagementId: string, body: string, revalidatePathTarget: string) {
  const trimmed = body.trim();
  if (!trimmed) return { error: "Write something before saving." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role as string | undefined) ?? "client";
  if (!user || role !== "admin") return { error: "Only Leviora admins can add internal notes." };

  const { error } = await supabase.from("internal_notes").insert({ engagement_id: engagementId, author_id: user.id, body: trimmed });
  if (error) return { error: "Couldn't save the note — please try again." };

  revalidatePath(revalidatePathTarget);
  return { success: true };
}

export async function updateMilestoneStatus(milestoneId: string, status: MilestoneStatus, revalidatePathTarget: string) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Only Leviora admins can update milestones." };

  const { data: milestone, error } = await supabase
    .from("milestones")
    .update({ status, completed_at: status === "complete" ? new Date().toISOString() : null })
    .eq("id", milestoneId)
    .select()
    .single();
  if (error || !milestone) return { error: "Couldn't update the milestone — please try again." };

  await notifyOnMilestoneChange(milestone);

  revalidatePath(revalidatePathTarget);
  return { success: true };
}

async function notifyOnMilestoneChange(milestone: Milestone) {
  const loaded = await loadEngagementWithClient(milestone.engagement_id);
  if (!loaded?.client?.user_id) return;

  const admin = createAdminClient();
  const { data: clientUser } = await admin.from("users").select("email, full_name").eq("id", loaded.client.user_id).maybeSingle();
  if (!clientUser?.email) return;

  const statusLabel = milestone.status === "in_progress" ? "in progress" : milestone.status;
  const trigger = milestone.status === "complete" ? "milestone_completed" : "milestone_updated";

  await admin.from("notifications").insert({
    user_id: loaded.client.user_id,
    engagement_id: milestone.engagement_id,
    message: `“${milestone.title}” is now ${statusLabel} on ${loaded.engagement.title}`,
  });
  await sendNotificationEmail({
    trigger,
    to: clientUser.email,
    vars: {
      name: clientUser.full_name ?? "",
      engagementTitle: loaded.engagement.title,
      engagementId: milestone.engagement_id,
      milestoneTitle: milestone.title,
      status: statusLabel,
    },
  });
}

export async function addDeliverable(
  engagementId: string,
  input: { title: string; type: DeliverableType; url: string; milestoneId: string | null },
  revalidatePathTarget: string
) {
  const title = input.title.trim();
  const url = input.url.trim();
  if (!title || !url) return { error: "Add a title and a link before saving." };

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Only Leviora admins can add deliverables." };

  const { data: deliverable, error } = await supabase
    .from("deliverables")
    .insert({ engagement_id: engagementId, milestone_id: input.milestoneId, title, type: input.type, url })
    .select()
    .single();
  if (error || !deliverable) return { error: "Couldn't add the deliverable — please try again." };

  await notifyOnNewDeliverable(deliverable);

  revalidatePath(revalidatePathTarget);
  return { success: true };
}

async function notifyOnNewDeliverable(deliverable: Deliverable) {
  const loaded = await loadEngagementWithClient(deliverable.engagement_id);
  if (!loaded?.client?.user_id) return;

  const admin = createAdminClient();
  const { data: clientUser } = await admin.from("users").select("email, full_name").eq("id", loaded.client.user_id).maybeSingle();
  if (!clientUser?.email) return;

  const isLink = deliverable.type === "link";
  await admin.from("notifications").insert({
    user_id: loaded.client.user_id,
    engagement_id: deliverable.engagement_id,
    message: `New ${isLink ? "link" : "document"} added to ${loaded.engagement.title}: ${deliverable.title}`,
  });
  await sendNotificationEmail({
    trigger: isLink ? "link_delivered" : "document_ready",
    to: clientUser.email,
    vars: {
      name: clientUser.full_name ?? "",
      engagementTitle: loaded.engagement.title,
      engagementId: deliverable.engagement_id,
      documentName: deliverable.title,
      linkName: deliverable.title,
    },
  });
}

export async function removeDeliverable(deliverableId: string, revalidatePathTarget: string) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Only Leviora admins can remove deliverables." };

  const { error } = await supabase.from("deliverables").delete().eq("id", deliverableId);
  if (error) return { error: "Couldn't remove the deliverable — please try again." };

  revalidatePath(revalidatePathTarget);
  return { success: true };
}
