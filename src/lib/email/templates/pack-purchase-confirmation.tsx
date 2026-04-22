import { Column, Heading, Row, Section, Text } from "@react-email/components";
import { BRAND, CtaButton, EmailLayout, FeatureRow, FONT } from "./_layout";

type Props = {
  amount: string;
};

export function PackPurchaseConfirmationEmail({ amount }: Props) {
  return (
    <EmailLayout
      preview={`Pro Pack aktywny · 10 pobrań CV, ${amount} · agentcv.pl`}
      eyebrow="02 / Zakup Pro Pack"
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
        Masz{" "}
        <span style={{ fontFamily: FONT.SERIF, fontStyle: "italic", color: BRAND.SAFFRON }}>
          10 pobrań
        </span>{" "}
        — bez pośpiechu
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
        Dziękujemy za zakup <strong>Pro Pack</strong>. Kredyty są już na Twoim koncie. Nie wygasają, nie odnawiają się automatycznie — wykorzystasz je kiedy będziesz potrzebować.
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
          Szczegóły zakupu
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
              Produkt
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
              agentcv Pro Pack
            </Text>
            <Text
              style={{
                margin: "2px 0 0",
                fontFamily: FONT.BODY,
                fontSize: 12,
                color: BRAND.INK_MUTED,
              }}
            >
              10 pobrań CV · pełny Pracuś AI
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
            <Text
              style={{
                margin: "2px 0 0",
                fontFamily: FONT.BODY,
                fontSize: 12,
                color: BRAND.INK_MUTED,
              }}
            >
              jednorazowo · bez odnowień
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
            Credits są widoczne w{" "}
            <a
              href={`${BRAND.URL}/konto`}
              style={{ color: BRAND.INK_SOFT, textDecoration: "underline" }}
            >
              /konto
            </a>
            . Faktura VAT dotrze z Stripe osobno.
          </Text>
        </div>
      </Section>

      {/* Co zyskujesz */}
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
        Co masz w Pro Pack
      </Text>
      <div style={{ marginBottom: 26 }}>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>10 pobrań CV</strong> — PDF lub DOCX, ATS-friendly
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Pełny Pracuś AI</strong> — chat, propozycje, poprawa tekstu
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Dopasowanie do ogłoszenia</strong> — live ATS score z 4 wymiarami
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Historia wersji</strong> — wracasz do dowolnego wariantu
        </FeatureRow>
        <FeatureRow>
          <strong style={{ color: BRAND.INK }}>Kredyty nie wygasają</strong> — wykorzystasz je kiedy chcesz
        </FeatureRow>
      </div>

      <div style={{ textAlign: "center", margin: "0 0 14px" }}>
        <CtaButton href={`${BRAND.URL}/kreator`} label="Otwórz kreator" />
      </div>

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
        Chcesz więcej?{" "}
        <a href={`${BRAND.URL}/subskrypcja`} style={{ color: BRAND.INK_SOFT, textDecoration: "underline" }}>
          Możesz dokupić kolejny Pack
        </a>{" "}
        albo przejść na plan miesięczny z auto-odnawianiem.
      </Text>
    </EmailLayout>
  );
}

export default PackPurchaseConfirmationEmail;
