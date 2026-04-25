import { render } from "@react-email/components";
import { EMAIL_FROM, EMAIL_REPLY_TO, getResendClient, isResendConfigured } from "./resend";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { WelcomeEmail } from "./templates/welcome";
import { PaymentConfirmationEmail } from "./templates/payment-confirmation";
import { PlanGrantedEmail } from "./templates/plan-granted";
import { PackPurchaseConfirmationEmail } from "./templates/pack-purchase-confirmation";

type DispatchResult =
  | { ok: true; id: string | null; skipped?: boolean }
  | { ok: false; error: string };

/**
 * P1.7: atomic claim slotu na wysyłkę. Próbuje INSERT z partial UNIQUE
 * (kind='welcome' wymaga UNIQUE na user_id). Zwraca:
 *   - id wpisu jeśli claim się udał (dispatcher może wysłać mail)
 *   - null jeśli już istnieje (no-op, mail wcześniej wysłany)
 *
 * Po wysyłce — zaktualizuj resend_email_id przez `markDispatchSent`.
 * Jeśli wysyłka padnie — wywołaj `rollbackDispatch(id)` żeby usunąć slot
 * i pozwolić następnej próbie.
 */
async function claimDispatch(
  userId: string,
  kind: "welcome" | "payment" | "plan_granted" | "pack_purchase",
): Promise<string | null> {
  try {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin
      .from("email_dispatches")
      .insert({ user_id: userId, kind, resend_email_id: null })
      .select("id")
      .single();

    if (error) {
      // 23505 = duplicate key (welcome już wysłany dla tego usera)
      if (error.code === "23505") return null;
      console.error("[email:claimDispatch]", error);
      return null;
    }
    return (data?.id as string | undefined) ?? null;
  } catch (err) {
    console.error("[email:claimDispatch]", err);
    return null;
  }
}

async function markDispatchSent(dispatchId: string, resendId: string | null) {
  try {
    const admin = createSupabaseServiceClient();
    await admin
      .from("email_dispatches")
      .update({ resend_email_id: resendId })
      .eq("id", dispatchId);
  } catch (err) {
    console.error("[email:markDispatchSent]", err);
  }
}

async function rollbackDispatch(dispatchId: string) {
  try {
    const admin = createSupabaseServiceClient();
    await admin.from("email_dispatches").delete().eq("id", dispatchId);
  } catch (err) {
    console.error("[email:rollbackDispatch]", err);
  }
}

async function recordDispatch(
  userId: string,
  kind: "welcome" | "payment" | "plan_granted" | "pack_purchase",
  resendId: string | null,
) {
  try {
    const admin = createSupabaseServiceClient();
    await admin
      .from("email_dispatches")
      .insert({ user_id: userId, kind, resend_email_id: resendId });
  } catch (err) {
    console.error("[email:recordDispatch]", err);
  }
}

export async function sendWelcome(user: {
  id: string;
  email: string;
  name?: string;
}): Promise<DispatchResult> {
  if (!isResendConfigured()) return { ok: false, error: "resend_not_configured" };

  // P1.7: atomic claim — UNIQUE INDEX na (user_id WHERE kind='welcome')
  // gwarantuje że tylko jeden równoległy caller dostanie dispatchId.
  const dispatchId = await claimDispatch(user.id, "welcome");
  if (!dispatchId) return { ok: true, id: null, skipped: true };

  try {
    const resend = getResendClient();
    const html = await render(WelcomeEmail({ name: user.name ?? user.email.split("@")[0] }));
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      replyTo: EMAIL_REPLY_TO,
      subject: "Witaj w agentcv — Pracuś gotowy do pracy",
      html,
    });
    if (error || !data) {
      // Wysyłka padła — rollback slotu, żeby kolejna próba mogła go zająć.
      await rollbackDispatch(dispatchId);
      return { ok: false, error: error?.message ?? "send_failed" };
    }
    await markDispatchSent(dispatchId, data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    await rollbackDispatch(dispatchId);
    return { ok: false, error: (err as Error).message };
  }
}

export async function sendPaymentConfirmation(
  user: { id: string; email: string },
  plan: "pro" | "unlimited",
  amount: string,
  invoiceUrl?: string,
): Promise<DispatchResult> {
  if (!isResendConfigured()) return { ok: false, error: "resend_not_configured" };
  try {
    const resend = getResendClient();
    const html = await render(PaymentConfirmationEmail({ plan, amount, invoiceUrl }));
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      replyTo: EMAIL_REPLY_TO,
      subject: `Potwierdzenie — plan ${plan === "pro" ? "Pro" : "Unlimited"} aktywny`,
      html,
    });
    if (error || !data) {
      return { ok: false, error: error?.message ?? "send_failed" };
    }
    await recordDispatch(user.id, "payment", data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function sendPackPurchaseConfirmation(
  user: { id: string; email: string },
  amount: string,
): Promise<DispatchResult> {
  if (!isResendConfigured()) return { ok: false, error: "resend_not_configured" };
  try {
    const resend = getResendClient();
    const html = await render(PackPurchaseConfirmationEmail({ amount }));
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      replyTo: EMAIL_REPLY_TO,
      subject: "Pro Pack aktywny — masz 10 pobrań CV",
      html,
    });
    if (error || !data) {
      return { ok: false, error: error?.message ?? "send_failed" };
    }
    await recordDispatch(user.id, "pack_purchase", data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function sendPlanGranted(
  user: { id: string; email: string },
  plan: "free" | "pro" | "unlimited",
  reason: string,
): Promise<DispatchResult> {
  if (!isResendConfigured()) return { ok: false, error: "resend_not_configured" };
  try {
    const resend = getResendClient();
    const html = await render(PlanGrantedEmail({ plan, reason }));
    const label = plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Unlimited";
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      replyTo: EMAIL_REPLY_TO,
      subject: `Plan ${label} aktywowany na Twoim koncie`,
      html,
    });
    if (error || !data) {
      return { ok: false, error: error?.message ?? "send_failed" };
    }
    await recordDispatch(user.id, "plan_granted", data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
