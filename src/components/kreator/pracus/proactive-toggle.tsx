"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Bell, BellSlash } from "@phosphor-icons/react/dist/ssr";

/** Preferencja użytkownika na proactive prompts (persist). */
type State = {
  enabled: boolean;
  hydrated: boolean;
  lastTriggers: Record<string, number>;
};
type Actions = {
  toggle: () => void;
  setEnabled: (v: boolean) => void;
  markTriggered: (key: string) => void;
  shouldTrigger: (key: string, cooldownMs: number) => boolean;
  setHydrated: (v: boolean) => void;
};

export const useProactiveStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      enabled: false,
      hydrated: false,
      lastTriggers: {},
      toggle: () => set((s) => ({ enabled: !s.enabled })),
      setEnabled: (v) => set({ enabled: v }),
      markTriggered: (key) =>
        set((s) => ({ lastTriggers: { ...s.lastTriggers, [key]: Date.now() } })),
      shouldTrigger: (key, cooldownMs) => {
        if (!get().enabled) return false;
        const last = get().lastTriggers[key] ?? 0;
        return Date.now() - last > cooldownMs;
      },
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "pracus-proactive-v1",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage),
      ),
      partialize: (s) => ({ enabled: s.enabled }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function ProactiveToggle() {
  const enabled = useProactiveStore((s) => s.enabled);
  const hydrated = useProactiveStore((s) => s.hydrated);
  const toggle = useProactiveStore((s) => s.toggle);

  if (!hydrated) return null;

  const Icon = enabled ? Bell : BellSlash;

  return (
    <button
      type="button"
      onClick={() => toggle()}
      className={
        enabled
          ? "inline-flex items-center gap-1.5 rounded-full border border-saffron/50 bg-saffron/12 px-3.5 py-2 text-[13px] font-medium text-ink hover:border-saffron transition-colors"
          : "inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream px-3.5 py-2 text-[13px] font-medium text-ink-muted hover:text-ink hover:border-saffron transition-colors"
      }
      aria-label={
        enabled
          ? "Wyłącz auto-podpowiedzi — Pracuś przestanie sam odzywać się"
          : "Włącz auto-podpowiedzi — Pracuś sam odezwie się gdy zauważy braki w CV"
      }
      title={
        enabled
          ? "Auto-podpowiedzi WŁĄCZONE\nPracuś sam zauważa puste pola i proponuje wypełnienie (np. gdy dodasz stanowisko bez opisu)."
          : "Auto-podpowiedzi WYŁĄCZONE\nPracuś pisze tylko gdy go zapytasz. Kliknij, by włączyć automatyczne podpowiedzi gdy widzi braki."
      }
    >
      <Icon size={14} weight={enabled ? "fill" : "regular"} className={enabled ? "text-saffron" : "text-ink-muted"} />
      {enabled ? "Auto-podpowiedzi" : "Auto-podpowiedzi OFF"}
    </button>
  );
}
