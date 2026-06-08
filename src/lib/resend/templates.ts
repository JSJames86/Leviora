export type EmailTrigger =
  | "client_invited"
  | "onboarding_complete"
  | "milestone_updated"
  | "milestone_completed"
  | "document_ready"
  | "link_delivered"
  | "note_replied"
  | "engagement_completed"
  | "document_needs_review"
  | "client_onboarded"
  | "questionnaire_submitted"
  | "document_generated"
  | "client_note_added"
  | "engagement_idle";

export interface EmailContent {
  subject: string;
  heading: string;
  greeting: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaPath: string;
}

/** Maps each notification trigger to its branded subject, copy, and single CTA. */
export const EMAIL_TEMPLATES: Record<EmailTrigger, (vars: Record<string, string>) => EmailContent> = {
  client_invited: (v) => ({
    subject: "You're invited — set up your Leviora account",
    heading: "You've been invited to your Leviora client portal",
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: [
      "We're delighted to start working together. Your client portal is ready — set a password to get into your dashboard, track milestones, and message your specialist directly.",
    ],
    ctaLabel: "Set up my account",
    ctaPath: "/invite",
  }),
  onboarding_complete: (v) => ({
    subject: "We've got everything we need — we're on it",
    heading: "We've got everything we need — we're on it",
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: [
      "Thanks for completing your onboarding. Your specialist is reviewing everything you shared and will be in touch with next steps soon.",
      "You can track progress on your dashboard any time.",
    ],
    ctaLabel: "Go to my dashboard",
    ctaPath: "/portal",
  }),
  milestone_updated: (v) => ({
    subject: `Update on your ${v.engagementTitle ?? "engagement"}`,
    heading: `Update on your ${v.engagementTitle ?? "engagement"}`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: [`“${v.milestoneTitle ?? "A milestone"}” is now ${v.status ?? "in progress"}. Here's the latest on your engagement.`],
    ctaLabel: "View progress",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  milestone_completed: (v) => ({
    subject: `${v.milestoneTitle ?? "A milestone"} is done ✓`,
    heading: `${v.milestoneTitle ?? "A milestone"} is done ✓`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: [`Great news — “${v.milestoneTitle ?? "a milestone"}” on ${v.engagementTitle ?? "your engagement"} is now complete.`],
    ctaLabel: "View progress",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  document_ready: (v) => ({
    subject: `Your ${v.documentName ?? "document"} is ready`,
    heading: `Your ${v.documentName ?? "document"} is ready`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: ["Your document has been reviewed, approved, and added to your deliverables — take a look whenever you're ready."],
    ctaLabel: "View deliverables",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  link_delivered: (v) => ({
    subject: `Your ${v.linkName ?? "link"} is live`,
    heading: `Your ${v.linkName ?? "link"} is live`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: ["We've delivered a new link to your deliverables — it's ready for you to visit."],
    ctaLabel: "View deliverables",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  note_replied: (v) => ({
    subject: "Leviora responded to your note",
    heading: "Leviora responded to your note",
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: [`Your specialist replied on ${v.engagementTitle ?? "your engagement"}. Head to your portal to read it and continue the conversation.`],
    ctaLabel: "View the conversation",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}?tab=notes`,
  }),
  engagement_completed: (v) => ({
    subject: `Your ${v.engagementTitle ?? "engagement"} is complete 🎉`,
    heading: `Your ${v.engagementTitle ?? "engagement"} is complete 🎉`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: ["We're proud of what we built together. All of your deliverables are ready in your portal — thank you for trusting Leviora with this work."],
    ctaLabel: "View your deliverables",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  document_needs_review: (v) => ({
    subject: `${v.documentName ?? "Your document"} is ready for your review`,
    heading: `${v.documentName ?? "Your document"} is ready for your review`,
    greeting: `Hi ${v.name ?? "there"},`,
    paragraphs: ["Take a look and let us know if anything needs adjusting — once you approve, we'll move forward right away."],
    ctaLabel: "Review document",
    ctaPath: `/portal/engagements/${v.engagementId ?? ""}`,
  }),
  client_onboarded: (v) => ({
    subject: `New client onboarded — ${v.name ?? "a new client"}`,
    heading: `New client onboarded — ${v.name ?? "a new client"}`,
    greeting: "Hi team,",
    paragraphs: [`${v.name ?? "A new client"} just finished onboarding for ${v.engagementTitle ?? "their engagement"}. Time to kick things off.`],
    ctaLabel: "View client",
    ctaPath: `/admin/clients/${v.clientId ?? ""}`,
  }),
  questionnaire_submitted: (v) => ({
    subject: `Intake complete for ${v.engagementTitle ?? "an engagement"} — document generating`,
    heading: `Intake complete for ${v.engagementTitle ?? "an engagement"}`,
    greeting: "Hi team,",
    paragraphs: ["The client's questionnaire has been submitted and a draft document is generating now. It'll land in the documents queue shortly."],
    ctaLabel: "Open documents queue",
    ctaPath: "/admin/documents",
  }),
  document_generated: (v) => ({
    subject: `${v.documentName ?? "A document"} ready for your review`,
    heading: `${v.documentName ?? "A document"} ready for your review`,
    greeting: "Hi team,",
    paragraphs: [`A new draft for ${v.engagementTitle ?? "an engagement"} is ready for internal review before it goes to the client.`],
    ctaLabel: "Review document",
    ctaPath: `/admin/documents/${v.documentId ?? ""}`,
  }),
  client_note_added: (v) => ({
    subject: `New note from ${v.name ?? "a client"}`,
    heading: `New note from ${v.name ?? "a client"}`,
    greeting: "Hi team,",
    paragraphs: [`${v.name ?? "A client"} left a new note on ${v.engagementTitle ?? "an engagement"}. It's waiting on a reply.`],
    ctaLabel: "Reply to note",
    ctaPath: `/admin/engagements/${v.engagementId ?? ""}?tab=notes`,
  }),
  engagement_idle: (v) => ({
    subject: `No activity on ${v.engagementTitle ?? "an engagement"} — check in?`,
    heading: `No activity on ${v.engagementTitle ?? "an engagement"} — check in?`,
    greeting: "Hi team,",
    paragraphs: [`${v.engagementTitle ?? "This engagement"} hasn't moved in 7 days. A quick check-in note could keep momentum going.`],
    ctaLabel: "Open engagement",
    ctaPath: `/admin/engagements/${v.engagementId ?? ""}`,
  }),
};
