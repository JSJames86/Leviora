import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeMilestones, computeQuote, toCents, type QuoteSelection } from "@/lib/quote/compute";
import { createLineItemCheckoutSession, type CheckoutLineItem } from "@/lib/stripe";
import { sendQuoteEmail } from "@/lib/resend";
import type { BusinessStage } from "@/types/database";

const BUSINESS_STAGES = new Set<BusinessStage>(["idea", "formed", "operating"]);

interface IntakeRequestBody {
  selection: QuoteSelection;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessStage?: string;
  notes?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<IntakeRequestBody>;

  const name = body.name?.trim();
  const email = body.email?.trim();
  if (!name || !email || !body.selection) {
    return NextResponse.json({ error: "Name, email, and a quote selection are required." }, { status: 400 });
  }

  const quote = computeQuote(body.selection);
  if (quote.lines.length === 0) {
    return NextResponse.json({ error: "Your quote is empty — select at least one service." }, { status: 400 });
  }
  const milestones = computeMilestones(quote);
  const businessStage = BUSINESS_STAGES.has(body.businessStage as BusinessStage) ? (body.businessStage as BusinessStage) : null;

  const admin = createAdminClient();
  const { data: lead, error } = await admin
    .from("leads")
    .insert({
      name,
      email,
      phone: body.phone?.trim() || null,
      business_name: body.businessName?.trim() || null,
      business_stage: businessStage,
      state: body.selection.state,
      quote_json: { selection: body.selection, computed: quote, milestones },
      quote_total: toCents(quote.projectTotal),
      pass_through_total: toCents(quote.passThrough),
    })
    .select()
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Couldn't save your quote — please try again." }, { status: 500 });
  }

  const recurringItems: CheckoutLineItem[] = quote.recurring.map((r) => ({
    name: r.label,
    amountCents: toCents(r.amt),
    recurring: r.per === "/yr" ? "year" : "month",
  }));

  let checkoutUrl: string | null = null;
  let subscriptionUrl: string | null = null;
  let bookingUrl: string | null = null;

  if (quote.projectTotal > 1000) {
    bookingUrl = process.env.BOOKING_URL ?? null;

    if (recurringItems.length > 0) {
      const session = await createLineItemCheckoutSession({
        customerEmail: lead.email,
        items: recurringItems,
        successPath: "/intake/success",
        cancelPath: "/intake",
        metadata: { lead_id: lead.id, kind: "subscription" },
      });
      if (session?.url) {
        subscriptionUrl = session.url;
        await admin.from("payments").insert({
          lead_id: lead.id,
          milestone: "subscription",
          amount: toCents(quote.recurring.reduce((s, r) => s + r.amt, 0)),
          stripe_session_id: session.id,
        });
      }
    }
  } else if (quote.projectTotal > 0 || recurringItems.length > 0) {
    const oneTimeItems: CheckoutLineItem[] = [];
    if (quote.oneTime > 0) oneTimeItems.push({ name: "Leviora services", amountCents: toCents(quote.oneTime) });
    if (quote.passThrough > 0) oneTimeItems.push({ name: `${body.selection.state} government fees (pass-through)`, amountCents: toCents(quote.passThrough) });

    const session = await createLineItemCheckoutSession({
      customerEmail: lead.email,
      items: [...oneTimeItems, ...recurringItems],
      successPath: "/intake/success",
      cancelPath: "/intake",
      metadata: { lead_id: lead.id, kind: "intake" },
    });

    if (session?.url) {
      checkoutUrl = session.url;
      const paymentRows = [];
      if (quote.projectTotal > 0) {
        paymentRows.push({
          lead_id: lead.id,
          milestone: "full" as const,
          amount: toCents(quote.projectTotal),
          stripe_session_id: session.id,
        });
      }
      if (recurringItems.length > 0) {
        paymentRows.push({
          lead_id: lead.id,
          milestone: "subscription" as const,
          amount: toCents(quote.recurring.reduce((s, r) => s + r.amt, 0)),
          stripe_session_id: session.id,
        });
      }
      await admin.from("payments").insert(paymentRows);
    }
  }

  await sendQuoteEmail({
    type: "client",
    to: lead.email,
    lead,
    quote,
    milestones,
    checkoutUrl,
    bookingUrl,
  });

  const { data: admins } = await admin.from("users").select("email").eq("role", "admin");
  for (const a of admins ?? []) {
    await sendQuoteEmail({ type: "internal", to: a.email, lead, quote, milestones });
  }

  return NextResponse.json({ leadId: lead.id, checkoutUrl, subscriptionUrl, bookingUrl });
}
