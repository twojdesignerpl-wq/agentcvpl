"use client";

import { useCallback, useRef, useState, type TextareaHTMLAttributes } from "react";
import { Sparkle, ArrowsInSimple, MagicWand, Check, X } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { useHaptic } from "@/hooks/use-haptic";
import { BottomSheet } from "../bottom-sheet";
import { MobileTextarea } from "./mobile-field";
import { cn } from "@/lib/utils";

type Action = "generate" | "improve" | "shorten";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  aiField: string;
  aiFieldLabel: string;
  aiActions?: Action[];
};

const ACTION_META: Record<Action, { label: string; description: string; Icon: typeof Sparkle }> = {
  generate: {
    label: "Napisz od zera",
    description: "Pracuś przygotuje treść na podstawie reszty CV",
    Icon: Sparkle,
  },
  improve: {
    label: "Popraw istniejący tekst",
    description: "Zachowa fakty, poprawi ton, składnię, konkret",
    Icon: MagicWand,
  },
  shorten: {
    label: "Skróć",
    description: "Wytnie lanie wody, zostawi najważniejsze",
    Icon: ArrowsInSimple,
  },
};

export function MobileAITextarea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
  aiField,
  aiFieldLabel,
  aiActions = ["generate", "improve", "shorten"],
  ...rest
}: Props) {
  const cv = useCVStore((s) => s.cv);
  const [open, setOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const haptic = useHaptic();

  const buildContext = useCallback(() => {
    const lines: string[] = [];
    const name = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");
    if (name) lines.push(`Osoba: ${name}`);
    if (cv.personal.role) lines.push(`Rola: ${cv.personal.role}`);
    if (cv.employment.length > 0) {
      lines.push("Doświadczenie:");
      for (const e of cv.employment) {
        const years = `${e.startYear}${e.current ? "—obecnie" : e.endYear ? `—${e.endYear}` : ""}`;
        lines.push(`- ${e.position} @ ${e.company} (${years})`);
      }
    }
    if (cv.skills.professional.length)
      lines.push(`Umiejętności: ${cv.skills.professional.slice(0, 10).join(", ")}`);
    if (cv.profile && aiField !== "profile") lines.push(`Profil: ${cv.profile}`);
    return lines.join("\n");
  }, [cv, aiField]);

  const runAction = async (action: Action) => {
    haptic("light");
    setActiveAction(action);
    setStreaming(true);
    setResult("");
    setError(null);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/cv/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          field: aiField,
          fieldLabel: aiFieldLabel,
          currentText: value,
          context: buildContext(),
          position: cv.personal.role,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({ error: "Błąd serwera" }));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setResult(acc);
      }
      haptic("success");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message);
      haptic("warning");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const apply = () => {
    if (!result.trim()) return;
    onChange(result.trim());
    haptic("success");
    closeSheet();
  };

  const closeSheet = () => {
    if (abortRef.current) abortRef.current.abort();
    setOpen(false);
    setResult("");
    setError(null);
    setActiveAction(null);
    setStreaming(false);
  };

  const availableActions = aiActions.filter((a) => {
    if (a === "generate") return true;
    return value.trim().length > 10;
  });

  return (
    <div className="space-y-2">
      <MobileTextarea
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint={hint}
        rows={rows}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tap-target inline-flex items-center gap-1.5 rounded-full border border-[color:color-mix(in_oklab,var(--saffron)_55%,transparent)] bg-[color:color-mix(in_oklab,var(--saffron)_18%,transparent)] px-3 py-1.5 text-[12.5px] font-semibold text-[color:var(--ink)] transition-[background-color,transform] active:scale-[0.98] hover:bg-[color:color-mix(in_oklab,var(--saffron)_28%,transparent)]"
      >
        <Sparkle size={14} weight="fill" className="text-[color:var(--saffron)]" />
        Pracuś · {aiFieldLabel.toLowerCase()}
      </button>

      <BottomSheet
        open={open}
        onClose={closeSheet}
        title={`Pracuś · ${aiFieldLabel}`}
        maxHeight="88dvh"
      >
        {!activeAction ? (
          <div className="space-y-2">
            <p className="pb-2 text-[13px] leading-snug text-[color:var(--ink-muted)]">
              Wybierz co zrobić. Pracuś zna Twoje CV — dopasuje styl i ton.
            </p>
            {availableActions.map((action) => {
              const meta = ACTION_META[action];
              const Icon = meta.Icon;
              return (
                <button
                  key={action}
                  type="button"
                  onClick={() => runAction(action)}
                  className="tap-target flex w-full items-start gap-3 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3 text-left transition-colors hover:border-[color:var(--ink)]"
                >
                  <span
                    aria-hidden
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] text-[color:var(--ink)]"
                  >
                    <Icon size={16} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-[14.5px] font-semibold tracking-tight text-ink">
                      {meta.label}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-[color:var(--ink-muted)]">
                      {meta.description}
                    </span>
                  </span>
                </button>
              );
            })}
            {availableActions.length < aiActions.length ? (
              <p className="pt-2 text-[11.5px] italic text-[color:var(--ink-muted)]">
                Popraw i skróć wymagają min. ~10 znaków.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Sparkle size={12} weight="fill" className="text-[color:var(--saffron)]" />
                <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
                  {ACTION_META[activeAction].label}
                </span>
                {streaming ? (
                  <span className="mono-label ml-auto text-[0.58rem] text-[color:var(--ink-muted)]">
                    Piszę…
                  </span>
                ) : null}
              </div>
              <div
                className={cn(
                  "whitespace-pre-wrap text-[14px] leading-relaxed text-ink",
                  !result && "italic text-[color:var(--ink-muted)]",
                )}
              >
                {result || (streaming ? "Pracuś myśli…" : "Brak wyniku")}
                {streaming ? (
                  <span
                    aria-hidden
                    className="pracus-caret ml-0.5 inline-block h-[1em] w-[2px] bg-[color:var(--saffron)] align-middle"
                  />
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (abortRef.current) abortRef.current.abort();
                  setActiveAction(null);
                  setResult("");
                  setError(null);
                }}
                className="tap-target inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-3 py-2.5 text-[13px] font-semibold text-ink hover:border-[color:var(--ink)]"
              >
                <X size={12} weight="bold" /> Odrzuć
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={streaming || !result.trim()}
                className="tap-target inline-flex flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2.5 text-[13px] font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={12} weight="bold" />
                Zastosuj
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
