"use client";

import { useCVStore } from "@/lib/cv/store";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP,
} from "@/lib/cv/schema";
import { ArrowsInSimple, ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

// Major steps — tap-precise segmented control. Fine-tune przez slider.
const MAJOR_STEPS = [8, 9, 10, 11, 12, 13, 14] as const;

function clampSize(v: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, v));
}

export function StyleSheetSize({ open, onClose }: Props) {
  const fontSize = useCVStore((s) => s.cv.settings.fontSize);
  const setFontSize = useCVStore((s) => s.setFontSize);

  const display = fontSize.toFixed(2).replace(/\.00$/, "");
  const nearestMajor = MAJOR_STEPS.reduce((best, v) =>
    Math.abs(v - fontSize) < Math.abs(best - fontSize) ? v : best,
  FONT_SIZE_MIN);

  return (
    <BottomSheet open={open} onClose={onClose} title="Wielkość czcionki">
      <div className="flex flex-col gap-5 pb-2">
        <div className="flex items-baseline justify-between">
          <span className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">
            Aktualnie
          </span>
          <span className="font-display text-[28px] font-bold leading-none tabular-nums text-ink">
            {display}pt
          </span>
        </div>

        {/* Segmented control — major steps */}
        <div className="grid grid-cols-7 gap-1.5">
          {MAJOR_STEPS.map((v) => {
            const active = nearestMajor === v && Math.abs(fontSize - v) < FONT_SIZE_STEP / 2;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setFontSize(v)}
                aria-pressed={active}
                className={cn(
                  "tap-target rounded-xl border text-[14px] font-semibold tabular-nums transition-colors",
                  active
                    ? "border-[color:var(--ink)] bg-ink text-cream"
                    : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] text-ink hover:border-[color:var(--ink)]",
                )}
              >
                {v}
              </button>
            );
          })}
        </div>

        {/* Fine-tune slider */}
        <div className="flex items-center gap-3 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-3">
          <button
            type="button"
            onClick={() => setFontSize(clampSize(fontSize - FONT_SIZE_STEP))}
            aria-label="Zmniejsz o 0,25pt"
            className="tap-target inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]"
          >
            <ArrowsInSimple size={14} weight="bold" />
          </button>
          <input
            type="range"
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            step={FONT_SIZE_STEP}
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="flex-1 cursor-pointer accent-[var(--saffron)]"
            aria-label="Rozmiar czcionki (precyzyjny)"
          />
          <button
            type="button"
            onClick={() => setFontSize(clampSize(fontSize + FONT_SIZE_STEP))}
            aria-label="Zwiększ o 0,25pt"
            className="tap-target inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]"
          >
            <ArrowsOutSimple size={14} weight="bold" />
          </button>
        </div>

        <p className="text-[12px] leading-snug text-[color:var(--ink-muted)]">
          Pracuś automatycznie skaluje do 1 strony A4 — nie musisz zgadywać.
          Zakres: {FONT_SIZE_MIN}–{FONT_SIZE_MAX}pt, krok 0,25.
        </p>
      </div>
    </BottomSheet>
  );
}
