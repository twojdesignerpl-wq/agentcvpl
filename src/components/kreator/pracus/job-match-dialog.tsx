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
      <DialogContent className="max-w-[920px] w-[calc(100vw-3rem)] p-0 bg-cream-soft border-ink/10 overflow-hidden shadow-[0_40px_100px_-30px_rgba(10,14,26,0.35)]">
        <DialogHeader className="px-8 pt-7 pb-5 border-b border-ink/8 bg-gradient-to-br from-cream-soft via-cream to-cream-soft">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="shrink-0 size-12 rounded-2xl bg-saffron/20 grid place-items-center"
            >
              <Target size={22} weight="duotone" className="text-[color:var(--saffron)]" />
            </span>
            <div className="flex flex-col gap-1.5 min-w-0">
              <DialogTitle className="font-heading text-[22px] font-semibold text-ink leading-[1.15] tracking-[-0.015em]">
                Dopasuj CV do ogłoszenia
              </DialogTitle>
              <p className="text-[14px] text-ink-muted leading-relaxed font-medium">
                Wklej <strong className="text-ink font-semibold">link</strong> do ogłoszenia lub
                jego <strong className="text-ink font-semibold">treść</strong>. Pracuś
                przeanalizuje dopasowanie, wskaże braki i zaproponuje konkretne zmiany w CV.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 flex flex-col gap-6 max-h-[68vh] overflow-y-auto">
          {/* Pobierz z linka */}
          {isUrlOnly || extractedUrl ? (
            <FetchPanel
              url={extractedUrl ?? ""}
              state={fetchState}
              onFetch={handleFetchUrl}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <label className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
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
              placeholder="Wklej pełną treść ogłoszenia (wymagania, obowiązki, oferta — min. 50 znaków) lub sam link do ogłoszenia, np. https://justjoin.it/job/..."
              className="rounded-2xl border border-ink/12 bg-cream px-4 py-3.5 text-[14.5px] leading-relaxed text-ink placeholder:text-ink-muted/70 focus:border-saffron focus:ring-4 focus:ring-saffron/15 outline-none resize-y min-h-[320px] max-h-[480px] font-body font-medium shadow-[0_2px_8px_-4px_rgba(10,14,26,0.06)] transition-[border-color,box-shadow]"
              rows={12}
            />
            <div className="flex justify-between items-center gap-3 text-[11.5px] font-medium">
              <span className="text-ink-muted">
                {isUrlOnly
                  ? "Wykryto link — kliknij „Pobierz treść z linku”, aby zaciągnąć ogłoszenie"
                  : "Wklej opis (min. 50 znaków) lub wklej link do ogłoszenia"}
              </span>
              <span className={count > MAX_LEN ? "text-[color:var(--rust)]" : "text-ink-muted"}>
                {count.toLocaleString("pl-PL")} / 8000
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Skąd ogłoszenie <span className="font-normal normal-case tracking-normal text-ink-muted/70">(opcjonalnie)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(JOB_SOURCE_LABELS) as JobSource[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(source === s ? undefined : s)}
                  className={
                    source === s
                      ? "rounded-full border border-saffron bg-saffron/15 px-4 py-2 text-[13px] font-semibold text-ink shadow-[0_2px_8px_-4px_rgba(10,14,26,0.1)]"
                      : "rounded-full border border-ink/10 bg-cream px-4 py-2 text-[13px] font-medium text-ink-soft hover:border-saffron/40 hover:text-ink hover:bg-saffron/5 transition-[background-color,border-color,color]"
                  }
                >
                  {JOB_SOURCE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-[color-mix(in_oklab,var(--cream)_92%,black_2%)] border-t border-ink/8 flex justify-between items-center gap-4">
          {existing ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted hover:text-rust transition-colors whitespace-nowrap"
            >
              <X size={13} weight="bold" /> Wyczyść ogłoszenie
            </button>
          ) : (
            <span className="text-[11.5px] text-ink-muted/70">
              Treść jest przechowywana tylko w Twojej sesji.
            </span>
          )}
          <div className="flex gap-2.5 items-center shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-ink-muted hover:text-ink text-[13.5px] font-medium"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="bg-ink text-cream hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)] inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold shadow-[0_4px_14px_-6px_rgba(10,14,26,0.35)]"
            >
              {fetchState.status === "loading" ? (
                <>
                  <Spinner size={15} className="animate-spin" />
                  Pobieram treść…
                </>
              ) : isUrlOnly && fetchState.status !== "success" ? (
                "Pobierz i przeanalizuj"
              ) : (
                "Przeanalizuj dopasowanie"
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
        "rounded-2xl border p-4 flex flex-col gap-2.5 transition-colors shadow-[0_2px_8px_-4px_rgba(10,14,26,0.06)]",
        success
          ? "border-[color:var(--jade)]/40 bg-[color-mix(in_oklab,var(--jade)_6%,var(--cream))]"
          : error
            ? "border-rust/30 bg-rust/5"
            : "border-saffron/35 bg-saffron/6",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "shrink-0 size-10 rounded-xl grid place-items-center",
            success
              ? "bg-[color:var(--jade)]/15"
              : error
                ? "bg-rust/12"
                : "bg-saffron/20",
          )}
        >
          {loading ? (
            <Spinner size={18} className="text-[color:var(--saffron)] animate-spin" />
          ) : success ? (
            <CheckCircle size={18} weight="fill" className="text-[color:var(--jade)]" />
          ) : error ? (
            <WarningOctagon size={18} weight="fill" className="text-[color:var(--rust)]" />
          ) : (
            <LinkIcon size={18} weight="duotone" className="text-[color:var(--saffron)]" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-ink leading-tight tracking-[-0.005em]">
            {success
              ? "Pobrano ogłoszenie"
              : error
                ? "Nie udało się pobrać"
                : "Wykryto link do ogłoszenia"}
          </div>
          <div className="text-[12px] font-medium text-ink-muted truncate mt-0.5" title={url}>
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
              "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
              success
                ? "border border-ink/15 bg-cream text-ink hover:border-saffron hover:bg-saffron/5"
                : "bg-ink text-cream hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)] shadow-[0_4px_14px_-6px_rgba(10,14,26,0.3)]",
            )}
          >
            {success ? (
              <>
                <ArrowClockwise size={13} weight="bold" /> Pobierz ponownie
              </>
            ) : error ? (
              <>
                <ArrowClockwise size={13} weight="bold" /> Spróbuj ponownie
              </>
            ) : (
              <>
                <DownloadSimple size={13} weight="bold" /> Pobierz treść z linku
              </>
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="text-[12.5px] text-ink-soft leading-snug pl-[52px] font-medium">{state.message}</div>
      ) : null}
      {state.status === "success" && state.truncated ? (
        <div className="text-[12px] text-ink-muted leading-snug pl-[52px] font-medium">
          Treść została przycięta — sprawdź czy zawiera wszystkie wymagania.
        </div>
      ) : null}
      {state.status === "idle" ? (
        <div className="text-[12px] text-ink-muted leading-snug pl-[52px] font-medium">
          Pobiorę treść z dowolnego polskiego portalu pracy (pracuj.pl, nofluffjobs, justjoin,
          olx/praca, linkedin/jobs, rocketjobs, bulldogjob, theprotocol, aplikuj, praca.pl i
          inne) oraz wielu zagranicznych. Link który nie prowadzi do oferty pracy zostanie
          odrzucony <strong className="text-ink font-semibold">po pobraniu i analizie treści</strong>.
        </div>
      ) : null}
    </div>
  );
}

function composeListing(title: string | undefined, content: string, url: string): string {
  const header = title?.trim() ? `${title.trim()}\n\nŹródło: ${url}\n\n` : `Źródło: ${url}\n\n`;
  return `${header}${content}`;
}
