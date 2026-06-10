import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" });
  }
  return client;
}

export type StripePackage = "starter" | "growth" | "elevated";

/**
 * Price lookup keys expected to exist in the connected Stripe account.
 * Configure these via the Stripe dashboard and reference them by lookup_key
 * so price IDs never need to be hardcoded.
 */
export const PACKAGE_PRICE_LOOKUP_KEYS: Record<StripePackage, string> = {
  starter: "leviora_starter_monthly",
  growth: "leviora_growth_monthly",
  elevated: "leviora_elevated_monthly",
};

export const ALACARTE_PRICE_LOOKUP_KEY = "leviora_alacarte_one_time";

export async function createCheckoutSession({
  customerEmail,
  mode,
  lookupKey,
  successPath = "/admin/clients/new?step=3",
  cancelPath = "/admin/clients/new",
}: {
  customerEmail: string;
  mode: "subscription" | "payment";
  lookupKey: string;
  successPath?: string;
  cancelPath?: string;
}) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const prices = await stripe.prices.list({ lookup_keys: [lookupKey], expand: ["data.product"] });
  const price = prices.data[0];
  if (!price) return null;

  return stripe.checkout.sessions.create({
    mode,
    customer_email: customerEmail,
    line_items: [{ price: price.id, quantity: 1 }],
    success_url: `${siteUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${cancelPath}`,
  });
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const stripe = getStripeClient();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return null;
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

/** Finds a Stripe customer by email, creating one if none exists yet. */
export async function getOrCreateCustomer(email: string, name?: string) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0];

  return stripe.customers.create({ email, name });
}

export type CheckoutLineItem = {
  name: string;
  amountCents: number;
  /** Set for recurring add-ons — makes the session (and any one-time items in it) part of a subscription. */
  recurring?: "month" | "year";
};

/**
 * Builds a Checkout Session from inline price_data line items — used for
 * quote-driven payments where prices aren't pre-provisioned in Stripe.
 * Mode is "subscription" if any item recurs (one-time items in a subscription
 * session are billed once, on the first invoice, alongside the recurring items).
 */
export async function createLineItemCheckoutSession({
  customer,
  customerEmail,
  items,
  successPath,
  cancelPath,
  metadata,
}: {
  customer?: string;
  customerEmail?: string;
  items: CheckoutLineItem[];
  successPath: string;
  cancelPath: string;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripeClient();
  if (!stripe || items.length === 0) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mode = items.some((item) => item.recurring) ? "subscription" : "payment";

  return stripe.checkout.sessions.create({
    mode,
    ...(customer ? { customer } : { customer_email: customerEmail }),
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.amountCents,
        product_data: { name: item.name },
        ...(item.recurring ? { recurring: { interval: item.recurring } } : {}),
      },
      quantity: 1,
    })),
    success_url: `${siteUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${cancelPath}`,
    metadata,
  });
}

/**
 * Creates and finalizes a one-off invoice for a milestone payment (midpoint
 * or final), returning its hosted invoice page. Never auto-charges — the
 * client pays via the hosted page.
 */
export async function createMilestoneInvoice({
  customerEmail,
  customerName,
  description,
  amountCents,
  metadata,
}: {
  customerEmail: string;
  customerName?: string;
  description: string;
  amountCents: number;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const customer = await getOrCreateCustomer(customerEmail, customerName);
  if (!customer) return null;

  await stripe.invoiceItems.create({
    customer: customer.id,
    amount: amountCents,
    currency: "usd",
    description,
  });

  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    days_until_due: 14,
    metadata,
  });

  return stripe.invoices.finalizeInvoice(invoice.id);
}
