import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripeServer } from "@/lib/stripe/server";
import { STRIPE_PLANS, isStripeConfigured, type StripePlanId } from "@/lib/stripe/plans";
import { requireUser } from "@/lib/auth/guard";

export const runtime = "nodejs";
export const maxDuration = 10;

const bodySchema = z.object({
  plan: z.enum(["pro", "unlimited"]),
});

export async function POST(request: Request): Promise<Response> {
  const guard = await requireUser();
  if (!guard.ok) return guard.response;
  const { user } = guard;

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "Płatności nie są jeszcze skonfigurowane.",
        code: "stripe_not_configured",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nieprawidłowy plan", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const planId: StripePlanId = parsed.data.plan;
  const plan = STRIPE_PLANS[planId];
  if (!plan.priceId) {
    return NextResponse.json(
      {
        error: `Plan ${plan.name} nie jest jeszcze dostępny — brak STRIPE_PRICE_${planId.toUpperCase()}`,
        code: "price_id_missing",
      },
      { status: 503 },
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const stripe = getStripeServer();
    const existingCustomerId = (user.app_metadata as { stripe_customer_id?: string } | null)
      ?.stripe_customer_id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      customer: existingCustomerId,
      customer_email: existingCustomerId ? undefined : user.email ?? undefined,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        plan: plan.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: plan.id,
        },
      },
      locale: "pl",
      success_url: `${origin}/subskrypcja/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subskrypcja/anulowane`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      tax_id_collection: { enabled: true },
    });

    if (!session.url) {
      throw new Error("Checkout session nie ma url");
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[/api/stripe/checkout] Błąd:", err);
    return NextResponse.json(
      { error: "Nie udało się utworzyć płatności. Spróbuj ponownie za chwilę." },
      { status: 500 },
    );
  }
}
