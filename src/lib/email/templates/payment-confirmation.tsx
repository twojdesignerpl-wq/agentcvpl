import { Column, Heading, Row, Section, Text } from "@react-email/components";
import { BRAND, CtaButton, EmailLayout, FeatureRow, FONT } from "./_layout";

type Props = {
  plan: "pro" | "unlimited";
  amount: string;
  invoiceUrl?: string;
};

const PLAN_LABEL = { pro: "Pro", unlimited: "Unlimited" } as const;
const PLAN_PERKS: Record<"pro" | "unlimited", Array<string>> = {
  pro: [
    "10 pobrań CV miesięcznie (PDF + DOCX)",
    "Pełny Pracuś AI — chat, propozycje, poprawa",
    "Dopasowanie CV do ogłoszenia + live ATS score",
    "Historia wersji — wracasz do dowolnego wariantu",
    "Priorytet generowania AI",
  ],
  unlimited: [
    "Bez limitu pobrań CV (PDF + DOCX)",
    "Priority Pracuś — szybsze odpowiedzi AI",
    "Wczesny dostęp do nowych funkcji",
    "Dedykowane wsparcie w czasie poniżej 12h",
    "Faktury VAT dla firm (NIP w checkout)",
  ],
};

export function PaymentConfirmationEmail({ plan, amount, invoiceUrl }: Props) {
  const label = PLAN_LABEL[plan];
  return (
    <EmailLayout
      preview={`Potwierdzenie — plan ${label} aktywny, ${amount} · agentcv.pl`}
      eyebrow="02 / Płatność potwierdzona"
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
        aktywny
      </Heading>

      <Text
        style={{
          margin: "0 0 24px",
          fontFamily: FONT.BODY,
          fontSize: 15,
          lineHeight: 1.6,
          color: BRAND.INK_SOFT,
        }}
      >
        Dziękujemy za zaufanie. Subskrypcja rozpoczęta — wszystkie funkcje są już odblokowane.
        Faktura VAT dotrze z Stripe osobno w ciągu kilku minut.
      </Text>

      {/* Receipt card */}
      <Section
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          padding: "24px 24px 20px",
          margin: "0 0 24px",
          border: `1px solid ${BRAND.BORDER}`,
        }}
      >
        <Text
          style={{
            margin: "0 0 14px",
            fontFamily: FONT.MONO,
            fontSize: 10.5,
            color: BRAND.INK_MUTED,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Szczegóły subskrypcji
        </Text>

        <Row style={{ marginBottom: 12 }}>
          <Column style={{ width: "50%", verticalAlign: "top" }}>
            <Text
              style={{
                margin: "0 0 3px",
                fontFamily: FONT.MONO,
                fontSize: 9.5,
                color: BRAND.INK_MUTED,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Plan
            </Text>
            <Text
              style={{
                margin: 0,
                fontFamily: FONT.DISPLAY,
                fontSize: 18,
                fontWeight: 700,
                color: BRAND.INK,
                letterSpacing: "-0.01em",
              }}
            >
              agentcv {label}
            </Text>
          </Column>
          <Column style={{ width: "50%", verticalAlign: "top", textAlign: "right" }}>
            <Text
              style={{
                margin: "0 0 3px",
                fontFamily: FONT.MONO,
                fontSize: 9.5,
                color: BRAND.INK_MUTED,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Kwota
            </Text>
            <Text
              style={{
                margin: 0,
                fontFamily: FONT.DISPLAY,
                fontSize: 18,
                fontWeight: 700,
                color: BRAND.INK,
                letterSpacing: "-0.01em",
              }}
            >
              {amount}
            </Text>
          </Column>
        </Row>

        <div
          style={{
            borderTop: `1px dashed ${BRAND.BORDER}`,
            marginTop: 16,
            paddingTop: 14,
          }}
        >
          <Text
            style={{
              margin: 0,
              fontFamily: FONT.BODY,
              fontSize: 12.5,
              color: BRAND.INK_MUTED,
              lineHeight: 1.55,
            }}
          >
            Rozliczenie miesięczne · odnawia się automatycznie · anulujesz jednym klikiem z
            poziomu{" "}
            <a
              href={`${BRAND.URL}/konto`}
              style={{ color: BRAND.INK_SOFT, textDecoration: "underline" }}
            >
              /konto
            </a>
            .
          </Text>
        </div>
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
        Co zyskujesz
      </Text>
      <div style={{ marginBottom: 26 }}>
        {PLAN_PERKS[plan].map((perk) => (
          <FeatureRow key={perk}>{perk}</FeatureRow>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "0 0 14px" }}>
        <CtaButton href={`${BRAND.URL}/kreator`} label="Otwórz kreator" />
      </div>

      {invoiceUrl ? (
        <Text
          style={{
            margin: 0,
            fontFamily: FONT.BODY,
            fontSize: 12.5,
            color: BRAND.INK_MUTED,
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          Potrzebujesz paragonu?{" "}
          <a
            href={invoiceUrl}
            style={{ color: BRAND.INK_SOFT, textDecoration: "underline" }}
          >
            Pobierz z Stripe
          </a>
          .
        </Text>
      ) : (
        <Text
          style={{
            margin: 0,
            fontFamily: FONT.BODY,
            fontSize: 12.5,
            color: BRAND.INK_MUTED,
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          Faktura VAT: wyślemy osobnym e-mailem z Stripe.
        </Text>
      )}
    </EmailLayout>
  );
}

export default PaymentConfirmationEmail;
