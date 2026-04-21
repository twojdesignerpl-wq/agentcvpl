"use client";

import { useCallback } from "react";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: 25,
  success: [10, 40, 10],
  warning: [20, 30, 20],
};

export function useHaptic() {
  return useCallback((pattern: HapticPattern = "light") => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
      return;
    }
    try {
      navigator.vibrate(PATTERNS[pattern]);
    } catch {
      // no-op: some browsers restrict vibrate
    }
  }, []);
}
