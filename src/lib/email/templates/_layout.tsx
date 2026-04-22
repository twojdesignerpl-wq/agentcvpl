import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

// Brand tokens — zgodne z src/app/globals.css (editorial palette)
export const BRAND = {
  URL: "https://agentcv.pl",
  CREAM: "#F5F1E8",
  CREAM_SOFT: "#F2EADB",
  CREAM_DEEP: "#EDE2D0",
  INK: "#0A0E1A",
  INK_SOFT: "#2B2F3D",
  INK_MUTED: "#5A607A",
  SAFFRON: "#E08E3C",
  SAFFRON_SOFT: "#F4C794",
  JADE: "#3D8B6E",
  JADE_SOFT: "#9BC5B2",
  RUST: "#B84A2E",
  BORDER: "#D8CFBE",
  BORDER_SOFT: "#E5DCC9",
} as const;

export const FONT = {
  DISPLAY: "'Syne', 'Helvetica Neue', Arial, sans-serif",
  BODY: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
  SERIF: "'Playfair Display', Georgia, 'Times New Roman', serif",
  MONO: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
} as const;

type Props = {
  preview: string;
  eyebrow?: string;
  children: ReactNode;
};

export function EmailLayout({ preview, eyebrow, children }: Props) {
  return (
    <Html lang="pl">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        {/* Web fonts — działają w klientach wspierających @font-face (Apple Mail, Outlook Mac, Fastmail, webmail) */}
        <Font
          fontFamily="Syne"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/syne/v22/8vIS7w4qzmVxsWxjBZRjr0FKM_04uQ.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRggexSg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggOxSvfedN62Zw.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtPK-F2qO0s.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFkD-vYSZviVYUb_rj3ij__anPXDTnohkk72xU.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="italic"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: BRAND.CREAM_DEEP,
          fontFamily: FONT.BODY,
          color: BRAND.INK,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Container
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "32px 20px",
          }}
        >
          {/* Brand header */}
          <Section style={{ padding: "4px 0 20px" }}>
            <Row>
              <Column style={{ width: "auto", verticalAlign: "middle" }}>
                <Link
                  href={BRAND.URL}
                  style={{ textDecoration: "none", color: BRAND.INK, display: "inline-block" }}
                >
                  <Img
                    src={`${BRAND.URL}/brand/pracus/ikona-1.png`}
                    width={44}
                    height={44}
                    alt="Pracuś AI"
                    style={{
                      borderRadius: 10,
                      display: "block",
                      border: `1px solid ${BRAND.BORDER_SOFT}`,
                    }}
                  />
                </Link>
              </Column>
              <Column style={{ paddingLeft: 14, verticalAlign: "middle" }}>
                <Link href={BRAND.URL} style={{ textDecoration: "none", color: BRAND.INK }}>
                  <Text
                    style={{
                      margin: 0,
                      fontFamily: FONT.DISPLAY,
                      fontWeight: 700,
                      fontSize: 22,
                      color: BRAND.INK,
                      letterSpacing: "-0.015em",
                      lineHeight: 1,
                    }}
                  >
                    agentcv
                  </Text>
                  <Text
                    style={{
                      margin: "4px 0 0",
                      fontFamily: FONT.MONO,
                      fontSize: 10,
                      color: BRAND.SAFFRON,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    Pracuś · AI · PL
                  </Text>
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Content card */}
          <Section
            style={{
              backgroundColor: BRAND.CREAM,
              borderRadius: 18,
              padding: "40px 32px",
              border: `1px solid ${BRAND.BORDER_SOFT}`,
            }}
          >
            {eyebrow ? (
              <Text
                style={{
                  margin: "0 0 20px",
                  fontFamily: FONT.MONO,
                  fontSize: 11,
                  color: BRAND.SAFFRON,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {eyebrow}
              </Text>
            ) : null}
            {children}
          </Section>

          {/* Signature */}
          <Section style={{ padding: "24px 4px 0" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: FONT.SERIF,
                fontStyle: "italic",
                fontSize: 15,
                color: BRAND.INK_SOFT,
                lineHeight: 1.4,
              }}
            >
              — Pracuś
            </Text>
            <Text
              style={{
                margin: "2px 0 0",
                fontFamily: FONT.MONO,
                fontSize: 10,
                color: BRAND.INK_MUTED,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              AI od polskiego rynku pracy
            </Text>
          </Section>

          <Hr
            style={{
              border: "none",
              borderTop: `1px solid ${BRAND.INK}18`,
              margin: "28px 0 18px",
            }}
          />

          {/* Footer */}
          <Section>
            <Row>
              <Column style={{ verticalAlign: "top" }}>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: FONT.BODY,
                    fontSize: 12.5,
                    color: BRAND.INK_MUTED,
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: BRAND.INK_SOFT }}>agentcv.pl</strong> — kreator CV z Pracusiem AI.
                </Text>
                <Text
                  style={{
                    margin: "6px 0 0",
                    fontFamily: FONT.BODY,
                    fontSize: 12,
                    color: BRAND.INK_MUTED,
                    lineHeight: 1.55,
                  }}
                >
                  Masz pytanie? Odpisz na tego maila —{" "}
                  <Link
                    href="mailto:hej@agentcv.pl"
                    style={{ color: BRAND.INK_SOFT, textDecoration: "underline" }}
                  >
                    hej@agentcv.pl
                  </Link>
                  .
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", textAlign: "right", width: 130 }}>
                <Link
                  href={`${BRAND.URL}/regulamin`}
                  style={{
                    fontFamily: FONT.MONO,
                    fontSize: 10,
                    color: BRAND.INK_MUTED,
                    textDecoration: "none",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Regulamin
                </Link>
                <Link
                  href={`${BRAND.URL}/polityka-prywatnosci`}
                  style={{
                    fontFamily: FONT.MONO,
                    fontSize: 10,
                    color: BRAND.INK_MUTED,
                    textDecoration: "none",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    display: "block",
                  }}
                >
                  Prywatność
                </Link>
              </Column>
            </Row>
            <Text
              style={{
                margin: "18px 0 0",
                fontFamily: FONT.MONO,
                fontSize: 9.5,
                color: BRAND.INK_MUTED,
                letterSpacing: "0.1em",
                lineHeight: 1.5,
              }}
            >
              Dostajesz ten e-mail, bo masz konto w agentcv. Wiadomość automatyczna.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * CTA button renderowany w table (max kompatybilność — Outlook).
 * Używaj jako <CtaButton href="..." label="..." />.
 */
export function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      style={{ margin: "0 auto" }}
    >
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: BRAND.INK,
              borderRadius: 999,
              padding: "14px 32px",
            }}
          >
            <Link
              href={href}
              style={{
                color: BRAND.CREAM,
                fontFamily: FONT.BODY,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "-0.005em",
                display: "inline-block",
                lineHeight: 1,
              }}
            >
              {label}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Styled list item (checkmark w saffron square) */
export function FeatureRow({ children }: { children: ReactNode }) {
  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      style={{ width: "100%", marginBottom: 10 }}
    >
      <tbody>
        <tr>
          <td style={{ width: 22, verticalAlign: "top", paddingTop: 4 }}>
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                borderRadius: 5,
                backgroundColor: BRAND.SAFFRON,
                color: BRAND.INK,
                textAlign: "center",
                lineHeight: "16px",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: FONT.BODY,
              }}
            >
              ✓
            </span>
          </td>
          <td style={{ verticalAlign: "top", paddingLeft: 10 }}>
            <Text
              style={{
                margin: 0,
                fontFamily: FONT.BODY,
                fontSize: 14.5,
                color: BRAND.INK_SOFT,
                lineHeight: 1.55,
              }}
            >
              {children}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
