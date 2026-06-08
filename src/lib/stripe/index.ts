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
