"use client";

import { DownloadSimple, FileText, FilePdf, CheckCircle, Warning } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { SaveToAccountButton } from "../save-to-account";
import { cn } from "@/lib/utils";

type Props = {
  isExporting: boolean;
  exportError: string | null;
  overflowed: boolean;
  effectiveFontSize: number;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onPreview: () => void;
};

export function MobileTabExport({
  isExporting,
  exportError,
  overflowed,
  effectiveFontSize,
  onDownloadPDF,
  onDownloadDOCX,
  onPreview,
}: Props) {
  const personal = useCVStore((s) => s.cv.personal);
  const template = useCVStore((s) => s.cv.settings.templateId);
  const fontSize = useCVStore((s) => s.cv.settings.fontSize);
  const autoDownscaled = effectiveFontSize < fontSize;
  const name =
    [personal.firstName, personal.lastName].filter(Boolean).join(" ").trim() || "Twoje CV";

  return (
    <div className="space-y-4 px-4 pb-24 pt-3">
      <div className="flex items-baseline justify-between px-1 pb-1">
        <h1 className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">
          Gotowe do wysyłki
        </h1>
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">PDF · DOCX</span>
      </div>

      {/* Status card */}
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-4 py-3",
          overflowed
            ? "border-rose-200 bg-rose-50"
            : autoDownscaled
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-0.5 inline-flex size-6 items-center justify-center rounded-full",
            overflowed
              ? "bg-rose-200 text-rose-700"
              : autoDownscaled
                ? "bg-amber-200 text-amber-800"
                : "bg-emerald-200 text-emerald-700",
          )}
        >
          {overflowed ? <Warning size={14} weight="fill" /> : <CheckCircle size={14} weight="fill" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[14px] font-semibold tracking-tight text-ink">
            {overflowed
              ? "Treść się nie mieści"
              : autoDownscaled
                ? "Pracuś dopasował czcionkę"
                : "Wszystko zmieści się na 1 stronę"}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[color:var(--ink-muted)]">
            {overflowed
              ? "Skróć opisy lub usuń jedną pozycję doświadczenia."
              : autoDownscaled
                ? `Zmniejszono do ${effectiveFontSize.toFixed(2).replace(/\.00$/, "")}pt aby zmieściło się na A4.`
                : `Szablon ${template.charAt(0).toUpperCase()}${template.slice(1)}. ${effectiveFontSize.toFixed(2).replace(/\.00$/, "")}pt.`}
          </p>
        </div>
      </div>

      {/* Preview CTA */}
      <button
        type="button"
        onClick={onPreview}
        className="tap-target flex w-full items-center justify-between rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3 text-left hover:border-[color:var(--ink)]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="relative inline-flex h-[60px] w-[42px] shrink-0 flex-col gap-0.5 overflow-hidden rounded-md border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white p-1.5"
          >
            <span className="h-[3px] w-[60%] rounded bg-ink" />
            <span className="h-[1.5px] w-[80%] rounded bg-ink/30" />
            <span className="mt-0.5 h-[0.5px] w-full bg-ink/15" />
            <span className="mt-0.5 h-[1.5px] w-[40%] rounded bg-ink/60" />
            <span className="h-[1.5px] w-[85%] rounded bg-ink/20" />
            <span className="h-[1.5px] w-[80%] rounded bg-ink/20" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[14px] font-semibold tracking-tight text-ink">
              {name}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[color:var(--ink-muted)]">
              Tap żeby zobaczyć pełny podgląd A4
            </p>
          </div>
        </div>
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">Podgląd →</span>
      </button>

      {/* Save to account */}
      <div className="flex justify-center">
        <SaveToAccountButton effectiveFontSize={effectiveFontSize} />
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={onDownloadPDF}
        disabled={isExporting}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-4 text-[15px] font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(10,14,26,0.35)] transition-[opacity,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FilePdf size={18} weight="bold" />
        {isExporting ? "Generuję PDF…" : "Pobierz PDF (wizualny 1:1)"}
      </button>

      <button
        type="button"
        onClick={onDownloadDOCX}
        disabled={isExporting}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-4 py-3.5 text-[14px] font-semibold text-ink transition-[border-color,transform] active:scale-[0.98] hover:border-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileText size={16} weight="bold" />
        Pobierz DOCX (ATS)
      </button>

      {exportError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          Błąd eksportu: {exportError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-4">
        <h3 className="mono-label mb-2 text-[0.6rem] text-[color:var(--ink-muted)]">
          Który format wybrać?
        </h3>
        <ul className="space-y-2 text-[12.5px] leading-snug text-[color:var(--ink-soft)]">
          <li className="flex gap-2">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">PDF</strong> — jak w podglądzie, do
              aplikowania e-mailem i na LinkedIn.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">DOCX</strong> — ATS-friendly. Wrzuć do
              systemu rekrutacyjnego, który nie czyta PDF.
            </span>
          </li>
          <li className="flex items-center gap-1.5 pt-1 text-[11px] text-[color:var(--ink-muted)]">
            <DownloadSimple size={10} />
            Pobrane pliki zapiszą się w Plikach / Downloads.
          </li>
        </ul>
      </div>
    </div>
  );
}
