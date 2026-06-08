import { Body, Container, Head, Html, Preview, Section, Text, Hr, Link } from "@react-email/components";
import type { ReactNode } from "react";

const colors = {
  primary: "#7BB8D4",
  background: "#FAFAF7",
  surface: "#FFFFFF",
  textPrimary: "#1C2B35",
  textSecondary: "#6B8A99",
  border: "#E8F0F4",
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.background, fontFamily: "Inter, Arial, sans-serif", padding: "32px 0" }}>
        <Container
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            padding: "40px",
            maxWidth: 480,
          }}
        >
          <Text style={{ fontFamily: "Georgia, serif", fontSize: 22, color: colors.textPrimary, margin: "0 0 24px", letterSpacing: 0.5 }}>
            Leviora Ventures
          </Text>
          {children}
          <Hr style={{ borderColor: colors.border, margin: "32px 0 16px" }} />
          <Text style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>
            Leviora Ventures · Boutique business consulting ·{" "}
            <Link href="https://levioraventures.com" style={{ color: colors.primary }}>
              levioraventures.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <Text style={{ fontFamily: "Georgia, serif", fontSize: 26, color: colors.textPrimary, margin: "0 0 12px", lineHeight: 1.3 }}>
      {children}
    </Text>
  );
}

export function EmailBody({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 1.6, margin: "0 0 16px" }}>{children}</Text>;
}

export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Section style={{ margin: "28px 0 4px" }}>
      <Link
        href={href}
        style={{
          backgroundColor: colors.primary,
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          padding: "12px 28px",
          borderRadius: 12,
          display: "inline-block",
        }}
      >
        {children}
      </Link>
    </Section>
  );
}
