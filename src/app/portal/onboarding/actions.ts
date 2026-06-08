"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/resend";

export interface OnboardingPayload {
  contactInfo: { fullName: string; companyName: string; phone: string; email: string };
  questionnaire: Record<string, string>;
  signature: string;
  agreedToTerms: boolean;
}

export async function completeOnboarding(engagementId: string, serviceType: string, payload: OnboardingPayload) {
  if (!payload.agreedToTerms || !payload.signature.trim()) {
    return { error: "Please agree to the terms and add your signature before continuing." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired — please sign in again." };

  const admin = createAdminClient();

  await admin
    .from("users")
    .update({ full_name: payload.contactInfo.fullName })
    .eq("id", user.id);

  const { data: client } = await admin.from("clients").select("*").eq("user_id", user.id).maybeSingle();
  if (!client) return { error: "We couldn't find your client record. Please contact your specialist." };

  await admin
    .from("clients")
    .update({ company_name: payload.contactInfo.companyName, phone: payload.contactInfo.phone })
    .eq("id", client.id);

  const responseRows = Object.entries(payload.questionnaire)
    .filter(([, answer]) => answer?.trim())
    .map(([question_key, answer]) => ({ engagement_id: engagementId, question_key, answer }));

  if (responseRows.length) {
    await admin.from("questionnaire_responses").insert(responseRows);
  }

  await admin.from("notes").insert({
    engagement_id: engagementId,
    author_id: user.id,
    body: `Signed scope of work and terms — digital signature on file: "${payload.signature.trim()}"`,
  });

  const { data: engagement } = await admin.from("engagements").select("*").eq("id", engagementId).maybeSingle();

  // Notify admins that onboarding is complete and a document is generating.
  const { data: admins } = await admin.from("users").select("id, email").eq("role", "admin");
  if (admins?.length && engagement) {
    await admin.from("notifications").insert(
      admins.map((a) => ({ user_id: a.id, engagement_id: engagementId, message: `New client onboarded — ${client.company_name ?? payload.contactInfo.companyName}` }))
    );
    await Promise.all(
      admins.map((a) =>
        sendNotificationEmail({
          trigger: "client_onboarded",
          to: a.email,
          vars: { name: client.company_name ?? payload.contactInfo.companyName, engagementTitle: engagement.title, clientId: client.id },
        })
      )
    );
  }

  await sendNotificationEmail({
    trigger: "onboarding_complete",
    to: payload.contactInfo.email,
    vars: { name: payload.contactInfo.fullName },
  });

  // Kick off document generation from the submitted questionnaire (best-effort).
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await fetch(`${siteUrl}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ engagementId, serviceType }),
    });
  } catch {
    // Document generation is best-effort during onboarding — admins can retry from the queue.
  }

  revalidatePath("/portal");
  return { success: true };
}
