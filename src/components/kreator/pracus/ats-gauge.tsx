"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, X, WarningOctagon, Warning, Info, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { calculateAtsScore, scoreLevelLabel, type AtsFlag } from "@/lib/ai/ats-score";
import { INDUSTRY_PROFILES } from "@/lib/ai/knowledge-base";

export function AtsGauge({ onAskPracus }: { onAskPracus: (prompt: string) => void }) {
  const cv = useCVStore((s) => s.cv);
  const [open, setOpen] = useState(false);

  const score = useMemo(() => calculateAtsScore(cv), [cv]);
  const { label, color } = scoreLevelLabel(score.overall);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="group relative flex items-center gap-3 rounded-2xl border border-ink/10 bg-gradient-to-br from-cream-soft to-cream px-3.5 py-2.5 text-left shadow-[0_4px_16px_-10px_rgba(10,14,26,0.18)] hover:border-saffron/40 hover:shadow-[0_8px_24px_-12px_rgba(10,14,26,0.22)] transition-[box-shadow,border-color,transform] cursor-pointer"
        aria-label={`ATS score ${score.overall} / 100 — ${label}. Kliknij aby zobaczyć analizę.`}
      >
        <Ring value={score.overall} color={color} size={44} />
        <div className="flex flex-col">
          <span className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-ink-muted leading-none">
            ATS Score
          </span>
          <span className="font-heading text-[17px] font-semibold text-ink leading-tight mt-1 tracking-[-0.01em]">
            {label}
          </span>
        </div>
        <Sparkle
          size={14}
          weight="fill"
          className="absolute top-2 right-2 text-saffron/60 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden
        />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              role="dialog"
              aria-label="Analiza ATS"
              className="absolute right-4 left-4 top-[88px] z-50 flex max-h-[min(720px,85dvh)] w-auto max-w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden overflow-y-auto rounded-3xl border border-ink/10 bg-cream-soft shadow-[0_32px_80px_-32px_rgba(10,14,26,0.45)] sm:left-auto"
            >
              <header className="flex items-center justify-between px-5 py-4 border-b border-ink/8 bg-gradient-to-br from-cream-soft to-cream">
                <div className="flex items-center gap-3">
                  <Ring value={score.overall} color={color} size={52} showNumber />
                  <div className="flex flex-col">
                    <span className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-ink-muted">
                      Analiza ATS
                    </span>
                    <span className="font-heading text-[18px] font-semibold text-ink leading-tight tracking-[-0.01em]">
                      {label} · {score.overall}/100
                    </span>
                    {score.industry ? (
                      <span className="text-[12px] font-medium text-ink-muted mt-0.5">
                        {INDUSTRY_PROFILES[score.industry]?.label ?? score.industry}
                      </span>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="size-8 grid place-items-center rounded-full text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
                  aria-label="Zamknij"
                >
                  <X size={14} weight="bold" />
                </button>
              </header>

              <div className="overflow-auto flex-1 p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <MiniGauge label="Kompletność" value={score.components.completeness} />
                  <MiniGauge label="Słowa ATS" value={score.components.keywordDensity} />
                  <MiniGauge label="Długość" value={score.components.length} />
                  <MiniGauge label="Czytelność" value={score.components.readability} />
                </div>

                {score.flags.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-muted">
                      Do poprawy ({score.flags.length})
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {score.flags.map((flag, i) => (
                        <FlagRow
                          key={`${flag.code ?? "f"}-${i}`}
                          flag={flag}
                          onAsk={() => {
                            onAskPracus(`Napraw problem: ${flag.message}`);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {score.missingKeywords.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-muted">
                      Brakujące słowa ATS ({score.missingKeywords.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {score.missingKeywords.slice(0, 12).map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full border border-rust/25 bg-rust/5 px-2.5 py-1 text-[11.5px] text-ink-soft"
                        >
                          {kw}
                        </span>
                      ))}
                      {score.missingKeywords.length > 12 ? (
                        <span className="text-[11.5px] text-ink-muted px-1 self-center">
                          +{score.missingKeywords.length - 12}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAskPracus(
                          `Dodaj do mojego CV brakujące słowa kluczowe ATS: ${score.missingKeywords.slice(0, 10).join(", ")}. Zaproponuj gdzie je umieścić — w profilu, umiejętnościach czy opisach stanowisk.`,
                        );
                        setOpen(false);
                      }}
                      className="self-start inline-flex items-center gap-1.5 rounded-full border border-saffron/40 bg-saffron/10 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-saffron/20 transition-colors"
                    >
                      <Sparkle size={12} weight="fill" className="text-saffron" />
                      Dodaj brakujące przez Pracusia
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Ring({
  value,
  color,
  size,
  showNumber,
}: {
  value: number;
  color: string;
  size: number;
  showNumber?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const style = {
    width: size,
    height: size,
    ["--ats-color" as string]: color,
    ["--ats-progress" as string]: pct,
  } as React.CSSProperties;
  return (
    <div
      className="ats-ring shrink-0 rounded-full grid place-items-center"
      style={style}
      aria-hidden
    >
      <div className="rounded-full bg-cream-soft grid place-items-center" style={{ width: size - 6, height: size - 6 }}>
        {showNumber ? (
          <span className="font-heading font-bold text-ink" style={{ fontSize: size * 0.36, color }}>
            {pct}
          </span>
        ) : (
          <Gauge size={size * 0.42} weight="fill" style={{ color }} />
        )}
      </div>
    </div>
  );
}

function MiniGauge({ label, value }: { label: string; value: number }) {
  const { color } = scoreLevelLabel(value);
  return (
    <div className="rounded-xl border border-ink/8 bg-cream p-3 flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] text-ink-muted">{label}</span>
        <span className="font-heading text-[15px] font-semibold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-ink/6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function FlagRow({ flag, onAsk }: { flag: AtsFlag; onAsk: () => void }) {
  const Icon =
    flag.level === "error" ? WarningOctagon : flag.level === "warn" ? Warning : Info;
  const color =
    flag.level === "error"
      ? "var(--rust)"
      : flag.level === "warn"
        ? "var(--saffron)"
        : "var(--ink-muted)";

  return (
    <div className="rounded-xl border border-ink/8 bg-cream p-3 flex items-start gap-2.5 hover:border-ink/16 transition-colors">
      <Icon size={15} weight="fill" style={{ color, flexShrink: 0, marginTop: 2 }} />
      <div className="flex-1 text-[12.5px] text-ink leading-snug">{flag.message}</div>
      <button
        type="button"
        onClick={onAsk}
        className="text-[11px] font-medium text-ink-muted hover:text-[color:var(--rust)] shrink-0 underline underline-offset-2 transition-colors"
      >
        zapytaj
      </button>
    </div>
  );
}
