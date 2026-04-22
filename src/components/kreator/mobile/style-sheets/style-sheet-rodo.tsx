"use client";

import { useCVStore } from "@/lib/cv/store";
import { RODO_OPTIONS } from "@/lib/cv/rodo";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function StyleSheetRodo({ open, onClose }: Props) {
  const rodo = useCVStore((s) => s.cv.rodo);
  const setRodoType = useCVStore((s) => s.setRodoType);
  const setRodoCompany = useCVStore((s) => s.setRodoCompany);

  const active = RODO_OPTIONS.find((o) => o.value === rodo.type);

  return (
    <BottomSheet open={open} onClose={onClose} title="Klauzula RODO">
      <div className="flex flex-col gap-4 pb-2">
        <ul className="flex flex-col gap-1.5">
          {RODO_OPTIONS.map((opt) => {
            const isActive = rodo.type === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => setRodoType(opt.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99]",
                    isActive
                      ? "border-[color:var(--ink)] bg-white"
                      : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 inline-block size-2 shrink-0 rounded-full transition-colors",
                      isActive ? "bg-[color:var(--saffron)]" : "bg-[color:color-mix(in_oklab,var(--ink)_18%,transparent)]",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-ink">{opt.label}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[color:var(--ink-muted)]">
                      {opt.hint}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {rodo.type === "future" || rodo.type === "both" ? (
          <label className="block">
            <span className="mono-label mb-1.5 block text-[clamp(0.6rem,2.6vw,0.7rem)] tracking-[0.14em] text-[color:var(--ink-muted)]">
              Nazwa pracodawcy (opcjonalnie)
            </span>
            <input
              type="text"
              value={rodo.companyName}
              onChange={(e) => setRodoCompany(e.target.value)}
              placeholder="np. Firma X Sp. z o.o."
              className="w-full min-h-[52px] rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white px-3.5 py-3 text-[16px] font-medium outline-none transition-[border-color] focus:border-[color:var(--ink)]"
            />
          </label>
        ) : null}

        {active ? (
          <p className="rounded-xl bg-[color:color-mix(in_oklab,var(--ink)_4%,transparent)] px-3 py-2 text-[12px] leading-snug text-[color:var(--ink-muted)]">
            Podgląd: <strong className="text-ink">{active.pillLabel}</strong>
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
