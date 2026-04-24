import type { StripePlanId, CheckoutMode } from "@/lib/stripe/plans";

export type PlanOfferKey = "pack" | "pro" | "unlimited";

export type PlanOffer = {
  key: PlanOfferKey;
  label: string;
  price: string;
  cadence: string;
  /** Krótki mono-label badge w górnym prawym rogu karty. */
  badge: string;
  tagline: string;
  features: string[];
  ctaPlan: StripePlanId;
  ctaMode: CheckoutMode;
  ctaLabel: string;
  /** Jedna karta na zestawie ma highlight (Pack = najszybszy zakup). */
  highlight: boolean;
};

/**
 * Single source of truth dla 3 ofert (Pro Pack / Pro / Unlimited).
 * Używane w:
 *  - src/components/kreator/kreator-blocked-screen.tsx (blok-screen po Free limit)
 *  - src/app/subskrypcja/page.tsx (dedykowana strona)
 *  - src/components/kreator/mobile/tab-ai.tsx (paywall Pracuś AI dla Free)
 *
 * Zmiany cen / limitów — tylko tutaj + src/lib/stripe/plans.ts + content.ts.
 */
export const PLAN_OFFERS: Record<PlanOfferKey, PlanOffer> = {
  pack: {
    key: "pack",
    label: "Pro Pack",
    price: "19 zł",
    cadence: "jednorazowo",
    badge: "Najszybciej",
    tagline: "Kupujesz raz, używasz kiedy chcesz. Kredyty nie wygasają.",
    features: [
      "10 pobrań PDF / DOCX",
      "Pełny Pracuś AI (chat + inline)",
      "Dopasowanie CV do ogłoszenia",
      "Bez odnowień i subskrypcji",
    ],
    ctaPlan: "pro",
    ctaMode: "pack",
    ctaLabel: "Kup Pro Pack",
    highlight: true,
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: "19 zł",
    cadence: "miesięcznie",
    badge: "Dla szukających",
    tagline: "Odnawia się co miesiąc. 10 pobrań, pełny AI, dopasowanie ATS.",
    features: [
      "10 pobrań co miesiąc",
      "Pełny Pracuś AI + live ATS score",
      "Dopasowanie CV do ogłoszenia",
      "Anulujesz kiedy chcesz",
    ],
    ctaPlan: "pro",
    ctaMode: "sub",
    ctaLabel: "Przejdź na Pro",
    highlight: false,
  },
  unlimited: {
    key: "unlimited",
    label: "Unlimited",
    price: "39 zł",
    cadence: "miesięcznie",
    badge: "Bez limitu",
    tagline: "Nieograniczone pobrania, priority AI, wsparcie premium.",
    features: [
      "Pobrania bez limitu",
      "Priority Pracuś AI",
      "Wczesny dostęp do nowości",
      "Dedykowane wsparcie",
    ],
    ctaPlan: "unlimited",
    ctaMode: "sub",
    ctaLabel: "Przejdź na Unlimited",
    highlight: false,
  },
};

export const PLAN_OFFERS_ORDER: PlanOfferKey[] = ["pack", "pro", "unlimited"];

export function getPlanOffers(order: PlanOfferKey[] = PLAN_OFFERS_ORDER): PlanOffer[] {
  return order.map((k) => PLAN_OFFERS[k]);
}
