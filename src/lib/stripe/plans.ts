import type { PricingPlan } from "@/lib/landing/content";

export type StripePlanId = Exclude<PricingPlan["id"], "free">;

export type StripePlan = {
  id: StripePlanId;
  name: string;
  priceLabel: string;
  priceId: string | null;
  downloadLimit: number | "unlimited";
  description: string;
};

/**
 * Mapowanie planów → Stripe Price IDs. `priceId` = null jeśli env var brak
 * (dev/CI). Checkout endpoint zwróci wtedy 503 z polskim komunikatem.
 *
 * Price IDs utwórz w Stripe Dashboard → Products → Add product → Recurring monthly.
 * Zapisz ID (`price_xxx`) w Vercel env vars — `STRIPE_PRICE_PRO` i `STRIPE_PRICE_UNLIMITED`.
 */
export const STRIPE_PLANS: Record<StripePlanId, StripePlan> = {
  pro: {
    id: "pro",
    name: "Pro",
    priceLabel: "19 zł / mies.",
    priceId: process.env.STRIPE_PRICE_PRO ?? null,
    downloadLimit: 10,
    description: "10 pobrań CV, pełny Pracuś AI, dopasowanie do ogłoszenia, live ATS score.",
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    priceLabel: "39 zł / mies.",
    priceId: process.env.STRIPE_PRICE_UNLIMITED ?? null,
    downloadLimit: "unlimited",
    description: "Bez limitu pobrań, priority AI, wczesny dostęp, dedykowane wsparcie.",
  },
};

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getPublicStripeKey(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;
}
