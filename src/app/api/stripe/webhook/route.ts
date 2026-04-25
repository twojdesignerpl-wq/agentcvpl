import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendPackPurchaseConfirmation, sendPaymentConfirmation } from "@/lib/email/send";
import { PRO_PACK } from "@/lib/stripe/plans";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Stripe webhook handler. Weryfikuje signature, aktualizuje plan usera.
 *
 * W Stripe Dashboard → Webhooks:
 * — URL: `https://agentcv.pl/api/stripe/webhook`
 * — Events: `checkout.session.completed`, `customer.subscription.updated`,
 *   `customer.subscription.deleted`
 * — Skopiuj signing secret → env `STRIPE_WEBHOOK_SECRET`.
 */
export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    // Diagnostyczne body — widoczne w Stripe Dashboard → Webhooks → Logs.
    const reason = !signature && !secret
      ? "no_signature_no_secret"
      : !signature
        ? "no_signature_header"
        : "secret_missing_in_env";
    console.error("[stripe:webhook] auth precheck fail:", reason);
    return NextResponse.json(
      { error: "Missing signature or secret", reason },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = (err as Error).message;
    console.error("[stripe:webhook] Signature verification failed:", message);
    return NextResponse.json(
      {
        error: "Invalid signature",
        reason: "signature_verification_failed",
        detail: message,
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const kind = session.metadata?.kind; // "subscription" | "pro_pack"
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (!userId || !plan) break;

        // Pobierz email usera raz (użyty dla subscription i pack)
        const admin = createSupabaseServiceClient();
        const { data: userData } = await admin.auth.admin.getUserById(userId);
        const userEmail = userData.user?.email ?? "";

        const amountMinor = session.amount_total ?? 0;
        const currency = (session.currency ?? "pln").toUpperCase();
        const amount = `${(amountMinor / 100).toFixed(2)} ${currency}`;

        if (session.mode === "subscription") {
          // Subscription flow: aktualizuj plan + audit + email
          await updateUserPlan(
            userId,
            plan,
            customerId,
            "Stripe checkout.session.completed (subscription)",
            event.id,
          );

          if (plan === "pro" || plan === "unlimited") {
            if (userEmail) {
              void sendPaymentConfirmation({ id: userId, email: userEmail }, plan, amount).catch(
                (err) => console.error("[stripe:webhook] sub email failed:", err),
              );
            }
          }
        } else if (session.mode === "payment" && kind === "pro_pack") {
          // Pro Pack flow: insert credits (idempotentnie przez stripe_session_id UNIQUE)
          try {
            const { error: insertErr } = await admin.from("plan_credits").insert({
              user_id: userId,
              kind: "pro_pack",
              credits_remaining: PRO_PACK.credits,
              credits_granted: PRO_PACK.credits,
              stripe_session_id: session.id,
              stripe_customer_id: customerId ?? null,
            });

            if (insertErr) {
              // UNIQUE violation = webhook retry, nic nie rób
              if (insertErr.code === "23505") {
                console.log("[stripe:webhook] pro_pack already granted for session", session.id);
                break;
              }
              throw insertErr;
            }

            // Audit log — idempotentne przez webhook_event_id UNIQUE INDEX
            const { error: grantErr } = await admin.from("plan_grants").insert({
              user_id: userId,
              email: userEmail,
              from_plan: null,
              to_plan: "pro_pack",
              reason: "Stripe payment (pro_pack)",
              source: "stripe",
              granted_by: null,
              webhook_event_id: event.id,
            });
            if (grantErr && grantErr.code !== "23505") {
              console.error("[stripe:webhook] plan_grants insert failed:", grantErr);
            }

            // Email — fire-and-forget
            if (userEmail) {
              void sendPackPurchaseConfirmation(
                { id: userId, email: userEmail },
                amount,
              ).catch((err) => console.error("[stripe:webhook] pack email failed:", err));
            }
          } catch (err) {
            console.error("[stripe:webhook] pro_pack insert failed:", err);
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        const plan = sub.metadata?.plan;
        const status = sub.status;
        const effective = status === "active" || status === "trialing" ? plan : "free";
        if (userId && effective) {
          await updateUserPlan(
            userId,
            effective,
            undefined,
            `Stripe subscription.updated (status=${status})`,
            event.id,
          );
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await updateUserPlan(
            userId,
            "free",
            undefined,
            "Stripe subscription.deleted",
            event.id,
          );
        }
        break;
      }
      default:
        // ignorujemy inne eventy
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Stripe retry'uje przy 5xx aż do wygaśnięcia eventu (>72h). Dla bł. aplikacyjnych
    // (insert fail, RLS, validation) retry nie pomoże — zwracamy 200 + log.
    // Dla transient (network/DB) zwracamy 500, żeby Stripe spróbowała ponownie.
    console.error("[stripe:webhook] Handler error:", err);
    if (isRetriable(err)) {
      return NextResponse.json(
        { error: "Transient error", retry: true },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        received: true,
        handler_error: true,
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 200 },
    );
  }
}

function isRetriable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("eai_again") ||
    msg.includes("timeout") ||
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("socket hang up")
  );
}

async function updateUserPlan(
  userId: string,
  plan: string,
  stripeCustomerId?: string,
  reason?: string,
  eventId?: string,
): Promise<void> {
  const admin = createSupabaseServiceClient();

  // Fetch current plan (dla from_plan audit)
  const { data: before } = await admin.auth.admin.getUserById(userId);
  const fromPlan = (before.user?.app_metadata as { plan?: string } | null)?.plan ?? null;
  const email = before.user?.email ?? "";

  const existingMeta = (before.user?.app_metadata ?? {}) as Record<string, unknown>;
  const appMetadata: Record<string, unknown> = { ...existingMeta, plan };
  if (stripeCustomerId) appMetadata.stripe_customer_id = stripeCustomerId;

  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: appMetadata,
  });
  if (error) throw error;

  // Audit log — idempotent przez webhook_event_id UNIQUE INDEX (kod 23505 = retry, no-op)
  if (fromPlan !== plan) {
    const { error: grantErr } = await admin.from("plan_grants").insert({
      user_id: userId,
      email,
      from_plan: fromPlan,
      to_plan: plan,
      reason: reason ?? "Stripe event",
      source: "stripe",
      granted_by: null,
      webhook_event_id: eventId ?? null,
    });
    if (grantErr && grantErr.code !== "23505") {
      console.error("[stripe:webhook] plan_grants insert failed:", grantErr);
    }
  }
}
