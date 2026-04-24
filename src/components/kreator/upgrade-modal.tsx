"use client";

import Link from "next/link";
import { Sparkle, X } from "@phosphor-icons/react";
import { CheckoutButton } from "@/app/subskrypcja/checkout-button";

type Props = {
  open: boolean;
  onClose: () => void;
  reason: "plan_limit" | "no_access";
  currentPlan: "free" | "pro" | "unlimited";
  feature: "download" | "ai_chat" | "ai_cv" | "job_match";
};

const FEATURE_COPY: Record<Props["feature"], { title: string; desc: string }> = {
  download: {
    title: "Limit pobrań osiągnięty",
    desc: "Darmowe pobranie wykorzystane. Wybierz plan lub jednorazowy pakiet, aby kontynuować.",
  },
  ai_chat: {
    title: "Pracuś AI jest dla Pro+",
    desc: "Asystent AI to funkcja Pro. Odblokuj chat, dopasowanie do ogłoszenia i live ATS score.",
  },
  ai_cv: {
    title: "AI w edytorze — Pro+",
    desc: "Automatyczne generowanie i poprawa treści w polach CV jest częścią planu Pro.",
  },
  job_match: {
    title: "Dopasowanie do ogłoszenia — Pro+",
    desc: "Analiza ATS i dopasowanie CV do konkretnego ogłoszenia wymagają planu Pro.",
  },
};

type CtaKey = "pack" | "pro" | "unlimited";

type Cta = {
  key: CtaKey;
  label: string;
  plan: "pro" | "unlimited";
  mode: "sub" | "pack";
  badge: string;
  note: string;
  variant: "primary" | "ghost";
};

const PACK_CTA: Cta = {
  key: "pack",
  label: "Pro Pack · 19 zł jednorazowo",
  plan: "pro",
  mode: "pack",
  badge: "Najszybciej",
  note: "10 pobrań, kredyty nie wygasają, pełny Pracuś AI",
  variant: "primary",
};
const PRO_CTA: Cta = {
  key: "pro",
  label: "Pro · 19 zł / mies.",
  plan: "pro",
  mode: "sub",
  badge: "Subskrypcja",
  note: "10 pobrań co miesiąc, pełny AI, anulujesz kiedy chcesz",
  variant: "ghost",
};
const UNLIMITED_CTA: Cta = {
  key: "unlimited",
  label: "Unlimited · 39 zł / mies.",
  plan: "unlimited",
  mode: "sub",
  badge: "Bez limitu",
  note: "Pobrania bez limitu, priority AI, premium support",
  variant: "ghost",
};

function pickCtas(currentPlan: Props["currentPlan"], feature: Props["feature"]): Cta[] {
  // Free + download (1/1 wyczerpane) — pełny wybór: Pack, Pro, Unlimited.
  if (currentPlan === "free" && feature === "download") {
    return [PACK_CTA, PRO_CTA, UNLIMITED_CTA];
  }
  // Free + AI features — Pack też daje AI, więc pełny wybór.
  if (currentPlan === "free") {
    return [PACK_CTA, PRO_CTA, UNLIMITED_CTA];
  }
  // Pro wyczerpał miesięczny limit — jedyna sensowna ścieżka: Unlimited.
  if (currentPlan === "pro") {
    return [UNLIMITED_CTA];
  }
  // Unlimited nie powinien widzieć tego modala, ale gdyby — return empty.
  return [];
}

export function UpgradeModal({ open, onClose, reason, currentPlan, feature }: Props) {
  if (!open) return null;
  const copy = FEATURE_COPY[feature];
  const ctas = pickCtas(currentPlan, feature);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-title"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[color:var(--ink)]/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[color:var(--cream)] p-6 shadow-[0_24px_64px_-16px_rgba(10,14,26,0.4)] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-[color:var(--ink-muted)] transition-colors hover:bg-[color:var(--cream-soft)] hover:text-ink"
        >
          <X size={16} weight="bold" />
        </button>

        <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-[color:var(--saffron)]/25 text-[color:var(--saffron)]">
          <Sparkle size={20} weight="fill" />
        </div>

        <h2
          id="upgrade-title"
          className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.02em]"
        >
          {copy.title}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-soft)]">{copy.desc}</p>

        <div className="mt-5 rounded-2xl bg-white p-4 text-[13px] text-[color:var(--ink-soft)]">
          <p className="mono-label mb-1 text-[0.56rem] text-[color:var(--ink-muted)]">
            Twój aktualny plan
          </p>
          <p className="font-display text-[15px] font-semibold capitalize tracking-tight">
            {currentPlan}
          </p>
          {reason === "plan_limit" && currentPlan === "pro" ? (
            <p className="mt-1 text-[11.5px] text-[color:var(--ink-muted)]">
              Miesięczny limit resetuje się pierwszego dnia kolejnego miesiąca.
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {ctas.map((cta) => (
            <div key={cta.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="mono-label text-[0.56rem] text-[color:var(--ink-muted)]">
                  {cta.badge}
                </span>
                <span className="text-[11.5px] text-[color:var(--ink-muted)]">{cta.note}</span>
              </div>
              <CheckoutButton
                plan={cta.plan}
                mode={cta.mode}
                label={cta.label}
                variant={cta.variant}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-[12.5px] text-[color:var(--ink-muted)]">
          <Link href="/subskrypcja" className="underline hover:text-ink">
            Pełne porównanie
          </Link>
          <button type="button" onClick={onClose} className="hover:text-ink">
            Nie teraz
          </button>
        </div>
      </div>
    </div>
  );
}
