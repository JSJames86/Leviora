import { Resend } from "resend";
import { NotificationEmail } from "@/components/email/NotificationEmail";
import { LeadConfirmationEmail, LeadNotificationEmail } from "@/components/email/QuoteEmail";
import type { ComputedQuote, MilestonePlan } from "@/lib/quote/compute";
import type { BusinessStage } from "@/types/database";
import { EMAIL_TEMPLATES, type EmailTrigger } from "./templates";

let client: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

/**
 * Sends a branded notification email for the given trigger. No-ops (logging
 * instead) when RESEND_API_KEY isn't configured, so the rest of the app keeps
 * working in environments without email credentials.
 */
export async function sendNotificationEmail({
  trigger,
  to,
  vars = {},
}: {
  trigger: EmailTrigger;
  to: string;
  vars?: Record<string, string>;
}) {
  const buildContent = EMAIL_TEMPLATES[trigger];
  const content = buildContent(vars);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ctaHref = /^https?:\/\//.test(content.ctaPath) ? content.ctaPath : `${siteUrl}${content.ctaPath}`;

  const resend = getResendClient();
  if (!resend) {
    console.info(`[resend:disabled] Would send "${content.subject}" to ${to} → ${ctaHref}`);
    return { skipped: true as const };
  }

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Leviora Ventures <hello@levioraventures.com>",
    to,
    subject: content.subject,
    react: NotificationEmail({
      heading: content.heading,
      greeting: content.greeting,
      paragraphs: content.paragraphs,
      ctaLabel: content.ctaLabel,
      ctaHref,
      preview: content.subject,
    }),
  });
}

type QuoteEmailLead = {
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_stage: BusinessStage | null;
  state: string | null;
  notes: string | null;
};

/**
 * Sends the itemized-quote email — either the client-facing confirmation
 * (with a checkout or booking CTA) or the internal new-lead notification.
 */
export async function sendQuoteEmail(
  args:
    | {
        type: "client";
        to: string;
        lead: QuoteEmailLead;
        quote: ComputedQuote;
        milestones: MilestonePlan | null;
        checkoutUrl?: string | null;
        bookingUrl?: string | null;
      }
    | {
        type: "internal";
        to: string;
        lead: QuoteEmailLead;
        quote: ComputedQuote;
        milestones: MilestonePlan | null;
      }
) {
  const { type, to, lead, quote, milestones } = args;
  const subject = type === "client" ? "We got your quote request" : `New quote request from ${lead.name}`;

  const react =
    type === "client"
      ? LeadConfirmationEmail({ name: lead.name, quote, milestones, checkoutUrl: args.checkoutUrl, bookingUrl: args.bookingUrl })
      : LeadNotificationEmail({ lead, quote, milestones });

  const resend = getResendClient();
  if (!resend) {
    console.info(`[resend:disabled] Would send "${subject}" to ${to}`);
    return { skipped: true as const };
  }

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Leviora Ventures <hello@levioraventures.com>",
    to,
    subject,
    react,
  });
}
