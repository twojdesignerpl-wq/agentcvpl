import { Heading, Link, Text } from "@react-email/components";
import { BRAND, ctaButtonStyle, EmailLayout } from "./_layout";

type Props = {
  plan: "pro" | "unlimited";
  amount: string;
};

const PLAN_LABEL = { pro: "Pro", unlimited: "Unlimited" } as const;
const PLAN_PERK: Record<"pro" | "unlimited", string> = {
  pro: "10 pobrań CV miesięcznie, pełny Pracuś AI, dopasowanie do ogłoszeń, live ATS score.",
  unlimited: "bez limitu pobrań, priority AI, wczesny dostęp do nowości, faktury VAT.",
};

export function PaymentConfirmationEmail({ plan, amount }: Props) {
  const label = PLAN_LABEL[plan];
  return (
    <EmailLayout preview={`Plan ${label} aktywny. Kwota: ${amount}`}>
      <Heading
        as="h1"
        style={{
          fontSize: 26,
          lineHeight: 1.2,
          margin: "0 0 8px",
          color: BRAND.INK,
          letterSpacing: "-0.02em",
          fontWeight: 700,
        }}
      >
        Plan {label} aktywny
      </Heading>

      <Text style={{ fontSize: 15, lineHeight: 1.6, color: BRAND.INK_SOFT, margin: "0 0 24px" }}>
        Dziękujemy za zaufanie. Subskrypcja rozpoczęta, faktura dotrze z Stripe osobno.
      </Text>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BRAND.INK}14`,
          borderRadius: 12,
          margin: "0 0 24px",
        }}
      >
        <Text style={{ fontSize: 12, color: BRAND.INK_MUTED, margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
          Plan
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 700, color: BRAND.INK, margin: "0 0 12px" }}>
          agentcv {label}
        </Text>
        <Text style={{ fontSize: 12, color: BRAND.INK_MUTED, margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
          Kwota
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 700, color: BRAND.INK, margin: 0 }}>
          {amount}
        </Text>
      </div>

      <Text style={{ fontSize: 14, lineHeight: 1.6, color: BRAND.INK_SOFT, margin: "0 0 24px" }}>
        Co zyskujesz: {PLAN_PERK[plan]}
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
        Anulujesz jednym klikiem z poziomu{" "}
        <Link href={`${BRAND.URL}/konto`} style={{ color: BRAND.INK_SOFT }}>
          /konto
        </Link>{" "}
        → Zarządzaj subskrypcją.
      </Text>
    </EmailLayout>
  );
}

export default PaymentConfirmationEmail;
