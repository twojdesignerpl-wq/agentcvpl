"use client";

import { motion } from "motion/react";
import { Target, X } from "@phosphor-icons/react/dist/ssr";
import { JOB_SOURCE_LABELS, useJobContextStore } from "@/lib/plan/job-context";

type Props = {
  onOpenDialog: () => void;
};

/**
 * Pasek aktywnego ogłoszenia — pokazywany w headerze panelu Pracuś tylko gdy user
 * ma zapisany job context. Style dopasowany do górnego designu (ATS Score / Historia):
 * zaokrąglony card z saffron akcentem, średnica spójna z ATS gauge.
 */
export function JobContextActiveBar({ onOpenDialog }: Props) {
  const jobContext = useJobContextStore((s) => s.current);
  const hydrated = useJobContextStore((s) => s.hydrated);
  const clearJobContext = useJobContextStore((s) => s.clear);

  if (!hydrated || !jobContext) return null;

  const sourceLabel = jobContext.source
    ? JOB_SOURCE_LABELS[jobContext.source]
    : "Wklejony tekst";

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="relative px-5 py-3 border-b border-ink/8"
    >
      <div className="rounded-2xl border border-saffron/40 bg-gradient-to-br from-saffron/12 via-saffron/8 to-saffron/5 px-4 py-3 flex items-center gap-3 shadow-[0_2px_10px_-6px_rgba(10,14,26,0.12)]">
        <span
          aria-hidden
          className="shrink-0 size-9 rounded-xl bg-saffron/20 grid place-items-center"
        >
          <Target size={18} weight="fill" className="text-[color:var(--saffron)]" />
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-ink-muted leading-none">
            Aktywne ogłoszenie
          </span>
          <span className="text-[14px] font-semibold text-ink leading-tight mt-1 truncate tracking-[-0.005em]">
            {sourceLabel}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenDialog}
            className="inline-flex items-center rounded-full border border-ink/12 bg-cream px-3 py-1.5 text-[12px] font-semibold text-ink hover:border-saffron hover:bg-saffron/10 transition-colors"
            aria-label="Edytuj ogłoszenie"
          >
            Edytuj
          </button>
          <button
            type="button"
            onClick={() => clearJobContext()}
            className="size-8 grid place-items-center rounded-full text-ink-muted hover:text-rust hover:bg-rust/10 transition-colors"
            aria-label="Wyczyść kontekst ogłoszenia"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
