"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkle, Lock } from "@phosphor-icons/react/dist/ssr";
import { PracusChat, type PracusChatHandle } from "@/components/kreator/pracus/chat";
import { AtsGauge } from "@/components/kreator/pracus/ats-gauge";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { usePlan, planDisplayLabel } from "@/lib/plan/plan-context";
import { CheckoutButton } from "@/app/subskrypcja/checkout-button";

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
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="relative inline-flex">
            <PracusMark size={56} online={false} />
            <span className="absolute -right-1 -bottom-1 inline-flex size-6 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)]">
              <Lock size={12} weight="bold" />
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

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[color:var(--ink)] bg-[color:var(--cream)] p-4 shadow-[0_16px_32px_-20px_rgba(10,14,26,0.28)]">
            <div className="mb-2 flex items-center justify-between">
              <span className="mono-label text-[0.56rem] text-[color:var(--saffron)]">
                Najszybciej
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--ink-muted)]">
                <Sparkle size={10} weight="fill" />
                10 pobrań + AI
              </span>
            </div>
            <h2 className="font-display text-[1.1rem] font-bold tracking-tight">
              Pro Pack · 19 zł jednorazowo
            </h2>
            <p className="mb-3 mt-1 text-[12.5px] text-[color:var(--ink-soft)]">
              Kupujesz raz, kredyty nie wygasają. Pełny Pracuś AI + 10 pobrań CV.
            </p>
            <CheckoutButton plan="pro" mode="pack" label="Kup Pro Pack" variant="primary" />
          </div>

          <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white p-4">
            <h2 className="font-display text-[1.05rem] font-bold tracking-tight">
              Pro · 19 zł / mies.
            </h2>
            <p className="mb-3 mt-1 text-[12.5px] text-[color:var(--ink-soft)]">
              10 pobrań co miesiąc, pełny AI, anulujesz kiedy chcesz.
            </p>
            <CheckoutButton plan="pro" mode="sub" label="Przejdź na Pro" variant="ghost" />
          </div>

          <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white p-4">
            <h2 className="font-display text-[1.05rem] font-bold tracking-tight">
              Unlimited · 39 zł / mies.
            </h2>
            <p className="mb-3 mt-1 text-[12.5px] text-[color:var(--ink-soft)]">
              Bez limitu pobrań, priority AI, dedykowane wsparcie.
            </p>
            <CheckoutButton
              plan="unlimited"
              mode="sub"
              label="Przejdź na Unlimited"
              variant="ghost"
            />
          </div>
        </div>

        <p className="mt-5 text-center text-[11.5px] text-[color:var(--ink-muted)]">
          <Link href="/subskrypcja" className="underline hover:text-ink">
            Pełne porównanie planów
          </Link>
        </p>
      </div>
    </section>
  );
}
