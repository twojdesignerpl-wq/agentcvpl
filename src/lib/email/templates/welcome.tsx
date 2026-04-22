import { Heading, Link, Text } from "@react-email/components";
import { BRAND, ctaButtonStyle, EmailLayout } from "./_layout";

type Props = { name: string };

export function WelcomeEmail({ name }: Props) {
  return (
    <EmailLayout preview={`${name}, Pracuś gotowy do pracy nad Twoim CV`}>
      <Heading
        as="h1"
        style={{
          fontSize: 26,
          lineHeight: 1.2,
          margin: "0 0 16px",
          color: BRAND.INK,
          letterSpacing: "-0.02em",
          fontWeight: 700,
        }}
      >
        Cześć {name} — Pracuś gotowy do pracy
      </Heading>

      <Text style={{ fontSize: 15, lineHeight: 1.6, color: BRAND.INK_SOFT, margin: "0 0 12px" }}>
        Witaj w <strong>agentcv</strong>. Jestem Pracuś — 15 lat rekrutacji, polskie realia,
        zero korpo-żargonu. Pomogę Ci napisać CV, na które recruiter odpisze.
      </Text>

      <Text style={{ fontSize: 15, lineHeight: 1.6, color: BRAND.INK_SOFT, margin: "0 0 24px" }}>
        Co możesz zrobić teraz:
      </Text>

      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: BRAND.INK_SOFT,
          margin: "0 0 8px",
          paddingLeft: 16,
        }}
      >
        • Otwórz kreator i wybierz jeden z 5 szablonów pod ATS
        <br />• Wklej ogłoszenie o pracę — dopasuję CV do wymagań
        <br />• Pobierz PDF albo DOCX — wszystko zgodne z RODO
      </Text>

      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: BRAND.INK_MUTED,
          margin: "0 0 28px",
          padding: "12px 16px",
          backgroundColor: `${BRAND.SAFFRON}22`,
          borderRadius: 10,
          borderLeft: `3px solid ${BRAND.SAFFRON}`,
        }}
      >
        Pierwsze CV jest za darmo — bez karty, bez zobowiązań.
      </Text>

      <div style={{ textAlign: "center" as const, margin: "0 0 8px" }}>
        <Link href={`${BRAND.URL}/kreator`} style={ctaButtonStyle}>
          Otwórz kreator →
        </Link>
      </div>

      <Text
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: BRAND.INK_MUTED,
          margin: "24px 0 0",
          textAlign: "center" as const,
        }}
      >
        Gdy będziesz gotowy na więcej — plany Pro i Unlimited odblokują pełnego Pracusia.
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;
