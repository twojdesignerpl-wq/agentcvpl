"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkle, X, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";

type Action = "generate" | "improve" | "shorten";

type Props = {
  field: string;
  fieldLabel: string;
  currentText: string;
  onApply: (text: string) => void;
  className?: string;
  actions?: Action[];
};

export function AIInlineButton({
  field,
  fieldLabel,
  currentText,
  onApply,
  className,
  actions = ["generate", "improve", "shorten"],
}: Props) {
  const cv = useCVStore((s) => s.cv);
  const [open, setOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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
      lines.push(`Umiejętności zawodowe: ${cv.skills.professional.join(", ")}`);
    if (cv.profile && field !== "profile") lines.push(`Profil: ${cv.profile}`);
    return lines.join("\n");
  }, [cv, field]);

  const runAction = async (action: Action) => {
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
          field,
          fieldLabel,
          currentText,
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
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setResult(acc);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const apply = () => {
    if (!result.trim()) return;
    onApply(result.trim());
    setOpen(false);
    setResult("");
  };

  const close = () => {
    if (abortRef.current) abortRef.current.abort();
    setOpen(false);
    setResult("");
    setError(null);
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`AI pomoc dla: ${fieldLabel}`}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[color:var(--cv-line)]",
          "bg-white/90 backdrop-blur px-2 py-0.5 text-[9pt] text-[color:var(--cv-ink)]",
          "shadow-sm hover:bg-[color:var(--saffron)]/20 hover:border-[color:var(--saffron)] transition",
        )}
      >
        <Sparkle size={10} weight="fill" className="text-[color:var(--saffron)]" /> AI
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={`AI dla ${fieldLabel}`}
          className="absolute top-full right-0 z-40 mt-2 w-[340px] rounded-xl border border-[color:var(--cv-line)] bg-white p-3 shadow-[0_24px_48px_-16px_rgba(10,14,26,0.3)] text-ink font-body"
          style={{ fontSize: "10pt" }}
        >
          <header className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[10pt]">Pracuś · {fieldLabel}</h4>
            <button type="button" onClick={close} aria-label="Zamknij" className="text-[color:var(--cv-muted)] hover:text-ink">
              <X size={12} />
            </button>
          </header>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {actions.includes("generate") ? (
              <ActionButton onClick={() => runAction("generate")} disabled={streaming}>
                Wygeneruj
              </ActionButton>
            ) : null}
            {actions.includes("improve") && currentText.trim() ? (
              <ActionButton onClick={() => runAction("improve")} disabled={streaming}>
                Popraw
              </ActionButton>
            ) : null}
            {actions.includes("shorten") && currentText.trim() ? (
              <ActionButton onClick={() => runAction("shorten")} disabled={streaming}>
                Skróć
              </ActionButton>
            ) : null}
          </div>
          {error ? (
            <p className="rounded bg-rose-50 p-2 text-[9pt] text-rose-700">{error}</p>
          ) : null}
          {result || streaming ? (
            <div className="rounded border border-[color:var(--cv-line)] bg-[color:var(--cv-line-soft)] p-2 text-[9.5pt] leading-[1.45] max-h-[220px] overflow-auto whitespace-pre-wrap">
              {result}
              {streaming ? <span className="inline-block w-1 h-3 ml-0.5 bg-[color:var(--saffron)] align-middle animate-pulse" /> : null}
            </div>
          ) : (
            <p className="text-[9pt] text-[color:var(--cv-muted)] italic">
              Wybierz akcję, aby Pracuś pomógł z polem {fieldLabel.toLowerCase()}.
            </p>
          )}
          {result && !streaming ? (
            <footer className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded px-2 py-1 text-[9pt] text-[color:var(--cv-muted)] hover:text-ink"
              >
                Odrzuć
              </button>
              <button
                type="button"
                onClick={apply}
                className="inline-flex items-center gap-1 rounded bg-ink px-2.5 py-1 text-[9pt] text-cream hover:opacity-90"
              >
                <CheckCircle size={11} weight="fill" /> Zastosuj
              </button>
            </footer>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-[color:var(--cv-line)] bg-cream px-2.5 py-0.5 text-[9pt] hover:bg-[color:var(--saffron)]/20 hover:border-[color:var(--saffron)] disabled:opacity-40 transition"
    >
      {children}
    </button>
  );
}
