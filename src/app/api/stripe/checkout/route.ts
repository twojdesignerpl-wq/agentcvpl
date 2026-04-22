import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripeServer } from "@/lib/stripe/server";
import {
  getCheckoutConfig,
  isStripeConfigured,
  type CheckoutMode,
  type StripePlanId,
} from "@/lib/stripe/plans";
import { requireUser } from "@/lib/auth/guard";

export const runtime = "nodejs";
export const maxDuration = 10;

const bodySchema = z.object({
  plan: z.enum(["pro", "unlimited"]),
  mode: z.enum(["sub", "pack"]).default("sub"),
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
  const mode: CheckoutMode = parsed.data.mode;

  if (planId === "unlimited" && mode === "pack") {
    return NextResponse.json(
      { error: "Unlimited nie jest dostępny jako pack w V2", code: "pack_unsupported" },
      { status: 400 },
    );
  }

  const config = getCheckoutConfig(planId, mode);
  if (!config) {
    return NextResponse.json(
      {
        error: `Plan nie jest jeszcze dostępny — brak Price ID`,
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
            success_url: `${origin}/subskrypcja/sukces?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subskrypcja/anulowane`,
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
            success_url: `${origin}/subskrypcja/sukces?session_id={CHECKOUT_SESSION_ID}&kind=pack`,
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
