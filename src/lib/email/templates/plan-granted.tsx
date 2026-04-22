import { Heading, Link, Text } from "@react-email/components";
import { BRAND, ctaButtonStyle, EmailLayout } from "./_layout";

type Props = {
  plan: "free" | "pro" | "unlimited";
  reason: string;
};

const LABEL = { free: "Free", pro: "Pro", unlimited: "Unlimited" } as const;

export function PlanGrantedEmail({ plan, reason }: Props) {
  return (
    <EmailLayout preview={`Plan ${LABEL[plan]} nadany na Twoim koncie`}>
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
        Plan {LABEL[plan]} aktywowany
      </Heading>

      <Text style={{ fontSize: 15, lineHeight: 1.6, color: BRAND.INK_SOFT, margin: "0 0 16px" }}>
        Zmieniliśmy Twój plan na <strong>agentcv {LABEL[plan]}</strong>. Zmiana działa od razu.
      </Text>

      <div
        style={{
          padding: "14px 16px",
          backgroundColor: `${BRAND.SAFFRON}14`,
          borderLeft: `3px solid ${BRAND.SAFFRON}`,
          borderRadius: 10,
          margin: "0 0 24px",
        }}
      >
        <Text style={{ fontSize: 12, color: BRAND.INK_MUTED, margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
          Powód
        </Text>
        <Text style={{ fontSize: 14, color: BRAND.INK, margin: 0, lineHeight: 1.5 }}>
          {reason}
        </Text>
      </div>

      <div style={{ textAlign: "center" as const, margin: "0 0 8px" }}>
        <Link href={`${BRAND.URL}/konto`} style={ctaButtonStyle}>
          Otwórz konto →
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
        Masz pytania? Odpisz na ten email — odpowiemy osobiście.
      </Text>
    </EmailLayout>
  );
}

export default PlanGrantedEmail;
