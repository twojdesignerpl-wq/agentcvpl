import { Heading, Section, Text } from "@react-email/components";
import { BRAND, CtaButton, EmailLayout, FeatureRow, FONT } from "./_layout";

type Props = { name: string };

export function WelcomeEmail({ name }: Props) {
  return (
    <EmailLayout
      preview={`${name}, Pracuś gotowy do pracy nad Twoim CV · agentcv.pl`}
      eyebrow="01 / Witaj"
    >
      <Heading
        as="h1"
        style={{
          margin: "0 0 14px",
          fontFamily: FONT.SERIF,
          fontWeight: 700,
          fontSize: 32,
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          color: BRAND.INK,
        }}
      >
        Cześć{" "}
        <span
          style={{
            fontFamily: FONT.SERIF,
            fontStyle: "italic",
            color: BRAND.SAFFRON,
            fontWeight: 700,
          }}
        >
          {name}
        </span>
        , tu Pracuś
      </Heading>

      <Text
        style={{
          margin: "0 0 18px",
          fontFamily: FONT.BODY,
          fontSize: 15.5,
          lineHeight: 1.65,
          color: BRAND.INK_SOFT,
        }}
      >
        15 lat rekrutacji w polskich realiach. Czytam ogłoszenia, znam ATS,
        nie lubię korpo-żargonu. Pomogę Ci napisać CV, na które recruiter
        faktycznie odpowie — konkretnie, bez ściemy.
      </Text>

      <Section
        style={{
          backgroundColor: BRAND.CREAM_SOFT,
          borderRadius: 12,
          padding: "20px 22px",
          margin: "0 0 24px",
          border: `1px solid ${BRAND.BORDER_SOFT}`,
        }}
      >
        <Text
          style={{
            margin: "0 0 14px",
            fontFamily: FONT.MONO,
            fontSize: 10.5,
            color: BRAND.INK_MUTED,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Pierwsze trzy kroki
        </Text>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Wybierz szablon</strong> — 5 układów pod
          ATS, każdy sprawdzony przez prawdziwe systemy rekrutacyjne.
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Wklej ogłoszenie</strong> — dopasuję słowa
          klucze i pokażę live ATS score z 4 wymiarami.
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Pobierz PDF lub DOCX</strong> — formaty
          zgodne z RODO, wysyłasz od razu do rekrutera.
        </FeatureRow>
      </Section>

      <div style={{ textAlign: "center", margin: "0 0 20px" }}>
        <CtaButton href={`${BRAND.URL}/kreator`} label="Otwórz kreator" />
      </div>

      <Text
        style={{
          margin: 0,
          fontFamily: FONT.BODY,
          fontSize: 13,
          lineHeight: 1.6,
          color: BRAND.INK_MUTED,
          textAlign: "center",
        }}
      >
        Pierwsze CV — za darmo. Bez karty, bez zobowiązań.
      </Text>

      <Text
        style={{
          margin: "20px 0 0",
          padding: "14px 18px",
          fontFamily: FONT.SERIF,
          fontStyle: "italic",
          fontSize: 14,
          lineHeight: 1.55,
          color: BRAND.INK_SOFT,
          borderLeft: `3px solid ${BRAND.JADE}`,
          backgroundColor: `${BRAND.JADE_SOFT}22`,
          borderRadius: "0 10px 10px 0",
        }}
      >
        Jak utkniesz — pisz do mnie w czacie w kreatorze.
        Jestem po polsku, konkretnie i bez ściemy.
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;
