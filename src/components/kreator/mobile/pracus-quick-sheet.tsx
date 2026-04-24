"use client";

import { useRef } from "react";
import { PracusChat, type PracusChatHandle } from "@/components/kreator/pracus/chat";
import { AtsGauge } from "@/components/kreator/pracus/ats-gauge";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { usePlan, planDisplayLabel } from "@/lib/plan/plan-context";
import { BottomSheet } from "./bottom-sheet";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Bottom-sheet wrapper na pełny chat Pracusia — dostępny przez FAB z dowolnego taba
 * (Editor, Styl) bez opuszczania aktualnej edycji.
 */
export function PracusQuickSheet({ open, onClose }: Props) {
  const { plan, source } = usePlan();
  const planLabel = planDisplayLabel(plan, source);
  const chatRef = useRef<PracusChatHandle>(null);

  const handleAskPracus = (prompt: string) => {
    chatRef.current?.sendPrompt(prompt);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      maxHeight="92dvh"
      contentClassName="px-0 pt-0 pb-0"
    >
      <div className="flex h-[calc(92dvh-2.5rem)] flex-col overflow-hidden">
        <header className="relative flex shrink-0 flex-col gap-2 border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <PracusMark size={36} online />
            <div className="min-w-0 flex-1">
              <h2 className="flex items-baseline gap-2 font-display text-[16px] font-semibold tracking-tight text-ink">
                Pracuś
                <span className="font-bold text-[color:var(--saffron)]">AI</span>
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-[color:var(--saffron)]/40 bg-[color:color-mix(in_oklab,var(--saffron)_12%,transparent)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink"
                  aria-label={`Plan ${planLabel}`}
                >
                  <span className="size-1 rounded-full bg-[color:var(--saffron)]" aria-hidden />
                  {planLabel}
                </span>
              </h2>
              <p className="mt-0.5 truncate text-[11px] font-medium text-ink-muted">
                15 lat rekrutacji · polski rynek pracy
              </p>
            </div>
          </div>
          <AtsGauge onAskPracus={handleAskPracus} compact />
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          <PracusChat ref={chatRef} />
        </div>
      </div>
    </BottomSheet>
  );
}
