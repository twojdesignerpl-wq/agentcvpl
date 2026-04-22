import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { PLAN_QUOTAS, getUserPlan, type PlanId } from "@/lib/plans/quotas";

type UsageAction = "pdf" | "docx" | "ai_chat" | "ai_cv" | "job_match";

export type UsageOk = { ok: true; remaining: number; limit: number; plan: PlanId; used: number };
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
  const plan = getUserPlan(user);
  const limit = PLAN_QUOTAS[plan].downloadsPerMonth;
  if (!Number.isFinite(limit)) {
    return { ok: true, remaining: Number.POSITIVE_INFINITY, limit, plan, used: 0 };
  }
  const used = await countUsage(user.id, ["pdf", "docx"], firstOfMonth());
  if (used >= limit) {
    return { ok: false, reason: "plan_limit", plan, limit, used };
  }
  return { ok: true, remaining: limit - used, limit, plan, used };
}

export async function canUseAI(
  user: User,
  kind: "chat" | "cv" | "job_match",
): Promise<UsageCheck> {
  const plan = getUserPlan(user);
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
