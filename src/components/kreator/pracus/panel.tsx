"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { PracusMark } from "./icon";
import { PracusChat, type PracusChatHandle } from "./chat";
import { HistoryButton } from "./history-panel";
import { AtsGauge } from "./ats-gauge";
import { JobContextActiveBar } from "./job-context-bar";
import { usePlan, planDisplayLabel } from "@/lib/plan/plan-context";

export function PracusPanel() {
  const { plan, source } = usePlan();
  const planLabel = planDisplayLabel(plan, source);
  const chatRef = useRef<PracusChatHandle>(null);

  const handleAskPracus = (prompt: string) => {
    chatRef.current?.sendPrompt(prompt);
  };

  return (
    <motion.aside
      initial={{ x: 24, opacity: 0, scale: 0.985 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      role="complementary"
      aria-label="Pracuś AI — asystent doradczy"
      className="hidden min-[1440px]:flex flex-col shrink-0 self-center h-[calc(100dvh-6rem)] aspect-[210/297] rounded-3xl border border-ink/10 bg-cream-soft shadow-[0_24px_72px_-32px_rgba(10,14,26,0.32),0_2px_8px_-2px_rgba(10,14,26,0.06)] overflow-hidden relative"
    >
      <div className="pointer-events-none absolute inset-0 pracus-glow opacity-60" aria-hidden />

      <header className="relative flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-ink/8">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative">
            <PracusMark size={52} online />
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-[16px] ring-2 ring-saffron/30"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-heading text-[24px] font-semibold text-ink leading-[1.05] tracking-[-0.02em] flex items-baseline gap-2.5">
              Pracuś
              <span className="text-[color:var(--saffron)] font-bold tracking-[-0.02em]">AI</span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-saffron/40 bg-saffron/12 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink self-center"
                aria-label={`Plan ${planLabel}`}
              >
                <span className="size-1.5 rounded-full bg-saffron" aria-hidden />
                {planLabel}
              </span>
            </h2>
            <p className="text-[13px] font-medium text-ink-muted leading-tight mt-1.5 truncate">
              Agent · 15 lat rekrutacji · polski rynek pracy
            </p>
          </div>
        </div>
      </header>

      <div className="relative px-5 py-3.5 border-b border-ink/8 flex items-center gap-3">
        <AtsGauge onAskPracus={handleAskPracus} />
        <div className="ml-auto">
          <HistoryButton />
        </div>
      </div>

      <JobContextActiveBar onOpenDialog={() => chatRef.current?.openJobDialog()} />

      <PracusChat ref={chatRef} />
    </motion.aside>
  );
}
