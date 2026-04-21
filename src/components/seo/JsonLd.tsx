import Script from "next/script";
import { BRAND } from "@/lib/landing/brand";
import { faqItems, pricingPlans, processSteps } from "@/lib/landing/content";

type Schema = Record<string, unknown>;

function parsePricePLN(raw: string): string {
  // "19 zł" → "19"; "0 zł" → "0"; handle non-breaking space too
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length > 0 ? digits : "0";
}

export function JsonLd() {
  const data: Schema[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.url,
      logo: `${BRAND.url}/brand/agentcv-logo.svg`,
      sameAs: [BRAND.social.x, BRAND.social.linkedin, BRAND.social.github],
      description: BRAND.description,
      privacyPolicy: `${BRAND.url}/polityka-prywatnosci`,
      termsOfService: `${BRAND.url}/regulamin`,
      contactPoint: {
        "@type": "ContactPoint",
        email: BRAND.email,
        contactType: "customer support",
        availableLanguage: ["Polish"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND.name,
      url: BRAND.url,
      inLanguage: "pl-PL",
      potentialAction: {
        "@type": "SearchAction",
        target: `${BRAND.url}/kreator?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${BRAND.name} — ${BRAND.tagline}`,
      operatingSystem: "Web",
      applicationCategory: "BusinessApplication",
      inLanguage: "pl-PL",
      offers: pricingPlans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: parsePricePLN(plan.price),
        priceCurrency: "PLN",
        category: plan.cadence,
        description: plan.tagline,
        url: `${BRAND.url}${plan.ctaHref}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Jak stworzyć CV z agentem Pracuś",
      description:
        "Trzy kroki do gotowego, ATS-friendly CV po polsku — od formularza po pobranie PDF.",
      totalTime: "PT5M",
      inLanguage: "pl-PL",
      step: processSteps.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.title,
        text: s.body,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Start",
          item: BRAND.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kreator CV",
          item: `${BRAND.url}/kreator`,
        },
      ],
    },
  ];

  return (
    <Script id="agentcv-ld" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
