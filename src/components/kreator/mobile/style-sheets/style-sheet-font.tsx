"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import {
  FONT_FAMILY_LABELS,
  FONT_FAMILY_STACKS,
  type FontFamilyId,
} from "@/lib/cv/schema";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FONT_IDS: readonly FontFamilyId[] = [
  "manrope",
  "ibm-plex",
  "geist",
  "outfit",
  "source-sans",
  "work-sans",
  "nunito-sans",
  "lora",
  "merriweather",
  "roboto-slab",
] as const;

const PREVIEW_SAMPLE = "Anna Kowalska · Product Designer";

export function StyleSheetFont({ open, onClose }: Props) {
  const current = useCVStore((s) => s.cv.settings.fontFamily);
  const setFontFamily = useCVStore((s) => s.setFontFamily);

  return (
    <BottomSheet open={open} onClose={onClose} title="Czcionka">
      <ul className="flex flex-col gap-1.5 pb-2">
        {FONT_IDS.map((id) => {
          const active = id === current;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  setFontFamily(id);
                  onClose();
                }}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99]",
                  active
                    ? "border-[color:var(--ink)] bg-white"
                    : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="font-display text-[15px] font-semibold tracking-tight text-ink"
                      style={{ fontFamily: FONT_FAMILY_STACKS[id] }}
                    >
                      {FONT_FAMILY_LABELS[id]}
                    </span>
                    {active ? (
                      <Check size={13} weight="bold" className="text-[color:var(--saffron)]" />
                    ) : null}
                  </span>
                  <span
                    className="mt-1 block truncate text-[13px] leading-snug text-[color:var(--ink)]/70"
                    style={{ fontFamily: FONT_FAMILY_STACKS[id] }}
                  >
                    {PREVIEW_SAMPLE}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
