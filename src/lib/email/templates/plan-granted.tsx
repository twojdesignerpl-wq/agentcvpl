import { Heading, Section, Text } from "@react-email/components";
import { BRAND, CtaButton, EmailLayout, FeatureRow, FONT } from "./_layout";

type Props = {
  plan: "free" | "pro" | "unlimited";
  reason: string;
};

const LABEL = { free: "Free", pro: "Pro", unlimited: "Unlimited" } as const;
const PERKS: Record<Props["plan"], Array<string>> = {
  free: [
    "1 pobranie CV miesięcznie (PDF lub DOCX)",
    "5 szablonów pod ATS",
    "Edytor z autosave",
    "Pełna zgodność z RODO",
  ],
  pro: [
    "10 pobrań CV miesięcznie (PDF + DOCX)",
    "Pełny Pracuś AI — chat, propozycje, live ATS",
    "Dopasowanie do ogłoszenia pracy",
    "Historia wersji CV",
  ],
  unlimited: [
    "Bez limitu pobrań (PDF + DOCX)",
    "Priority AI — szybsze odpowiedzi",
    "Wczesny dostęp do beta",
    "Dedykowane wsparcie poniżej 12h",
    "Faktury VAT dla firm",
  ],
};

export function PlanGrantedEmail({ plan, reason }: Props) {
  const label = LABEL[plan];
  return (
    <EmailLayout
      preview={`Plan ${label} aktywowany na Twoim koncie · agentcv.pl`}
      eyebrow="03 / Zmiana planu"
    >
      <Heading
        as="h1"
        style={{
          margin: "0 0 12px",
          fontFamily: FONT.SERIF,
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          color: BRAND.INK,
        }}
      >
        Plan{" "}
        <span
          style={{
            fontFamily: FONT.SERIF,
            fontStyle: "italic",
            color: BRAND.SAFFRON,
          }}
        >
          {label}
        </span>{" "}
        aktywowany
      </Heading>

      <Text
        style={{
          margin: "0 0 20px",
          fontFamily: FONT.BODY,
          fontSize: 15,
          lineHeight: 1.6,
          color: BRAND.INK_SOFT,
        }}
      >
        Zmiana planu na Twoim koncie{" "}
        <strong style={{ color: BRAND.INK }}>działa od razu</strong>. Wszystko, co obejmuje
        plan {label}, jest już dostępne w kreatorze.
      </Text>

      {/* Reason card */}
      <Section
        style={{
          backgroundColor: `${BRAND.SAFFRON_SOFT}33`,
          borderLeft: `4px solid ${BRAND.SAFFRON}`,
          borderRadius: "0 12px 12px 0",
          padding: "16px 20px",
          margin: "0 0 26px",
        }}
      >
        <Text
          style={{
            margin: "0 0 6px",
            fontFamily: FONT.MONO,
            fontSize: 10,
            color: BRAND.INK_MUTED,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Powód zmiany
        </Text>
        <Text
          style={{
            margin: 0,
            fontFamily: FONT.BODY,
            fontSize: 14.5,
            color: BRAND.INK,
            lineHeight: 1.55,
          }}
        >
          {reason}
        </Text>
      </Section>

      {/* Perks */}
      <Text
        style={{
          margin: "0 0 12px",
          fontFamily: FONT.MONO,
          fontSize: 10.5,
          color: BRAND.INK_MUTED,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        Co masz w planie {label}
      </Text>
      <div style={{ marginBottom: 26 }}>
        {PERKS[plan].map((perk) => (
          <FeatureRow key={perk}>{perk}</FeatureRow>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "0 0 18px" }}>
        <CtaButton
          href={`${BRAND.URL}/${plan === "free" ? "kreator" : "konto"}`}
          label={plan === "free" ? "Otwórz kreator" : "Otwórz konto"}
        />
      </div>

      <Text
        style={{
          margin: 0,
          fontFamily: FONT.BODY,
          fontSize: 13,
          lineHeight: 1.55,
          color: BRAND.INK_MUTED,
          textAlign: "center",
        }}
      >
        Pytanie o plan? Odpisz na tego maila — odpowiemy osobiście.
      </Text>
    </EmailLayout>
  );
}

export default PlanGrantedEmail;
