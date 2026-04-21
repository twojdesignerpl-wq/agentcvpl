"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserPlan = "free" | "pro" | "unlimited";

export const USER_PLANS: readonly UserPlan[] = ["free", "pro", "unlimited"] as const;

export function isUserPlan(value: unknown): value is UserPlan {
  return typeof value === "string" && (USER_PLANS as readonly string[]).includes(value);
}

type State = {
  userPlan: UserPlan;
  hydrated: boolean;
};

type Actions = {
  setPlan: (plan: UserPlan) => void;
  setHydrated: (v: boolean) => void;
};

export const usePlanStore = create<State & Actions>()(
  persist(
    (set) => ({
      userPlan: "free",
      hydrated: false,
      setPlan: (plan) => set({ userPlan: plan }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "kreator-plan-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ userPlan: s.userPlan }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function isAiPlan(plan: UserPlan): boolean {
  return plan === "pro" || plan === "unlimited";
}
