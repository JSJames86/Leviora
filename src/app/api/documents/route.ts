import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/resend";
import { renderHtmlToPdf } from "@/lib/puppeteer";
import { buildDocumentHtml } from "@/lib/puppeteer/templates";
import type { ServiceType } from "@/types";

/**
 * Generates a draft document PDF from a submitted questionnaire, stores it in
 * Supabase Storage, records it as a `draft` generated_document, and notifies admins.
 */
export async function POST(request: Request) {
  const caller = await createClient();
  const {
    data: { user },
  } = await caller.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { engagementId, serviceType } = (await request.json()) as { engagementId: string; serviceType: ServiceType };
  if (!engagementId || !serviceType) {
    return NextResponse.json({ error: "engagementId and serviceType are required." }, { status: 400 });
  }

  const admin = createAdminClient();

  const [{ data: engagement }, { data: client }, { data: responses }, { data: template }] = await Promise.all([
    admin.from("engagements").select("*").eq("id", engagementId).maybeSingle(),
    admin
      .from("engagements")
      .select("client_id, clients(company_name)")
      .eq("id", engagementId)
      .maybeSingle()
      .then(({ data }) => ({ data: (data as unknown as { clients: { company_name: string } | null })?.clients ?? null })),
    admin.from("questionnaire_responses").select("*").eq("engagement_id", engagementId),
    admin.from("document_templates").select("*").eq("service_type", serviceType).maybeSingle(),
  ]);

  if (!engagement) return NextResponse.json({ error: "Engagement not found." }, { status: 404 });

  const html = buildDocumentHtml({
    serviceType,
    clientName: client?.company_name ?? "Client",
    engagementTitle: engagement.title,
    responses: responses ?? [],
    generatedAt: new Date().toISOString(),
  });

  let storageUrl: string | null = null;
  try {
    const pdfBuffer = await renderHtmlToPdf(html);
    const path = `generated/${engagementId}-${Date.now()}.pdf`;
    const { error: uploadError } = await admin.storage.from("documents").upload(path, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (!uploadError) {
      storageUrl = admin.storage.from("documents").getPublicUrl(path).data.publicUrl;
    }
  } catch (err) {
    // PDF rendering requires a Chromium binary that may not be present in this
    // environment (e.g. local dev without Chrome). Persist the record without
    // a file so the review workflow can still be exercised.
    console.error("PDF generation failed", err);
  }

  const { data: document, error } = await admin
    .from("generated_documents")
    .insert({
      engagement_id: engagementId,
      template_id: template?.id ?? null,
      storage_url: storageUrl,
      status: "draft",
    })
    .select()
    .single();

  if (error || !document) {
    return NextResponse.json({ error: "Couldn't save the generated document." }, { status: 500 });
  }

  const { data: admins } = await admin.from("users").select("id, email, full_name").eq("role", "admin");
  if (admins?.length) {
    await admin.from("notifications").insert(
      admins.map((a) => ({
        user_id: a.id,
        engagement_id: engagementId,
        message: `Intake complete for ${engagement.title} — document generating`,
      }))
    );
    await Promise.all(
      admins.map((a) =>
        sendNotificationEmail({
          trigger: "questionnaire_submitted",
          to: a.email,
          vars: { engagementTitle: engagement.title },
        })
      )
    );
  }

  return NextResponse.json({ document });
}

/**
 * Admin review action: approve (drops the document into deliverables and
 * notifies the client) or request a revision (internal note only).
 */
export async function PATCH(request: Request) {
  const caller = await createClient();
  const {
    data: { user: authUser },
  } = await caller.auth.getUser();
  const role = (authUser?.app_metadata?.role as string | undefined) ?? "client";
  if (!authUser || role !== "admin") {
    return NextResponse.json({ error: "Only Leviora admins can review documents." }, { status: 403 });
  }

  const { documentId, action, note } = (await request.json()) as {
    documentId: string;
    action: "approve" | "request_revision";
    note?: string;
  };
  if (!documentId || !action) {
    return NextResponse.json({ error: "documentId and action are required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: document } = await admin.from("generated_documents").select("*").eq("id", documentId).maybeSingle();
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const { data: engagement } = document.engagement_id
    ? await admin.from("engagements").select("*").eq("id", document.engagement_id).maybeSingle()
    : { data: null };

  if (note && document.engagement_id) {
    await admin.from("internal_notes").insert({ engagement_id: document.engagement_id, author_id: authUser.id, body: note });
  }

  if (action === "request_revision") {
    await admin.from("generated_documents").update({ status: "reviewed", reviewed_at: new Date().toISOString() }).eq("id", documentId);
    return NextResponse.json({ ok: true, status: "reviewed" });
  }

  // Approve: mark approved, drop into deliverables, notify the client.
  await admin
    .from("generated_documents")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", documentId);

  if (engagement?.id) {
    await admin.from("deliverables").insert({
      engagement_id: engagement.id,
      title: `${engagement.title} — Document`,
      type: "document",
      url: document.storage_url,
    });

    const { data: client } = engagement.client_id
      ? await admin.from("clients").select("*, users(email, full_name)").eq("id", engagement.client_id).maybeSingle()
      : { data: null };
    const clientUser = (client as unknown as { users: { email: string; full_name: string } | null })?.users ?? null;

    if (client?.user_id) {
      await admin.from("notifications").insert({
        user_id: client.user_id,
        engagement_id: engagement.id,
        message: `Your ${engagement.title} document is ready`,
      });
    }
    if (clientUser?.email) {
      await sendNotificationEmail({
        trigger: "document_ready",
        to: clientUser.email,
        vars: { name: clientUser.full_name ?? "", documentName: engagement.title, engagementId: engagement.id },
      });
    }
  }

  return NextResponse.json({ ok: true, status: "approved" });
}
