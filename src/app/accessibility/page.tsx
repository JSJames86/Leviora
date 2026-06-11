import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Accessibility — Leviora Ventures",
  description: "Leviora Ventures' commitment to an accessible website and client portal.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Accessibility Statement"
      updated="June 10, 2026"
      notice={
        <>
          <strong className="text-[#0f2030]">Draft for review.</strong> This statement reflects the accessibility
          practices built into the site today. It hasn&rsquo;t been reviewed by an accessibility specialist yet —
          treat it as a starting point, not a compliance certification.
        </>
      }
    >
      <div>
        <h2>Our commitment</h2>
        <p>
          Leviora Ventures is committed to making{" "}
          <a href="https://levioraventures.com">levioraventures.com</a> and the Leviora client portal usable by as
          many people as possible, including people who use assistive technology such as screen readers, screen
          magnifiers, and keyboard-only navigation. We aim to meet the Web Content Accessibility Guidelines (WCAG)
          2.1 Level AA wherever practical.
        </p>
      </div>

      <div>
        <h2>Measures we&rsquo;ve taken</h2>
        <ul>
          <li>Semantic HTML structure with descriptive headings and landmarks</li>
          <li>Visible keyboard focus states on links, buttons, and form controls throughout the site and portal</li>
          <li>Descriptive labels and ARIA attributes on interactive components, including modals and toggles</li>
          <li>Sufficient color contrast for text against its background in our core color palette</li>
          <li>Support for closing dialogs and overlays with the keyboard (Escape key)</li>
          <li>Responsive layouts that work across screen sizes and zoom levels</li>
        </ul>
      </div>

      <div>
        <h2>Known limitations</h2>
        <p>
          Some animations and motion effects are used throughout the site for visual interest. We aim to keep these
          subtle, but if you experience discomfort from motion, please let us know — we&rsquo;re happy to help, and
          we&rsquo;re working toward honoring reduced-motion preferences across the site.
        </p>
      </div>

      <div>
        <h2>Third-party content</h2>
        <p>
          Some features — such as scheduling (Calendly) and payment checkout (Stripe) — are provided by third-party
          services embedded in our site. We choose providers that prioritize accessibility, but we don&rsquo;t
          control their interfaces directly.
        </p>
      </div>

      <div>
        <h2>Feedback</h2>
        <p>
          If you encounter an accessibility barrier anywhere on our site or in the client portal, please let us know
          at <a href="mailto:hello@levioraventures.com">hello@levioraventures.com</a>. Tell us the page you were on
          and what happened, and we&rsquo;ll do our best to fix it and get back to you.
        </p>
      </div>
    </LegalPageShell>
  );
}
