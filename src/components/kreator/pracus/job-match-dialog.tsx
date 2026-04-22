"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowClockwise,
  CheckCircle,
  DownloadSimple,
  Link as LinkIcon,
  Spinner,
  Target,
  WarningOctagon,
  X,
} from "@phosphor-icons/react/dist/ssr";
import {
  JOB_SOURCE_LABELS,
  useJobContextStore,
  type JobSource,
} from "@/lib/plan/job-context";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (listing: string, source: JobSource | undefined) => void;
};

const MAX_LEN = 8000;
const URL_RE = /^https?:\/\/\S+$/i;

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      title: string;
      hostname: string;
      truncated: boolean;
    }
  | { status: "error"; message: string };

export function JobMatchDialog({ open, onOpenChange, onSubmit }: Props) {
  const existing = useJobContextStore((s) => s.current);
  const saveJob = useJobContextStore((s) => s.set);
  const clearJob = useJobContextStore((s) => s.clear);
  const hydrate = useJobContextStore((s) => s.hydrate);

  const [listing, setListing] = useState(() => existing?.listing ?? "");
  const [source, setSource] = useState<JobSource | undefined>(() => existing?.source);
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setListing(existing?.listing ?? "");
      setSource(existing?.source);
      setFetchState({ status: "idle" });
    }
    onOpenChange(next);
  };

  const count = listing.length;
  const trimmed = listing.trim();
  const isUrlOnly = URL_RE.test(trimmed) && !/\s/.test(trimmed);
  const minLen = isUrlOnly ? 10 : 50;
  const canSubmit = trimmed.length >= minLen && count <= MAX_LEN && fetchState.status !== "loading";

  const extractedUrl = useMemo(() => {
    const match = trimmed.match(/https?:\/\/\S+/i);
    return match?.[0];
  }, [trimmed]);

  /**
   * Pobiera treść z URL przez `/api/fetch-job`. Zwraca `{content, source?}` przy sukcesie
   * lub `null` i ustawia fetchState na error.
   */
  const performFetch = async (
    url: string,
  ): Promise<{ content: string; source?: JobSource } | null> => {
    setFetchState({ status: "loading" });
    try {
      const res = await fetch("/api/fetch-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        title?: string;
        content?: string;
        source?: string;
        hostname?: string;
        truncated?: boolean;
        tier?: "known" | "unknown";
        error?: string;
      };
      if (!res.ok || !data.ok || !data.content) {
        setFetchState({
          status: "error",
          message: data.error ?? "Nie udało się pobrać ogłoszenia.",
        });
        return null;
      }
      const composed = composeListing(data.title, data.content, url).slice(0, MAX_LEN);
      setListing(composed);
      const detectedSource =
        data.source && data.source !== "other" ? (data.source as JobSource) : undefined;
      if (detectedSource) setSource(detectedSource);
      setFetchState({
        status: "success",
        title: data.title ?? "",
        hostname: data.hostname ?? "",
        truncated: Boolean(data.truncated),
      });
      return { content: composed, source: detectedSource };
    } catch {
      setFetchState({
        status: "error",
        message: "Błąd sieci — sprawdź połączenie i spróbuj ponownie.",
      });
      return null;
    }
  };

  const handleFetchUrl = async () => {
    if (extractedUrl) await performFetch(extractedUrl);
  };

  /**
   * Submit z auto-fetch:
   * - Jeśli użytkownik wkleił TYLKO URL (bez dodatkowej treści) i jeszcze nie pobrano —
   *   najpierw pobierz treść, dopiero wtedy wyślij do AI.
   * - Jeśli fetch się nie powiedzie — zatrzymaj submit i pokaż błąd.
   */
  const handleSubmit = async () => {
    if (!canSubmit) return;

    let finalListing = listing.trim();
    let finalSource = source;

    if (isUrlOnly && extractedUrl && fetchState.status !== "success") {
      const fetched = await performFetch(extractedUrl);
      if (!fetched) return; // błąd — zostajemy w dialogu z komunikatem
      finalListing = fetched.content;
      if (fetched.source) finalSource = fetched.source;
    }

    saveJob({ listing: finalListing, source: finalSource, savedAt: Date.now() });
    onSubmit(finalListing, finalSource);
    onOpenChange(false);
  };

  const handleClear = () => {
    clearJob();
    setListing("");
    setSource(undefined);
    setFetchState({ status: "idle" });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden border-ink/10 bg-cream-soft p-0 shadow-[0_40px_100px_-30px_rgba(10,14,26,0.35)] sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100vw-3rem)] sm:max-w-[920px]">
        <DialogHeader className="border-b border-ink/8 bg-gradient-to-br from-cream-soft via-cream to-cream-soft px-4 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-saffron/20 sm:size-12 sm:rounded-2xl"
            >
              <Target size={18} weight="duotone" className="text-[color:var(--saffron)] sm:size-[22px]" />
            </span>
            <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
              <DialogTitle className="font-heading text-[clamp(1.1rem,5vw,1.375rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-ink">
                Dopasuj CV do ogłoszenia
              </DialogTitle>
              <p className="text-[12.5px] font-medium leading-relaxed text-ink-muted sm:text-[14px]">
                Wklej <strong className="font-semibold text-ink">link</strong> do ogłoszenia lub
                jego <strong className="font-semibold text-ink">treść</strong>. Pracuś wskaże
                braki i zaproponuje zmiany w CV.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
          {/* Pobierz z linka */}
          {isUrlOnly || extractedUrl ? (
            <FetchPanel
              url={extractedUrl ?? ""}
              state={fetchState}
              onFetch={handleFetchUrl}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted sm:text-[11.5px]">
              Treść ogłoszenia
            </label>
            <textarea
              value={listing}
              onChange={(e) => {
                setListing(e.target.value.slice(0, MAX_LEN));
                if (fetchState.status === "success" || fetchState.status === "error") {
                  setFetchState({ status: "idle" });
                }
              }}
              placeholder="Wklej pełną treść ogłoszenia (min. 50 znaków) lub link do ogłoszenia, np. https://justjoin.it/job/…"
              className="min-h-[180px] max-h-[480px] resize-y rounded-2xl border border-ink/12 bg-cream px-3.5 py-3 font-body text-[16px] font-medium leading-relaxed text-ink shadow-[0_2px_8px_-4px_rgba(10,14,26,0.06)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/70 focus:border-saffron focus:ring-4 focus:ring-saffron/15 sm:min-h-[320px] sm:px-4 sm:py-3.5 sm:text-[14.5px]"
              rows={8}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium sm:gap-3 sm:text-[11.5px]">
              <span className="min-w-0 flex-1 text-ink-muted">
                {isUrlOnly
                  ? "Wykryto link — kliknij „Pobierz treść z linku"
                  : "Wklej opis (min. 50 znaków) lub wklej link"}
              </span>
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  count > MAX_LEN ? "text-[color:var(--rust)]" : "text-ink-muted",
                )}
              >
                {count.toLocaleString("pl-PL")} / 8000
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted sm:text-[11.5px]">
              Skąd ogłoszenie <span className="font-normal normal-case tracking-normal text-ink-muted/70">(opcjonalnie)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(Object.keys(JOB_SOURCE_LABELS) as JobSource[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(source === s ? undefined : s)}
                  className={
                    source === s
                      ? "rounded-full border border-saffron bg-saffron/15 px-3 py-1.5 text-[12.5px] font-semibold text-ink shadow-[0_2px_8px_-4px_rgba(10,14,26,0.1)] sm:px-4 sm:py-2 sm:text-[13px]"
                      : "rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition-[background-color,border-color,color] hover:border-saffron/40 hover:bg-saffron/5 hover:text-ink sm:px-4 sm:py-2 sm:text-[13px]"
                  }
                >
                  {JOB_SOURCE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex shrink-0 flex-col gap-3 border-t border-ink/8 bg-[color-mix(in_oklab,var(--cream)_92%,black_2%)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-5"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          {existing ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-ink-muted transition-colors hover:text-rust sm:text-[12.5px]"
            >
              <X size={13} weight="bold" /> Wyczyść ogłoszenie
            </button>
          ) : (
            <span className="hidden text-[11.5px] text-ink-muted/70 sm:inline">
              Treść jest przechowywana tylko w Twojej sesji.
            </span>
          )}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-[13.5px] font-medium text-ink-muted hover:text-ink sm:flex-initial"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-ink px-4 py-2.5 text-[13px] font-semibold text-cream shadow-[0_4px_14px_-6px_rgba(10,14,26,0.35)] hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)] sm:flex-initial sm:px-5 sm:text-[13.5px]"
            >
              {fetchState.status === "loading" ? (
                <>
                  <Spinner size={15} className="animate-spin" />
                  Pobieram…
                </>
              ) : isUrlOnly && fetchState.status !== "success" ? (
                "Pobierz i analizuj"
              ) : (
                "Przeanalizuj"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FetchPanel({
  url,
  state,
  onFetch,
}: {
  url: string;
  state: FetchState;
  onFetch: () => void;
}) {
  const loading = state.status === "loading";
  const success = state.status === "success";
  const error = state.status === "error";

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-2xl border p-3 shadow-[0_2px_8px_-4px_rgba(10,14,26,0.06)] transition-colors sm:p-4",
        success
          ? "border-[color:var(--jade)]/40 bg-[color-mix(in_oklab,var(--jade)_6%,var(--cream))]"
          : error
            ? "border-rust/30 bg-rust/5"
            : "border-saffron/35 bg-saffron/6",
      )}
    >
      <div className="flex flex-wrap items-start gap-2.5 sm:flex-nowrap sm:items-center sm:gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl sm:size-10",
            success
              ? "bg-[color:var(--jade)]/15"
              : error
                ? "bg-rust/12"
                : "bg-saffron/20",
          )}
        >
          {loading ? (
            <Spinner size={16} className="animate-spin text-[color:var(--saffron)]" />
          ) : success ? (
            <CheckCircle size={16} weight="fill" className="text-[color:var(--jade)]" />
          ) : error ? (
            <WarningOctagon size={16} weight="fill" className="text-[color:var(--rust)]" />
          ) : (
            <LinkIcon size={16} weight="duotone" className="text-[color:var(--saffron)]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight tracking-[-0.005em] text-ink sm:text-[14px]">
            {success
              ? "Pobrano ogłoszenie"
              : error
                ? "Nie udało się pobrać"
                : "Wykryto link do ogłoszenia"}
          </div>
          <div
            className="mt-0.5 truncate text-[11.5px] font-medium text-ink-muted sm:text-[12px]"
            title={url}
          >
            {state.status === "success" && state.hostname
              ? `${state.hostname} · ${state.title || "bez tytułu"}`
              : url}
          </div>
        </div>
        {!loading ? (
          <button
            type="button"
            onClick={onFetch}
            className={cn(
              "inline-flex shrink-0 basis-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12.5px] font-semibold transition-colors sm:basis-auto sm:px-4 sm:text-[13px]",
              success
                ? "border border-ink/15 bg-cream text-ink hover:border-saffron hover:bg-saffron/5"
                : "bg-ink text-cream shadow-[0_4px_14px_-6px_rgba(10,14,26,0.3)] hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)]",
            )}
          >
            {success ? (
              <>
                <ArrowClockwise size={12} weight="bold" /> Pobierz ponownie
              </>
            ) : error ? (
              <>
                <ArrowClockwise size={12} weight="bold" /> Spróbuj ponownie
              </>
            ) : (
              <>
                <DownloadSimple size={12} weight="bold" /> Pobierz z linku
              </>
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="text-[12px] font-medium leading-snug text-ink-soft sm:pl-[52px] sm:text-[12.5px]">
          {state.message}
        </div>
      ) : null}
      {state.status === "success" && state.truncated ? (
        <div className="text-[11.5px] font-medium leading-snug text-ink-muted sm:pl-[52px] sm:text-[12px]">
          Treść została przycięta — sprawdź czy zawiera wszystkie wymagania.
        </div>
      ) : null}
      {state.status === "idle" ? (
        <div className="text-[11.5px] font-medium leading-snug text-ink-muted sm:pl-[52px] sm:text-[12px]">
          Pobiorę treść z polskich portali pracy (pracuj.pl, nofluffjobs, justjoin, olx/praca,
          linkedin/jobs, rocketjobs, theprotocol, praca.pl) i wielu zagranicznych. Link który nie
          jest ofertą pracy zostanie odrzucony{" "}
          <strong className="font-semibold text-ink">po pobraniu i analizie</strong>.
        </div>
      ) : null}
    </div>
  );
}

function composeListing(title: string | undefined, content: string, url: string): string {
  const header = title?.trim() ? `${title.trim()}\n\nŹródło: ${url}\n\n` : `Źródło: ${url}\n\n`;
  return `${header}${content}`;
}
