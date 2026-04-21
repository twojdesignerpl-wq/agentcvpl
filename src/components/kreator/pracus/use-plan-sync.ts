"use client";

import { useEffect } from "react";
import { isUserPlan, usePlanStore } from "@/lib/plan/store";

export function usePlanSync() {
  const setPlan = usePlanStore((s) => s.setPlan);
  const hydrated = usePlanStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("plan");
    if (!raw) return;
    if (isUserPlan(raw)) setPlan(raw);
  }, [hydrated, setPlan]);
}
