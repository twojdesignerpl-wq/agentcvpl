import type { User } from "@supabase/supabase-js";

export const FREE_DOWNLOAD_LIMIT = 1;
export const PRO_DOWNLOAD_LIMIT = 10;

export type PlanId = "free" | "pro" | "unlimited";

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
