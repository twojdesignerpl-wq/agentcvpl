"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import type { TemplateId } from "@/lib/cv/schema";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

type TemplateOpt = {
  id: TemplateId;
  label: string;
  description: string;
  accent: string;
  bg: string;
};

const TEMPLATES: readonly TemplateOpt[] = [
  { id: "orbit", label: "Orbit", description: "Minimal monochrom, 2-kolumnowy układ.", accent: "#0f1115", bg: "#ffffff" },
  { id: "atlas", label: "Atlas", description: "Granat z niebieskim akcentem, ikony kontaktu.", accent: "#2563eb", bg: "#ffffff" },
  { id: "terra", label: "Terra", description: "Editorial serif, terakotowy akcent.", accent: "#b85a3e", bg: "#faf5ee" },
  { id: "cobalt", label: "Cobalt", description: "Granat na kremie, dekoracyjne kształty.", accent: "#1f3a5f", bg: "#faf6ec" },
  { id: "lumen", label: "Lumen", description: "Editorial mono, centrowany hero.", accent: "#0a0c10", bg: "#ffffff" },
] as const;

export function StyleSheetTemplate({ open, onClose }: Props) {
  const current = useCVStore((s) => s.cv.settings.templateId) as TemplateId;
  const setTemplate = useCVStore((s) => s.setTemplate);

  return (
    <BottomSheet open={open} onClose={onClose} title="Szablon CV">
      <ul className="flex flex-col gap-2 pb-2">
        {TEMPLATES.map((t) => {
          const active = t.id === current;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  setTemplate(t.id);
                  onClose();
                }}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99]",
                  active
                    ? "border-[color:var(--ink)] bg-white shadow-[0_8px_24px_-12px_rgba(10,14,26,0.2)]"
                    : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]",
                )}
              >
                <span
                  aria-hidden
                  className="relative flex size-16 shrink-0 overflow-hidden rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]"
                  style={{ background: t.bg }}
                >
                  <span className="flex h-full w-full flex-col gap-1 p-2">
                    <span className="h-2 w-[60%] rounded" style={{ background: t.accent }} />
                    <span className="h-1 w-[80%] rounded bg-black/20" />
                    <span className="mt-1 h-px w-full bg-black/10" />
                    <span className="mt-1 h-1.5 w-[38%] rounded bg-black/40" />
                    <span className="h-1 w-[90%] rounded bg-black/15" />
                    <span className="h-1 w-[85%] rounded bg-black/15" />
                    <span className="mt-1 h-1.5 w-[32%] rounded bg-black/40" />
                    <span className="h-1 w-[88%] rounded bg-black/15" />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                      {t.label}
                    </span>
                    {active ? (
                      <Check size={13} weight="bold" className="text-[color:var(--saffron)]" />
                    ) : null}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-snug text-[color:var(--ink-muted)]">
                    {t.description}
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
