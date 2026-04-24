"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PlanId, PlanSource } from "@/lib/plans/quotas";

export type PlanCtx = {
  /** Efektywny tier z punktu widzenia feature gate (Pack → "pro"). */
  plan: PlanId;
  /** Źródło dostępu — "subscription" / "pro_pack" / "free". */
  source: PlanSource;
  /** Czy user ma dostęp do AI (Pracuś chat + inline CV AI + job-match). */
  hasAI: boolean;
};

const DEFAULT: PlanCtx = { plan: "free", source: "free", hasAI: false };

const PlanContext = createContext<PlanCtx>(DEFAULT);

export function PlanProvider({
  plan,
  source,
  children,
}: {
  plan: PlanId;
  source: PlanSource;
  children: ReactNode;
}) {
  const hasAI = plan === "pro" || plan === "unlimited";
  return (
    <PlanContext.Provider value={{ plan, source, hasAI }}>{children}</PlanContext.Provider>
  );
}

export function usePlan(): PlanCtx {
  return useContext(PlanContext);
}

export function planDisplayLabel(plan: PlanId, source: PlanSource): string {
  if (plan === "unlimited") return "Unlimited";
  if (plan === "pro") return source === "pro_pack" ? "Pro Pack" : "Pro";
  return "Free";
}
