import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Leviora Ventures",
  description: "How Leviora Ventures collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 10, 2026"
      notice={
        <>
          <strong className="text-[#0f2030]">Draft for review.</strong> This policy describes how the Leviora
          Ventures platform actually collects and handles information today. It hasn&rsquo;t been reviewed by an
          attorney yet — treat it as a starting point, not a final legal document.
        </>
      }
    >
      <div>
        <h2>Overview</h2>
        <p>
          Leviora Ventures (&ldquo;Leviora,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) provides business formation,
          infrastructure, and advisory services through{" "}
          <a href="https://levioraventures.com">levioraventures.com</a> and the Leviora client portal. This policy
          explains what information we collect when you use our site and portal, how we use it, and the choices you
          have.
        </p>
      </div>

      <div>
        <h2>Information we collect</h2>
        <p>We collect information directly from you and through your use of our tools:</p>
        <ul>
          <li>
            <strong>Quote &amp; intake details.</strong> When you build a quote or submit the intake form, we collect
            your name, email, phone number, business name, business stage, and state, along with the services you
            selected and the resulting quote.
          </li>
          <li>
            <strong>Account information.</strong> If you sign in to the client portal, we collect your email address
            and the information associated with your account, engagements, milestones, and uploaded documents.
          </li>
          <li>
            <strong>Onboarding &amp; engagement details.</strong> Information you provide while onboarding —
            including your typed signature on our scope of work — and any notes or files exchanged during your
            engagement.
          </li>
          <li>
            <strong>Payment information.</strong> Payments are processed by Stripe. We do not store your card number
            or full payment details — we retain a record of the payment amount, milestone, and Stripe identifiers
            needed to reconcile your account.
          </li>
          <li>
            <strong>Usage information.</strong> Standard technical information such as IP address, browser type, and
            pages visited, collected by our hosting provider for security and reliability.
          </li>
        </ul>
      </div>

      <div>
        <h2>How we use your information</h2>
        <p>We use the information above to:</p>
        <ul>
          <li>Prepare and send you an itemized quote for the services you&rsquo;re interested in</li>
          <li>Set up, manage, and deliver your engagement, including filings with state and federal agencies</li>
          <li>
            Send transactional emails — quote confirmations, status updates, portal invitations, and engagement
            notifications — through our email provider, Resend
          </li>
          <li>Process payments and reconcile your account through Stripe</li>
          <li>Maintain the security and integrity of our platform</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </div>

      <div>
        <h2>Cookies &amp; local storage</h2>
        <p>
          The client portal uses cookies to keep you signed in securely (managed by our authentication provider,
          Supabase). When you build a quote, your selections are saved temporarily in your browser&rsquo;s session
          storage so they can carry over to the intake form — this information stays on your device and is cleared
          when your session ends or you submit the intake form.
        </p>
      </div>

      <div>
        <h2>Third-party services</h2>
        <p>We rely on a small number of trusted providers to operate Leviora:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — database hosting and authentication for the client portal
          </li>
          <li>
            <strong>Stripe</strong> — payment processing
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery
          </li>
          <li>
            <strong>Calendly</strong> — scheduling for discovery calls
          </li>
          <li>
            <strong>State and federal agencies</strong> — where your engagement involves business formation or
            registration, we share the information necessary to complete those filings on your behalf
          </li>
        </ul>
        <p>Each of these providers processes information only as needed to provide their part of the service.</p>
      </div>

      <div>
        <h2>Data retention &amp; security</h2>
        <p>
          We retain quote, engagement, and account information for as long as needed to provide our services and
          meet our recordkeeping obligations. Access to client data within our systems is restricted to Leviora
          team members who need it to deliver your engagement, and is protected by row-level security policies on
          our database.
        </p>
      </div>

      <div>
        <h2>Your rights &amp; choices</h2>
        <p>
          You can ask us to access, correct, or delete the personal information we hold about you by emailing{" "}
          <a href="mailto:hello@levioraventures.com">hello@levioraventures.com</a>. If you have a portal account, you
          can also update most of your information directly within the portal.
        </p>
      </div>

      <div>
        <h2>Children&rsquo;s privacy</h2>
        <p>
          Leviora&rsquo;s services are intended for business owners, founders, and organizations, and are not
          directed at children. We do not knowingly collect personal information from anyone under 16.
        </p>
      </div>

      <div>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as our services evolve. We&rsquo;ll update the &ldquo;Last updated&rdquo; date
          above when we do, and significant changes will be communicated to active clients.
        </p>
      </div>

      <div>
        <h2>Contact us</h2>
        <p>
          Questions about this policy? Reach us at{" "}
          <a href="mailto:hello@levioraventures.com">hello@levioraventures.com</a>.
        </p>
      </div>
    </LegalPageShell>
  );
}
