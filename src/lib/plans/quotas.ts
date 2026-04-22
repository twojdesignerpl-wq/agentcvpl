import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const FREE_DOWNLOAD_LIMIT = 1;
export const PRO_DOWNLOAD_LIMIT = 10;
export const PRO_PACK_CREDITS = 10;

export type PlanId = "free" | "pro" | "unlimited";
export type PlanSource = "subscription" | "pro_pack" | "free";

export type EffectivePlan = {
  tier: PlanId;
  source: PlanSource;
  credits_remaining: number | null;
  credits_total: number | null;
  pack_id: string | null;
};

export type PlanQuota = {
  downloadsPerMonth: number;
  aiChatRequestsPerDay: number;
  aiCvRequestsPerDay: number;
  jobMatchPerMonth: number;
  hasAI: boolean;
  hasJobMatch: boolean;
};

export const PLAN_QUOTAS: Record<PlanId, PlanQuota> = {
  free: {
    downloadsPerMonth: FREE_DOWNLOAD_LIMIT,
    aiChatRequestsPerDay: 0,
    aiCvRequestsPerDay: 0,
    jobMatchPerMonth: 0,
    hasAI: false,
    hasJobMatch: false,
  },
  pro: {
    downloadsPerMonth: PRO_DOWNLOAD_LIMIT,
    aiChatRequestsPerDay: 100,
    aiCvRequestsPerDay: 100,
    jobMatchPerMonth: 20,
    hasAI: true,
    hasJobMatch: true,
  },
  unlimited: {
    downloadsPerMonth: Number.POSITIVE_INFINITY,
    aiChatRequestsPerDay: 500,
    aiCvRequestsPerDay: 500,
    jobMatchPerMonth: Number.POSITIVE_INFINITY,
    hasAI: true,
    hasJobMatch: true,
  },
};

export function getUserPlan(user: User | null | undefined): PlanId {
  if (!user) return "free";
  const raw = (user.app_metadata as { plan?: string } | null)?.plan;
  if (raw === "pro" || raw === "unlimited") return raw;
  return "free";
}

export function planLabel(plan: PlanId): string {
  if (plan === "pro") return "Pro";
  if (plan === "unlimited") return "Unlimited";
  return "Free";
}

/**
 * Efektywny plan usera = subscription tier z app_metadata albo aktywny Pro Pack credits.
 * Precedence: unlimited sub > pro sub > pro_pack (credits > 0) > free.
 *
 * UWAGA: używa service_role (omija RLS). Bezpieczne bo `user.id` pochodzi z
 * zwalidowanej sesji. Nigdy nie wywołuj z user-supplied userId.
 */
export async function getEffectivePlan(user: User | null | undefined): Promise<EffectivePlan> {
  if (!user) return freeEffective();

  const subTier = getUserPlan(user);
  if (subTier === "unlimited") {
    return { tier: "unlimited", source: "subscription", credits_remaining: null, credits_total: null, pack_id: null };
  }
  if (subTier === "pro") {
    return { tier: "pro", source: "subscription", credits_remaining: null, credits_total: null, pack_id: null };
  }

  // Brak active sub → sprawdź Pro Pack credits
  try {
    const admin = createSupabaseServiceClient();
    const { data: pack } = await admin
      .from("plan_credits")
      .select("id, credits_remaining, credits_granted")
      .eq("user_id", user.id)
      .eq("kind", "pro_pack")
      .eq("active", true)
      .gt("credits_remaining", 0)
      .order("granted_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (pack) {
      return {
        tier: "pro",
        source: "pro_pack",
        credits_remaining: pack.credits_remaining as number,
        credits_total: pack.credits_granted as number,
        pack_id: pack.id as string,
      };
    }
  } catch (err) {
    console.error("[getEffectivePlan]", err);
  }

  return freeEffective();
}

function freeEffective(): EffectivePlan {
  return { tier: "free", source: "free", credits_remaining: null, credits_total: null, pack_id: null };
}
