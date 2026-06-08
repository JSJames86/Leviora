import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructWebhookEvent } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * On successful payment, records the Stripe customer/session against the
 * matching engagement (matched by customer email) and notifies admins to
 * kick off the new client creation flow if no client exists yet.
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;

    if (email) {
      const admin = createAdminClient();
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

  return NextResponse.json({ received: true });
}
