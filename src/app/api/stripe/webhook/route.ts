import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructWebhookEvent } from "@/lib/stripe";
import { sendNotificationEmail } from "@/lib/resend";
import { fmt } from "@/lib/quote/data";
import type { EmailTrigger } from "@/lib/resend/templates";
import type { LeadStatus, Lead, PaymentMilestone } from "@/types/database";
import type Stripe from "stripe";

type Admin = ReturnType<typeof createAdminClient>;

const RECEIPT_TRIGGERS: Record<PaymentMilestone, EmailTrigger> = {
  full: "payment_received_starting",
  deposit: "payment_received_starting",
  midpoint: "payment_receipt_midpoint",
  final: "payment_receipt_final",
  subscription: "subscription_confirmation",
};

const STATUS_AFTER_MILESTONE: Partial<Record<PaymentMilestone, LeadStatus>> = {
  full: "deposit_paid",
  deposit: "deposit_paid",
  midpoint: "midpoint_paid",
  final: "completed",
};

async function sendReceiptEmail(lead: Lead, milestone: PaymentMilestone, amountCents: number) {
  await sendNotificationEmail({
    trigger: RECEIPT_TRIGGERS[milestone],
    to: lead.email,
    vars: { name: lead.name, amount: fmt(amountCents / 100), planLabel: "Your subscription" },
  });
}

/** Marks payments tied to a Checkout Session paid, advances the lead, and sends receipts. */
async function handlePaidSession(admin: Admin, session: Stripe.Checkout.Session, leadId: string) {
  const { data: payments } = await admin
    .from("payments")
    .select("*")
    .eq("stripe_session_id", session.id)
    .is("paid_at", null);

  if (!payments?.length) return;

  await admin.from("payments").update({ paid_at: new Date().toISOString() }).eq("stripe_session_id", session.id).is("paid_at", null);

  const { data: lead } = await admin.from("leads").select("*").eq("id", leadId).single();
  if (!lead) return;

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId && !lead.stripe_customer_id) {
    await admin.from("leads").update({ stripe_customer_id: customerId }).eq("id", leadId);
  }

  for (const payment of payments) {
    await sendReceiptEmail(lead, payment.milestone, payment.amount);
  }

  const primary = payments.find((p) => p.milestone !== "subscription");
  const newStatus = primary && STATUS_AFTER_MILESTONE[primary.milestone];
  if (newStatus) {
    await admin.from("leads").update({ status: newStatus }).eq("id", leadId);
  }
}

/** Marks a milestone invoice paid, advances the lead, and sends a receipt. */
async function handlePaidInvoice(admin: Admin, invoice: Stripe.Invoice) {
  const { data: payment } = await admin
    .from("payments")
    .select("*")
    .eq("stripe_invoice_id", invoice.id)
    .is("paid_at", null)
    .maybeSingle();
  if (!payment) return;

  await admin.from("payments").update({ paid_at: new Date().toISOString() }).eq("id", payment.id);

  const { data: lead } = await admin.from("leads").select("*").eq("id", payment.lead_id).single();
  if (!lead) return;

  await sendReceiptEmail(lead, payment.milestone, payment.amount);

  const newStatus = STATUS_AFTER_MILESTONE[payment.milestone];
  if (newStatus) {
    await admin.from("leads").update({ status: newStatus }).eq("id", lead.id);
  }
}

/**
 * On successful payment, either advances a quote-builder lead (deposit,
 * milestone, or subscription) or — for the legacy client-creation flow —
 * notifies admins to start onboarding a new client.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event | null;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (!event) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const leadId = session.metadata?.lead_id;

    if (leadId) {
      await handlePaidSession(admin, session, leadId);
    } else {
      const email = session.customer_details?.email ?? session.customer_email;

      if (email) {
        const { data: existingUser } = await admin.from("users").select("id").eq("email", email).maybeSingle();

        if (!existingUser) {
          const { data: admins } = await admin.from("users").select("id").eq("role", "admin");
          if (admins?.length) {
            await admin.from("notifications").insert(
              admins.map((a) => ({
                user_id: a.id,
                message: `New payment received from ${email} — start the client creation flow`,
              }))
            );
          }
        }
      }
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    await handlePaidInvoice(admin, invoice);
  }

  return NextResponse.json({ received: true });
}
