import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Server-only Stripe client. Używaj wyłącznie w API routes + Server Actions.
 * NIGDY nie importuj w Client Component — używa secret key.
 */
export function getStripeServer(): Stripe {
  if (cached) return cached;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "STRIPE_SECRET_KEY nie jest skonfigurowany — ustaw w Vercel env (test: sk_test_... prod: sk_live_...)",
    );
  }
  cached = new Stripe(secret, {
    // Stripe SDK domyślnie dobiera najnowsze API version z package.json.
    typescript: true,
    appInfo: { name: "agentcv.pl", version: "1.0.0" },
  });
  return cached;
}
