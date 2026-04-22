"use client";

import Link from "next/link";
import { ArrowRight, Sparkle, X } from "@phosphor-icons/react";

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
    desc: "Plan Free pozwala na 1 pobranie CV miesięcznie. Przejdź na Pro (19 zł/mc) — 10 pobrań i pełny Pracuś.",
  },
  ai_chat: {
    title: "Pracuś AI jest dla Pro+",
    desc: "Asystent AI to funkcja Pro. Odblokuj chat, dopasowanie do ogłoszenia i live ATS score za 19 zł/mc.",
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

export function UpgradeModal({ open, onClose, reason, currentPlan, feature }: Props) {
  if (!open) return null;
  const copy = FEATURE_COPY[feature];
  const suggestedPlan = feature === "download" && currentPlan === "pro" ? "unlimited" : "pro";

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
        className="relative w-full max-w-md rounded-3xl bg-[color:var(--cream)] p-6 shadow-[0_24px_64px_-16px_rgba(10,14,26,0.4)] sm:p-8"
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
          <p className="mono-label mb-2 text-[0.56rem] text-[color:var(--ink-muted)]">
            Twój aktualny plan
          </p>
          <p className="font-display text-[15px] font-semibold capitalize tracking-tight">
            {currentPlan}
          </p>
          {reason === "plan_limit" ? (
            <p className="mt-1 text-[11.5px] text-[color:var(--ink-muted)]">
              Limit zresetuje się pierwszego dnia kolejnego miesiąca.
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/subskrypcja?plan=${suggestedPlan}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-cream transition-opacity hover:opacity-95"
          >
            Przejdź na {suggestedPlan === "unlimited" ? "Unlimited" : "Pro"}
            <ArrowRight size={14} weight="bold" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-[color:var(--ink-muted)] hover:text-ink"
          >
            Nie teraz
          </button>
        </div>
      </div>
    </div>
  );
}
