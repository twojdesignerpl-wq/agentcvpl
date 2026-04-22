"use client";

import { useRef } from "react";
import { PracusChat, type PracusChatHandle } from "@/components/kreator/pracus/chat";
import { AtsGauge } from "@/components/kreator/pracus/ats-gauge";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { usePlanStore } from "@/lib/plan/store";

export function MobileTabAI() {
  const plan = usePlanStore((s) => s.userPlan);
  const planLabel = plan === "unlimited" ? "Unlimited" : plan === "pro" ? "Pro" : "Free";
  const chatRef = useRef<PracusChatHandle>(null);

  const handleAskPracus = (prompt: string) => {
    chatRef.current?.sendPrompt(prompt);
  };

  return (
    <section
      className="flex h-full flex-col overflow-hidden bg-[color:var(--cream-soft)]"
      aria-label="Pracuś AI — asystent CV"
    >
      {/* Header — kompaktowy, z wpiętym ATS w jednej linii */}
      <header className="relative flex shrink-0 flex-col gap-2 border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <PracusMark size={36} online />
          <div className="min-w-0 flex-1">
            <h1 className="flex items-baseline gap-2 font-display text-[17px] font-semibold tracking-tight text-ink">
              Pracuś
              <span className="font-bold text-[color:var(--saffron)]">AI</span>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-saffron/40 bg-saffron/12 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink"
                aria-label={`Plan ${planLabel}`}
              >
                <span className="size-1 rounded-full bg-saffron" aria-hidden />
                {planLabel}
              </span>
            </h1>
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
    </section>
  );
}
