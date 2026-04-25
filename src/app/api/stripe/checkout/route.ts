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

    // P0.5: zgoda na rozpoczęcie spełniania świadczenia przed upływem 14-dniowego
    // terminu odstąpienia (art. 38 pkt 13 u.p.k.). Stripe wyświetla checkbox z
    // tekstem custom_text + linkiem do Regulaminu (terms_of_service_url w Stripe
    // account settings). Bez akceptacji checkboxu — Pay button disabled.
    const consentCollection = {
      terms_of_service: "required" as const,
    };
    const customText = {
      terms_of_service_acceptance: {
        message:
          "Akceptuję Regulamin oraz wyrażam zgodę na rozpoczęcie spełniania świadczenia (dostarczenie treści cyfrowych — generowanie i pobieranie CV) przed upływem 14-dniowego terminu odstąpienia. Po pierwszym pobraniu CV traci się prawo odstąpienia od umowy zgodnie z art. 38 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta.",
      },
    };

    // P1.5: idempotency key chroni przed double-click — bucket 10s pozwala
    // legitymowanym retry'om po awarii sieci, ale podwójny POST w 1 sekundzie
    // zwraca tę samą sesję zamiast tworzyć dwie.
    const idempotencyKey = `checkout-${user.id}-${config.plan}-${config.kind}-${Math.floor(
      Date.now() / 10_000,
    )}`;

    const session =
      config.stripeMode === "subscription"
        ? await stripe.checkout.sessions.create(
            {
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
              consent_collection: consentCollection,
              custom_text: customText,
            },
            { idempotencyKey },
          )
        : await stripe.checkout.sessions.create(
            {
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
              consent_collection: consentCollection,
              custom_text: customText,
            },
            { idempotencyKey },
          );

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
