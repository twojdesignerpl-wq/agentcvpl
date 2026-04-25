import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { PLAN_QUOTAS, getEffectivePlan, type PlanId, type PlanSource } from "@/lib/plans/quotas";

type UsageAction = "pdf" | "docx" | "ai_chat" | "ai_cv" | "job_match";

export type UsageOk = {
  ok: true;
  remaining: number;
  limit: number;
  plan: PlanId;
  used: number;
  source?: PlanSource;
  pack_id?: string | null;
};
export type UsageFail =
  | { ok: false; reason: "plan_limit"; plan: PlanId; limit: number; used: number }
  | { ok: false; reason: "no_access"; plan: PlanId; limit: 0; used: 0 };
export type UsageCheck = UsageOk | UsageFail;

function firstOfMonth(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}
function startOfDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

async function countUsage(
  userId: string,
  actions: UsageAction[],
  sinceIso: string,
): Promise<number> {
  const admin = createSupabaseServiceClient();
  const { count, error } = await admin
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("action", actions)
    .gte("created_at", sinceIso);
  if (error) {
    console.error("[usage:count]", error);
    return 0;
  }
  return count ?? 0;
}

export async function canDownload(user: User): Promise<UsageCheck> {
  const effective = await getEffectivePlan(user);

  // Pro Pack → sprawdź credits_remaining (bez miesięcznego limitu)
  if (effective.source === "pro_pack") {
    const remaining = effective.credits_remaining ?? 0;
    const total = effective.credits_total ?? 0;
    if (remaining <= 0) {
      return { ok: false, reason: "plan_limit", plan: "pro", limit: total, used: total };
    }
    return {
      ok: true,
      remaining,
      limit: total,
      plan: "pro",
      used: total - remaining,
      source: "pro_pack",
      pack_id: effective.pack_id,
    };
  }

  // Subscription / free → miesięczny limit z usage_logs
  const plan = effective.tier;
  const limit = PLAN_QUOTAS[plan].downloadsPerMonth;
  if (!Number.isFinite(limit)) {
    return { ok: true, remaining: Number.POSITIVE_INFINITY, limit, plan, used: 0, source: effective.source };
  }
  const used = await countUsage(user.id, ["pdf", "docx"], firstOfMonth());
  if (used >= limit) {
    return { ok: false, reason: "plan_limit", plan, limit, used };
  }
  return { ok: true, remaining: limit - used, limit, plan, used, source: effective.source };
}

/**
 * Dekrementuje 1 kredyt z Pro Pack (FIFO, atomic przez SQL RPC).
 * @deprecated używaj `claimPackCredit` + `refundPackCredit` w pipeline render-then-decrement
 * (P0.4 atomic claim/refund). Pozostawione dla backward compat / migracja.
 */
export async function decrementPackCredit(userId: string): Promise<number> {
  try {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin.rpc("decrement_pack_credit", { p_user_id: userId });
    if (error) {
      console.error("[decrementPackCredit]", error);
      return -1;
    }
    return typeof data === "number" ? data : -1;
  } catch (err) {
    console.error("[decrementPackCredit]", err);
    return -1;
  }
}

export type PackClaim = { claim_id: string; credits_remaining: number };

/**
 * Atomic claim Pro Pack credit PRZED render (P0.4 race protection).
 * RPC: dekrementuje credit + zapisuje plan_credit_claims wiersz w jednej transakcji.
 * Zwraca null gdy brak dostępnych kredytów (FIFO, kind='pro_pack', active, remaining>0).
 */
export async function claimPackCredit(userId: string): Promise<PackClaim | null> {
  try {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin.rpc("claim_pack_credit", { p_user_id: userId });
    if (error) {
      console.error("[claimPackCredit]", error);
      return null;
    }
    if (!Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as { claim_id?: string; credits_remaining?: number };
    if (!row.claim_id || typeof row.credits_remaining !== "number") return null;
    return { claim_id: row.claim_id, credits_remaining: row.credits_remaining };
  } catch (err) {
    console.error("[claimPackCredit]", err);
    return null;
  }
}

/**
 * Refund Pro Pack credit jeśli render fail i claim < 5 min temu.
 * Zwraca true gdy refund wykonany, false gdy za późno / już refunded / claim nie istnieje.
 */
export async function refundPackCredit(claimId: string): Promise<boolean> {
  try {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin.rpc("refund_pack_credit", { p_claim_id: claimId });
    if (error) {
      console.error("[refundPackCredit]", error);
      return false;
    }
    return data === true;
  } catch (err) {
    console.error("[refundPackCredit]", err);
    return false;
  }
}

export async function canUseAI(
  user: User,
  kind: "chat" | "cv" | "job_match",
): Promise<UsageCheck> {
  // Pro Pack users mają dostęp do AI tak jak Pro sub (limity dzienne Pro).
  const effective = await getEffectivePlan(user);
  const plan = effective.tier;
  const quota = PLAN_QUOTAS[plan];
  if (!quota.hasAI) {
    return { ok: false, reason: "no_access", plan, limit: 0, used: 0 };
  }
  const { limit, sinceIso, action } =
    kind === "chat"
      ? { limit: quota.aiChatRequestsPerDay, sinceIso: startOfDay(), action: "ai_chat" as const }
      : kind === "cv"
        ? { limit: quota.aiCvRequestsPerDay, sinceIso: startOfDay(), action: "ai_cv" as const }
        : {
            limit: quota.jobMatchPerMonth,
            sinceIso: firstOfMonth(),
            action: "job_match" as const,
          };
  if (!Number.isFinite(limit)) {
    return { ok: true, remaining: Number.POSITIVE_INFINITY, limit, plan, used: 0 };
  }
  const used = await countUsage(user.id, [action], sinceIso);
  if (used >= limit) {
    return { ok: false, reason: "plan_limit", plan, limit, used };
  }
  return { ok: true, remaining: limit - used, limit, plan, used };
}

export async function recordUsage(
  userId: string,
  action: UsageAction,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const admin = createSupabaseServiceClient();
    const { error } = await admin
      .from("usage_logs")
      .insert({ user_id: userId, action, metadata: metadata ?? null });
    if (error) console.error("[usage:record]", error);
  } catch (err) {
    console.error("[usage:record]", err);
  }
}

export async function getMonthlyDownloadCount(userId: string): Promise<number> {
  return countUsage(userId, ["pdf", "docx"], firstOfMonth());
}

export function planLimitResponse(check: UsageFail): Response {
  const status = 402;
  const body = {
    error:
      check.reason === "no_access"
        ? `Plan ${check.plan} nie obejmuje tej funkcji. Upgrade: /subskrypcja`
        : `Przekroczono limit (${check.used}/${check.limit}) dla planu ${check.plan}. Upgrade: /subskrypcja`,
    code: check.reason,
    plan: check.plan,
    limit: check.limit,
    used: check.used,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
