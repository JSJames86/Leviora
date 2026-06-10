import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeMilestones, computeQuote, toCents } from "@/lib/quote/compute";
import { fmt } from "@/lib/quote/data";
import { createLineItemCheckoutSession, createMilestoneInvoice } from "@/lib/stripe";
import { sendNotificationEmail } from "@/lib/resend";
import type { PaymentMilestone } from "@/types/database";

interface PaymentsCreateBody {
  lead_id: string;
  milestone: PaymentMilestone;
}

const MILESTONE_LABELS: Record<PaymentMilestone, string> = {
  full: "payment",
  deposit: "deposit",
  midpoint: "midpoint installment",
  final: "final installment",
  subscription: "subscription",
};

/** Manually triggers a milestone payment for a lead — admin only. */
export async function POST(request: Request) {
  const caller = await createClient();
  const {
    data: { user: authUser },
  } = await caller.auth.getUser();

  const role = (authUser?.app_metadata?.role as string | undefined) ?? "client";
  if (!authUser || role !== "admin") {
    return NextResponse.json({ error: "Only Leviora admins can create payment requests." }, { status: 403 });
  }

  const body = (await request.json()) as Partial<PaymentsCreateBody>;
  if (!body.lead_id || !body.milestone) {
    return NextResponse.json({ error: "lead_id and milestone are required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: lead, error } = await admin.from("leads").select("*").eq("id", body.lead_id).single();
  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const quote = computeQuote(lead.quote_json.selection);
  const milestones = computeMilestones(quote);

  let amountCents: number;
  let description: string;
  switch (body.milestone) {
    case "full":
      amountCents = toCents(quote.projectTotal);
      description = "Leviora services — full payment";
      break;
    case "deposit":
      if (!milestones) return NextResponse.json({ error: "This quote doesn't require milestone payments." }, { status: 400 });
      amountCents = toCents(milestones.deposit);
      description = "Leviora services — deposit (1/3 of services + government fees)";
      break;
    case "midpoint":
      if (!milestones) return NextResponse.json({ error: "This quote doesn't require milestone payments." }, { status: 400 });
      amountCents = toCents(milestones.midpoint);
      description = "Leviora services — midpoint installment";
      break;
    case "final":
      if (!milestones) return NextResponse.json({ error: "This quote doesn't require milestone payments." }, { status: 400 });
      amountCents = toCents(milestones.final);
      description = "Leviora services — final installment";
      break;
    default:
      return NextResponse.json({ error: "Unsupported milestone for manual payment requests." }, { status: 400 });
  }

  let paymentUrl: string | null = null;
  let stripeSessionId: string | null = null;
  let stripeInvoiceId: string | null = null;

  if (body.milestone === "full" || body.milestone === "deposit") {
    const session = await createLineItemCheckoutSession({
      customer: lead.stripe_customer_id ?? undefined,
      customerEmail: lead.stripe_customer_id ? undefined : lead.email,
      items: [{ name: description, amountCents }],
      successPath: "/intake/success",
      cancelPath: "/intake",
      metadata: { lead_id: lead.id, kind: body.milestone },
    });
    if (!session?.url) {
      return NextResponse.json({ error: "Couldn't create a checkout session — is Stripe configured?" }, { status: 503 });
    }
    paymentUrl = session.url;
    stripeSessionId = session.id;
  } else {
    const invoice = await createMilestoneInvoice({
      customerEmail: lead.email,
      customerName: lead.name,
      description,
      amountCents,
      metadata: { lead_id: lead.id, kind: body.milestone },
    });
    if (!invoice?.hosted_invoice_url) {
      return NextResponse.json({ error: "Couldn't create an invoice — is Stripe configured?" }, { status: 503 });
    }
    paymentUrl = invoice.hosted_invoice_url;
    stripeInvoiceId = invoice.id;
  }

  await admin.from("payments").insert({
    lead_id: lead.id,
    milestone: body.milestone,
    amount: amountCents,
    stripe_session_id: stripeSessionId,
    stripe_invoice_id: stripeInvoiceId,
  });

  await sendNotificationEmail({
    trigger: "payment_request",
    to: lead.email,
    vars: {
      name: lead.name,
      milestoneLabel: MILESTONE_LABELS[body.milestone],
      amount: fmt(amountCents / 100),
      paymentUrl,
    },
  });

  return NextResponse.json({ paymentUrl });
}
