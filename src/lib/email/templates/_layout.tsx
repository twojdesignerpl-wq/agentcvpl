import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

// Brand tokens zgodne z src/app/globals.css
const CREAM = "#F5F1E8";
const CREAM_SOFT = "#F2EADB";
const INK = "#0A0E1A";
const INK_SOFT = "#2B2F3D";
const INK_MUTED = "#5A607A";
const SAFFRON = "#E08E3C";
const BRAND_URL = "https://agentcv.pl";

type Props = {
  preview: string;
  children: ReactNode;
};

export function EmailLayout({ preview, children }: Props) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: CREAM,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: INK,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "32px 24px",
          }}
        >
          {/* Header — brand */}
          <Section style={{ paddingBottom: 28 }}>
            <Link
              href={BRAND_URL}
              style={{
                color: INK,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: SAFFRON,
                  color: CREAM,
                  textAlign: "center" as const,
                  lineHeight: "28px",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                P
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
                agentcv
              </span>
            </Link>
          </Section>

          {/* Content card */}
          <Section
            style={{
              backgroundColor: CREAM_SOFT,
              border: `1px solid ${INK}15`,
              borderRadius: 16,
              padding: "32px 28px",
            }}
          >
            {children}
          </Section>

          {/* Footer */}
          <Hr style={{ border: "none", borderTop: `1px solid ${INK}14`, margin: "32px 0 16px" }} />
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: INK_MUTED,
              margin: "0 0 8px",
            }}
          >
            Pracuś AI · CV pod polskie realia · agentcv.pl
          </Text>
          <Text style={{ fontSize: 11, lineHeight: 1.5, color: INK_MUTED, margin: 0 }}>
            Dostałeś ten e-mail bo masz konto w agentcv. Masz pytanie?{" "}
            <Link
              href="mailto:hej@agentcv.pl"
              style={{ color: INK_SOFT, textDecoration: "underline" }}
            >
              hej@agentcv.pl
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const BRAND = {
  URL: BRAND_URL,
  CREAM,
  CREAM_SOFT,
  INK,
  INK_SOFT,
  INK_MUTED,
  SAFFRON,
} as const;

// Button style helper (React Email Button jest deprecated, używamy Link jako CTA)
export const ctaButtonStyle = {
  display: "inline-block",
  backgroundColor: INK,
  color: CREAM,
  padding: "14px 28px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
  lineHeight: 1,
} as const;
