import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getStripeServer } from "@/lib/stripe/server";
import { getCheckoutConfig, isStripeConfigured, type CheckoutMode, type StripePlanId } from "@/lib/stripe/plans";
import { getEffectivePlan } from "@/lib/plans/quotas";

export const runtime = "nodejs";
export const maxDuration = 10;
export const dynamic = "force-dynamic";

const querySchema = z.object({
  plan: z.enum(["pro", "unlimited"]),
  mode: z.enum(["sub", "pack"]).default("sub"),
});

/**
 * Bezpośredni Stripe Checkout redirect z landing CTAs.
 *
 * Flow:
 *   1. Walidacja query params.
 *   2. Auth check — niezalogowany → redirect na /zaloguj?next=...
 *   3. Pre-check current plan — user z aktywnym tier ≥ target → /konto?msg=...
 *   4. Stripe session create (subscription lub payment).
 *   5. 302 redirect do session.url.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams, origin } = request.nextUrl;

  const parsed = querySchema.safeParse({
    plan: searchParams.get("plan"),
    mode: searchParams.get("mode") ?? "sub",
  });
  if (!parsed.success) {
    return NextResponse.redirect(`${origin}/#cennik?error=invalid_plan`);
  }

  const { plan, mode } = parsed.data;

  // Unlimited + pack = nieobsługiwane w V2
  if (plan === "unlimited" && mode === "pack") {
    return NextResponse.redirect(`${origin}/#cennik?error=pack_unsupported`);
  }

  // Auth check
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/zaloguj?error=auth_not_configured`);
  }
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    const nextPath = `/checkout?plan=${plan}&mode=${mode}`;
    return NextResponse.redirect(
      `${origin}/zaloguj?next=${encodeURIComponent(nextPath)}`,
    );
  }
  const user = authData.user;

  // Pre-check: nie pozwól podwójnej płatności / niepotrzebnej zmiany
  const effective = await getEffectivePlan(user);
  if (plan === "pro" && effective.tier === "pro" && effective.source === "subscription" && mode === "pack") {
    return NextResponse.redirect(`${origin}/konto?msg=already_pro_sub`);
  }
  if (plan === "pro" && effective.tier === "unlimited") {
    return NextResponse.redirect(`${origin}/konto?msg=already_unlimited`);
  }
  if (plan === "unlimited" && effective.tier === "unlimited" && effective.source === "subscription") {
    return NextResponse.redirect(`${origin}/konto?msg=already_unlimited`);
  }

  // Stripe config
  if (!isStripeConfigured()) {
    return NextResponse.redirect(`${origin}/subskrypcja?error=stripe_not_configured`);
  }

  const config = getCheckoutConfig(plan as StripePlanId, mode as CheckoutMode);
  if (!config) {
    return NextResponse.redirect(`${origin}/subskrypcja?error=price_missing`);
  }

  try {
    const stripe = getStripeServer();
    const existingCustomerId = (user.app_metadata as { stripe_customer_id?: string } | null)
      ?.stripe_customer_id;

    const successUrl =
      config.kind === "pro_pack"
        ? `${origin}/subskrypcja/sukces?session_id={CHECKOUT_SESSION_ID}&kind=pack`
        : `${origin}/subskrypcja/sukces?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/subskrypcja/anulowane`;

    const metadata = {
      user_id: user.id,
      plan: config.plan,
      kind: config.kind,
    };

    const session =
      config.stripeMode === "subscription"
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: config.priceId, quantity: 1 }],
            customer: existingCustomerId,
            customer_email: existingCustomerId ? undefined : user.email ?? undefined,
            client_reference_id: user.id,
            metadata,
            subscription_data: { metadata },
            locale: "pl",
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: "auto",
            tax_id_collection: { enabled: true },
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [{ price: config.priceId, quantity: 1 }],
            customer: existingCustomerId,
            customer_email: existingCustomerId ? undefined : user.email ?? undefined,
            client_reference_id: user.id,
            metadata,
            payment_intent_data: { metadata },
            locale: "pl",
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: "auto",
            tax_id_collection: { enabled: true },
          });

    if (!session.url) {
      return NextResponse.redirect(`${origin}/subskrypcja?error=no_url`);
    }
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err) {
    console.error("[/checkout] Stripe error:", err);
    return NextResponse.redirect(`${origin}/subskrypcja?error=stripe_failed`);
  }
}
