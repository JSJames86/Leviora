import { EmailLayout, EmailHeading, EmailBody, EmailButton } from "./Layout";

export interface NotificationEmailProps {
  heading: string;
  greeting: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  preview: string;
}

/**
 * Single branded shell reused across every trigger — each trigger supplies its
 * own heading/copy/CTA via lib/resend/templates.ts, satisfying "one template
 * per trigger, single CTA button per email" without 14 near-identical files.
 */
export function NotificationEmail({ heading, greeting, paragraphs, ctaLabel, ctaHref, preview }: NotificationEmailProps) {
  return (
    <EmailLayout preview={preview}>
      <EmailHeading>{heading}</EmailHeading>
      <EmailBody>{greeting}</EmailBody>
      {paragraphs.map((paragraph, index) => (
        <EmailBody key={index}>{paragraph}</EmailBody>
      ))}
      <EmailButton href={ctaHref}>{ctaLabel}</EmailButton>
    </EmailLayout>
  );
}

export default NotificationEmail;
