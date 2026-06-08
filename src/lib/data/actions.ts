"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/resend";

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
