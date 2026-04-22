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
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[stripe:webhook] Signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
          await updateUserPlan(userId, plan, customerId, "Stripe checkout.session.completed (subscription)");

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

            // Audit log
            await admin.from("plan_grants").insert({
              user_id: userId,
              email: userEmail,
              from_plan: null,
              to_plan: "pro_pack",
              reason: "Stripe payment (pro_pack)",
              source: "stripe",
              granted_by: null,
            });

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
          );
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await updateUserPlan(userId, "free", undefined, "Stripe subscription.deleted");
        }
        break;
      }
      default:
        // ignorujemy inne eventy
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe:webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}

async function updateUserPlan(
  userId: string,
  plan: string,
  stripeCustomerId?: string,
  reason?: string,
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

  // Audit log — nie psuj webhoku jeśli insert się buntuje
  if (fromPlan !== plan) {
    try {
      await admin.from("plan_grants").insert({
        user_id: userId,
        email,
        from_plan: fromPlan,
        to_plan: plan,
        reason: reason ?? "Stripe event",
        source: "stripe",
        granted_by: null,
      });
    } catch (err) {
      console.error("[stripe:webhook] plan_grants insert failed:", err);
    }
  }
}
