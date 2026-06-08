import type { QuestionnaireResponse, ServiceType } from "@/types";
import { SERVICE_DEFINITIONS } from "@/types";

const BRAND_STYLES = `
  body { font-family: 'Georgia', serif; color: #1C2B35; padding: 56px; }
  header { border-bottom: 2px solid #C5E4F3; padding-bottom: 20px; margin-bottom: 32px; }
  h1 { font-size: 28px; margin: 0 0 4px; letter-spacing: 0.5px; }
  .subtitle { color: #6B8A99; font-size: 14px; margin: 0; }
  h2 { font-size: 16px; color: #7BB8D4; text-transform: uppercase; letter-spacing: 1.5px; margin: 28px 0 12px; }
  dl { display: grid; grid-template-columns: 220px 1fr; row-gap: 10px; column-gap: 16px; margin: 0; }
  dt { color: #6B8A99; font-size: 13px; }
  dd { margin: 0; font-size: 14px; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E8F0F4; color: #6B8A99; font-size: 12px; }
`;

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildDocumentHtml({
  serviceType,
  clientName,
  engagementTitle,
  responses,
  generatedAt,
}: {
  serviceType: ServiceType;
  clientName: string;
  engagementTitle: string;
  responses: QuestionnaireResponse[];
  generatedAt: string;
}) {
  const definition = SERVICE_DEFINITIONS.find((d) => d.key === serviceType);
  const answerByKey = Object.fromEntries(responses.map((r) => [r.question_key, r.answer ?? "—"]));

  const fieldsHtml = (definition?.fields ?? [])
    .map(
      (field) => `
        <dt>${escapeHtml(field.label)}</dt>
        <dd>${escapeHtml(answerByKey[field.key] ?? "—")}</dd>
      `
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${BRAND_STYLES}</style>
  </head>
  <body>
    <header>
      <h1>Leviora Ventures</h1>
      <p class="subtitle">${escapeHtml(definition?.label ?? "Service Document")} · Prepared for ${escapeHtml(clientName)}</p>
    </header>

    <h2>Engagement</h2>
    <dl>
      <dt>Engagement</dt>
      <dd>${escapeHtml(engagementTitle)}</dd>
      <dt>Generated</dt>
      <dd>${escapeHtml(new Date(generatedAt).toLocaleString("en-US"))}</dd>
    </dl>

    <h2>Intake details</h2>
    <dl>${fieldsHtml}</dl>

    <footer>
      This document was generated from the client's intake questionnaire and is pending internal review before delivery.
      Leviora Ventures · Boutique business consulting
    </footer>
  </body>
</html>`;
}
