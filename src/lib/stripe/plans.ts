import type { PricingPlan } from "@/lib/landing/content";

export type StripePlanId = Exclude<PricingPlan["id"], "free">;

export type CheckoutMode = "sub" | "pack";
export type StripeMode = "subscription" | "payment";

export type StripePlan = {
  id: StripePlanId;
  name: string;
  priceLabel: string;
  priceId: string | null;
  downloadLimit: number | "unlimited";
  description: string;
};

/**
 * Subscription plans (monthly recurring).
 * Price IDs w Stripe Dashboard → Products → Recurring monthly.
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

/**
 * Pro Pack — one-time purchase (19 PLN, 10 CV credits).
 * Price ID w Stripe Dashboard jako one-time (bez recurring).
 */
export const PRO_PACK = {
  id: "pro_pack" as const,
  name: "Pro Pack",
  priceLabel: "19 zł jednorazowo",
  priceId: process.env.STRIPE_PRICE_PRO_PACK ?? null,
  credits: 10,
  description: "10 pobrań CV + pełny Pracuś AI. Bez odnowień. Credits nie wygasają.",
};

export type CheckoutConfig = {
  priceId: string;
  stripeMode: StripeMode;
  plan: StripePlanId;
  kind: "subscription" | "pro_pack";
};

/**
 * Mapuje (plan, mode) z UI na Stripe config. Zwraca null jeśli Price ID brak
 * w env (dev bez Stripe) albo kombinacja niewspierana (np. unlimited + pack).
 */
export function getCheckoutConfig(
  plan: StripePlanId,
  mode: CheckoutMode,
): CheckoutConfig | null {
  if (plan === "pro" && mode === "pack") {
    if (!PRO_PACK.priceId) return null;
    return { priceId: PRO_PACK.priceId, stripeMode: "payment", plan: "pro", kind: "pro_pack" };
  }
  if (mode === "sub") {
    const sub = STRIPE_PLANS[plan];
    if (!sub.priceId) return null;
    return {
      priceId: sub.priceId,
      stripeMode: "subscription",
      plan,
      kind: "subscription",
    };
  }
  // (unlimited, pack) nieobsługiwane w V2
  return null;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getPublicStripeKey(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;
}
