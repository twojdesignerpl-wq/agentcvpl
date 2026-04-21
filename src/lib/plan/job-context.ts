"use client";

/**
 * Job-listing context — session-only persist (nie localStorage, privacy).
 * Dostępne tylko dla Pro/Unlimited w panelu Pracuś.
 */

import { create } from "zustand";

const STORAGE_KEY = "pracus-job-context-v1";

export type JobSource = "pracuj" | "linkedin" | "nofluffjobs" | "justjoin" | "rocketjobs" | "other";

export interface JobContext {
  listing: string;
  source?: JobSource;
  position?: string;
  savedAt: number;
}

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  pracuj: "Pracuj.pl",
  linkedin: "LinkedIn",
  nofluffjobs: "NoFluffJobs",
  justjoin: "justjoin.it",
  rocketjobs: "Rocketjobs",
  other: "Inne",
};

type State = {
  current: JobContext | null;
  hydrated: boolean;
};

type Actions = {
  set: (ctx: JobContext) => void;
  clear: () => void;
  hydrate: () => void;
};

export const useJobContextStore = create<State & Actions>((set) => ({
  current: null,
  hydrated: false,
  set: (ctx) => {
    set({ current: ctx });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
      } catch {
        /* quota / disabled — ignore */
      }
    }
  },
  clear: () => {
    set({ current: null });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  },
  hydrate: () => {
    if (typeof window === "undefined") {
      set({ hydrated: true });
      return;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as JobContext;
        if (parsed && typeof parsed.listing === "string") {
          set({ current: parsed, hydrated: true });
          return;
        }
      }
    } catch {
      /* ignore */
    }
    set({ hydrated: true });
  },
}));
