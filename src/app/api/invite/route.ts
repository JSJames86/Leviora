import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/resend";
import { MILESTONE_TEMPLATES } from "@/types";
import type { PackageType, ServiceType } from "@/types";

interface InviteRequestBody {
  fullName: string;
  email: string;
  companyName: string;
  phone?: string;
  packageType: PackageType;
  services: ServiceType[];
}

function slugifyCompanyName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "client";
}

const SERVICE_TITLES: Record<ServiceType, string> = {
  llc_formation: "LLC Formation",
  ein_registration: "EIN Registration",
  website_setup: "Website Setup",
};

export async function POST(request: Request) {
  const caller = await createClient();
  const {
    data: { user: authUser },
  } = await caller.auth.getUser();

  const role = (authUser?.app_metadata?.role as string | undefined) ?? "client";
  if (!authUser || role !== "admin") {
    return NextResponse.json({ error: "Only Leviora admins can send invites." }, { status: 403 });
  }

  const body = (await request.json()) as InviteRequestBody;
  if (!body.email || !body.fullName || !body.companyName || !body.services?.length) {
    return NextResponse.json({ error: "Missing required client details." }, { status: 400 });
  }

  const admin = createAdminClient();
  const intakeEmail = `intake+${slugifyCompanyName(body.companyName)}@levioraventures.com`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(body.email, {
    data: { full_name: body.fullName, role: "client" },
    redirectTo: `${siteUrl}/invite`,
  });

  if (inviteError || !invited.user) {
    return NextResponse.json({ error: inviteError?.message ?? "Couldn't send the invite." }, { status: 500 });
  }

  const { data: client, error: clientError } = await admin
    .from("clients")
    .insert({
      user_id: invited.user.id,
      company_name: body.companyName,
      phone: body.phone ?? null,
      intake_email: intakeEmail,
    })
    .select()
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Couldn't create the client record." }, { status: 500 });
  }

  const engagementRows = body.services.map((service) => ({
    client_id: client.id,
    title: `${SERVICE_TITLES[service]} — ${body.companyName}`,
    package_type: body.packageType,
    status: "active" as const,
  }));

  const { data: engagements, error: engagementError } = await admin.from("engagements").insert(engagementRows).select();
  if (engagementError || !engagements) {
    return NextResponse.json({ error: "Couldn't create engagements." }, { status: 500 });
  }

  const milestoneRows = engagements.flatMap((engagement, index) => {
    const service = body.services[index];
    return MILESTONE_TEMPLATES[service].map((title, position) => ({
      engagement_id: engagement.id,
      title,
      status: "pending" as const,
      position: position + 1,
    }));
  });

  if (milestoneRows.length) {
    await admin.from("milestones").insert(milestoneRows);
  }

  await sendNotificationEmail({
    trigger: "client_invited",
    to: body.email,
    vars: { name: body.fullName },
  });

  return NextResponse.json({ client, engagements, intakeEmail });
}
