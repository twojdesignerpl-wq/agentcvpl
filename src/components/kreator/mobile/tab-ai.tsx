"use client";

import { useRef } from "react";
import Link from "next/link";
import { Lock } from "@phosphor-icons/react/dist/ssr";
import { PracusChat, type PracusChatHandle } from "@/components/kreator/pracus/chat";
import { AtsGauge } from "@/components/kreator/pracus/ats-gauge";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { usePlan, planDisplayLabel } from "@/lib/plan/plan-context";
import { PLAN_OFFERS, PLAN_OFFERS_ORDER } from "@/components/plans/offers";
import { PlanCard } from "@/components/plans/plan-card";

export function MobileTabAI() {
  const { plan, source, hasAI } = usePlan();

  if (!hasAI) {
    return <AIPaywall />;
  }

  return <MobileTabAIAvailable plan={plan} source={source} />;
}

function MobileTabAIAvailable({
  plan,
  source,
}: {
  plan: "free" | "pro" | "unlimited";
  source: "subscription" | "pro_pack" | "free";
}) {
  const planLabel = planDisplayLabel(plan, source);
  const chatRef = useRef<PracusChatHandle>(null);

  const handleAskPracus = (prompt: string) => {
    chatRef.current?.sendPrompt(prompt);
  };

  return (
    <section
      className="flex h-full flex-col overflow-hidden bg-[color:var(--cream-soft)]"
      aria-label="Pracuś AI — asystent CV"
    >
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

function AIPaywall() {
  return (
    <section
      className="flex h-full flex-col overflow-y-auto bg-[color:var(--cream-soft)]"
      aria-label="Pracuś AI — wymaga planu Pro"
    >
      <div className="flex flex-col px-5 py-7">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="relative inline-flex">
            <PracusMark size={64} online={false} />
            <span className="absolute -right-1 -bottom-1 inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)] shadow-[0_6px_14px_-6px_rgba(10,14,26,0.5)]">
              <Lock size={13} weight="bold" />
            </span>
          </span>
          <p className="mono-label mt-4 text-[color:var(--saffron)]">Pracuś AI — wymaga Pro+</p>
          <h1 className="mt-2 font-display text-[1.65rem] font-bold leading-tight tracking-[-0.02em]">
            Asystent włącza się od planu Pro
          </h1>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-[color:var(--ink-soft)]">
            Chat z Pracusiem, dopasowanie do ogłoszenia, live ATS score i AI w polach CV — to
            funkcje planu Pro lub jednorazowego pakietu Pro Pack.
          </p>
        </div>

        <div className="grid items-stretch gap-4">
          {PLAN_OFFERS_ORDER.map((key) => (
            <PlanCard key={key} offer={PLAN_OFFERS[key]} size="compact" />
          ))}
        </div>

        <p className="mt-6 text-center text-[11.5px] text-[color:var(--ink-muted)]">
          <Link href="/subskrypcja" className="underline hover:text-ink">
            Pełne porównanie planów
          </Link>
        </p>
      </div>
    </section>
  );
}
