"use client";

/**
 * CV Version History — snapshots CV przed każdym apply propozycji agenta.
 *
 * Trzyma max 10 wersji w pamięci (sessionStorage opcjonalnie). Każdy snapshot
 * ma timestamp + label + pełny CVData.
 */

import { create } from "zustand";
import type { CVData } from "./schema";

export interface CVSnapshot {
  id: string;
  label: string;
  timestamp: number;
  cv: CVData;
}

const MAX_HISTORY = 10;

type State = {
  history: CVSnapshot[];
};

type Actions = {
  push: (label: string, cv: CVData) => void;
  restore: (id: string) => CVData | null;
  clear: () => void;
  remove: (id: string) => void;
};

export const useHistoryStore = create<State & Actions>((set, get) => ({
  history: [],
  push: (label, cv) => {
    const id = `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const snapshot: CVSnapshot = {
      id,
      label,
      timestamp: Date.now(),
      cv: JSON.parse(JSON.stringify(cv)) as CVData, // deep clone
    };
    set((s) => ({
      history: [snapshot, ...s.history].slice(0, MAX_HISTORY),
    }));
  },
  restore: (id) => {
    const snapshot = get().history.find((h) => h.id === id);
    return snapshot ? snapshot.cv : null;
  },
  clear: () => set({ history: [] }),
  remove: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
}));

export function formatSnapshotTime(timestamp: number): string {
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 60) return `${diffSec}s temu`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min temu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} godz temu`;
  const d = new Date(timestamp);
  return d.toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}
