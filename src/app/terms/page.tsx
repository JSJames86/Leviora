import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — Leviora Ventures",
  description: "The terms that govern your use of Leviora Ventures' site, portal, and services.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Service"
      updated="June 10, 2026"
      notice={
        <>
          <strong className="text-[#0f2030]">Draft for review.</strong> These terms describe how Leviora Ventures
          engagements work today. They haven&rsquo;t been reviewed by an attorney yet — please have them reviewed
          before relying on them.
        </>
      }
    >
      <div>
        <h2>Agreement to terms</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
          <a href="https://levioraventures.com">levioraventures.com</a> and the Leviora client portal (together, the
          &ldquo;Services&rdquo;), operated by Leviora Ventures LLC (&ldquo;Leviora,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;). By using the Services, you agree to these Terms. If you don&rsquo;t agree, please
          don&rsquo;t use the Services.
        </p>
      </div>

      <div>
        <h2>Our services</h2>
        <p>
          Leviora provides business formation, compliance, digital, capital-readiness, and advisory services for
          founders, small businesses, and nonprofits. The quote builder on our site provides an itemized estimate
          based on the options you select; it is an estimate only and may change once we review your specific
          situation.
        </p>
      </div>

      <div>
        <h2>Quotes, engagements &amp; scope of work</h2>
        <p>
          Submitting an intake form or quote request does not create an engagement. An engagement begins once we&rsquo;ve
          confirmed your scope of work and you&rsquo;ve accepted it — including signing the scope of work in your
          client portal. Your engagement proceeds according to the milestones shown on your portal dashboard, and
          we&rsquo;ll reach out if we need additional information from you to keep things moving.
        </p>
      </div>

      <div>
        <h2>Fees &amp; payment</h2>
        <p>
          Fees for your selected services are shown in your itemized quote and billed according to the payment
          schedule shared at signup — which may include a deposit, milestone-based payments, a final payment, or a
          recurring subscription, depending on the services selected. Payments are processed securely through
          Stripe. Government filing fees and other pass-through costs are itemized separately and are non-refundable
          once submitted to the relevant agency.
        </p>
      </div>

      <div>
        <h2>Filings with third parties &amp; government agencies</h2>
        <p>
          Where your engagement involves filing documents with state or federal agencies (such as forming an LLC,
          registering with SAM.gov, or filing for tax-exempt status), you authorize Leviora to act on your behalf for
          those limited purposes. Timelines shared in your portal are estimates based on agency processing times and
          the completeness of the information you provide. Delays caused by third parties — including state filing
          offices and the IRS — are outside Leviora&rsquo;s control.
        </p>
      </div>

      <div>
        <h2>Client responsibilities</h2>
        <p>
          You agree to provide accurate, complete information and to respond to requests for information in a
          timely manner so your engagement can proceed on schedule. Leviora is not responsible for delays or filing
          issues caused by inaccurate or incomplete information you provide.
        </p>
      </div>

      <div>
        <h2>Intellectual property &amp; deliverables</h2>
        <p>
          Deliverables prepared specifically for you as part of your engagement (such as filed documents, websites,
          and frameworks built for your business) are yours to use once paid in full. Leviora retains ownership of
          its underlying tools, templates, frameworks, and methodologies, and may reuse general know-how gained
          across engagements.
        </p>
      </div>

      <div>
        <h2>Confidentiality</h2>
        <p>
          We treat the information you share with us as confidential and use it only to deliver the services
          described in your engagement. We won&rsquo;t share it outside of the third-party providers and agencies
          described in our <a href="/privacy">Privacy Policy</a> without your consent, except as required by law.
        </p>
      </div>

      <div>
        <h2>Disclaimers &amp; limitation of liability</h2>
        <p>
          Leviora provides business formation, operational, and advisory support — we are not a law firm, and
          nothing on our site or portal constitutes legal, tax, or financial advice. You should consult a licensed
          attorney or accountant for advice specific to your situation. To the fullest extent permitted by law,
          Leviora&rsquo;s liability arising from the Services is limited to the fees you&rsquo;ve paid us for the
          engagement giving rise to the claim.
        </p>
      </div>

      <div>
        <h2>Termination</h2>
        <p>
          Either party may end an engagement with written notice. Completed milestones and any government fees
          already incurred remain billable. We may suspend or terminate access to the portal for accounts that
          violate these Terms.
        </p>
      </div>

      <div>
        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of New Jersey, without regard to its conflict-of-law
          principles.
        </p>
      </div>

      <div>
        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms from time to time. We&rsquo;ll update the &ldquo;Last updated&rdquo; date above
          when we do, and material changes will be communicated to active clients.
        </p>
      </div>

      <div>
        <h2>Contact us</h2>
        <p>
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:hello@levioraventures.com">hello@levioraventures.com</a>.
        </p>
      </div>
    </LegalPageShell>
  );
}
