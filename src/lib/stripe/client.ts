"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { getPublicStripeKey } from "./plans";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Browser-side Stripe.js — tylko do `stripe.redirectToCheckout` po otrzymaniu
 * `sessionId` z `/api/stripe/checkout`. Używa publishable key (bezpieczny
 * do eksponowania).
 */
export function getStripeBrowser(): Promise<Stripe | null> {
  if (stripePromise) return stripePromise;
  const key = getPublicStripeKey();
  if (!key) {
    stripePromise = Promise.resolve(null);
    return stripePromise;
  }
  stripePromise = loadStripe(key);
  return stripePromise;
}
