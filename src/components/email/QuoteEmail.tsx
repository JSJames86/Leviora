import { Column, Hr, Row, Section, Text } from "@react-email/components";
import { fmt } from "@/lib/quote/data";
import type { ComputedQuote, MilestonePlan } from "@/lib/quote/compute";
import type { BusinessStage } from "@/types/database";
import { colors, EmailBody, EmailButton, EmailHeading, EmailLayout } from "./Layout";

const lineStyle = { fontSize: 13, color: colors.textPrimary, margin: "0 0 4px" };
const subtleLineStyle = { fontSize: 13, color: colors.textSecondary, margin: "0 0 4px" };

function QuoteLineItems({ quote, milestones }: { quote: ComputedQuote; milestones: MilestonePlan | null }) {
  return (
    <Section style={{ margin: "16px 0" }}>
      {quote.lines.map((line, i) => (
        <Row key={i}>
          <Column>
            <Text style={line.kind === "pass" ? subtleLineStyle : lineStyle}>
              {line.label}
              {line.kind === "pass" ? " (pass-through)" : ""}
            </Text>
          </Column>
          <Column align="right">
            <Text style={line.kind === "pass" ? subtleLineStyle : lineStyle}>
              {fmt(line.amt)}
              {line.per ?? ""}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={{ borderColor: colors.border, margin: "12px 0" }} />

      <Row>
        <Column><Text style={subtleLineStyle}>Leviora services</Text></Column>
        <Column align="right"><Text style={subtleLineStyle}>{fmt(quote.oneTime)}</Text></Column>
      </Row>
      <Row>
        <Column><Text style={subtleLineStyle}>Government fees (pass-through)</Text></Column>
        <Column align="right"><Text style={subtleLineStyle}>{fmt(quote.passThrough)}</Text></Column>
      </Row>
      {quote.savings > 0 && (
        <Row>
          <Column><Text style={{ ...subtleLineStyle, color: colors.success, fontWeight: 600 }}>Bundle savings</Text></Column>
          <Column align="right"><Text style={{ ...subtleLineStyle, color: colors.success, fontWeight: 600 }}>−{fmt(quote.savings)}</Text></Column>
        </Row>
      )}
      <Row>
        <Column><Text style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: "8px 0 0" }}>Due today</Text></Column>
        <Column align="right"><Text style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: "8px 0 0" }}>{fmt(quote.dueToday)}</Text></Column>
      </Row>

      {quote.recurring.length > 0 && (
        <Text style={{ ...subtleLineStyle, marginTop: 8 }}>
          Then {quote.recurring.map((r) => `${fmt(r.amt)}${r.per ?? ""} ${r.label.toLowerCase()}`).join(" · ")}
        </Text>
      )}

      {milestones && (
        <Text style={{ ...subtleLineStyle, marginTop: 8 }}>
          Split into 3 milestone payments — deposit of {fmt(milestones.deposit)} to start
          {milestones.depositPassThrough > 0
            ? ` (${fmt(milestones.depositServices)} for 1/3 of services + ${fmt(milestones.depositPassThrough)} in government fees)`
            : ` (1/3 of services)`}
          , then {fmt(milestones.midpoint)} at the midpoint and {fmt(milestones.final)} on completion.
        </Text>
      )}
    </Section>
  );
}

export function LeadConfirmationEmail({
  name,
  quote,
  milestones,
  checkoutUrl,
  bookingUrl,
}: {
  name: string;
  quote: ComputedQuote;
  milestones: MilestonePlan | null;
  checkoutUrl?: string | null;
  bookingUrl?: string | null;
}) {
  return (
    <EmailLayout preview="We got your quote request">
      <EmailHeading>We got your quote request</EmailHeading>
      <EmailBody>Hi {name},</EmailBody>
      <EmailBody>
        Thanks for building a quote with Leviora. Here&apos;s exactly what you selected — every line itemized, no surprises.
      </EmailBody>

      <QuoteLineItems quote={quote} milestones={milestones} />

      {checkoutUrl ? (
        <>
          <EmailBody>
            Ready to get started? Pay securely below — your project kicks off as soon as your payment is confirmed.
          </EmailBody>
          <EmailButton href={checkoutUrl}>Pay & get started</EmailButton>
        </>
      ) : bookingUrl ? (
        <>
          <EmailBody>
            Projects over $1,000 start with a short discovery call so we can confirm scope before anything is billed.
            Grab a time that works for you — we&apos;ll send your deposit link right after.
          </EmailBody>
          <EmailButton href={bookingUrl}>Book your discovery call</EmailButton>
        </>
      ) : null}
    </EmailLayout>
  );
}

export function LeadNotificationEmail({
  lead,
  quote,
  milestones,
}: {
  lead: {
    name: string;
    email: string;
    phone: string | null;
    business_name: string | null;
    business_stage: BusinessStage | null;
    state: string | null;
    notes: string | null;
  };
  quote: ComputedQuote;
  milestones: MilestonePlan | null;
}) {
  return (
    <EmailLayout preview={`New quote request from ${lead.name}`}>
      <EmailHeading>New quote request</EmailHeading>
      <EmailBody>{lead.name} just submitted a quote.</EmailBody>

      <Section style={{ margin: "16px 0" }}>
        <Text style={lineStyle}>Email: {lead.email}</Text>
        <Text style={lineStyle}>Phone: {lead.phone ?? "—"}</Text>
        <Text style={lineStyle}>Business: {lead.business_name ?? "—"} ({lead.business_stage ?? "stage unknown"})</Text>
        <Text style={lineStyle}>State: {lead.state ?? "—"}</Text>
        {lead.notes && <Text style={lineStyle}>Notes: {lead.notes}</Text>}
      </Section>

      <QuoteLineItems quote={quote} milestones={milestones} />
    </EmailLayout>
  );
}
