"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Sparkle,
  Target,
  MagnifyingGlass,
  Trophy,
  Briefcase,
  ListChecks,
  Scissors,
  TextT,
} from "@phosphor-icons/react/dist/ssr";

type PhosphorIcon = typeof Sparkle;
import { PracusMark } from "./icon";
import { useCVStore } from "@/lib/cv/store";

export type QuickAction = {
  id: string;
  label: string;
  prompt: string;
  Icon: PhosphorIcon;
  priority?: "hot" | "normal";
};

/**
 * Kontekstowe quick-actions — wybrane heurystycznie z aktualnego stanu CV.
 * Zawsze 4-6 akcji, max 2 "hot" (czerwona obwódka dla krytycznych braków).
 */
export function useDynamicQuickActions(opts?: {
  overflowed?: boolean;
  hasJobContext?: boolean;
}): QuickAction[] {
  const cv = useCVStore((s) => s.cv);

  return useMemo(() => {
    const actions: QuickAction[] = [];

    // HOT: gdy CV wylało się poza 1 stronę
    if (opts?.overflowed) {
      actions.push({
        id: "shorten",
        label: "Skróć CV o 20%",
        prompt:
          "Moje CV nie mieści się na 1 stronę A4. Skróć najdłuższe opisy stanowisk, zachowując mierzalne efekty i liczby.",
        Icon: Scissors,
        priority: "hot",
      });
    }

    // HOT: pusty profil
    const profileEmpty = !cv.profile.trim();
    if (profileEmpty) {
      actions.push({
        id: "write-profile",
        label: "Napisz mi podsumowanie",
        prompt:
          "Napisz mi profesjonalne podsumowanie zawodowe — 3-4 zdania w pierwszej osobie, z mierzalnymi osiągnięciami, na podstawie mojego doświadczenia.",
        Icon: TextT,
        priority: "hot",
      });
    }

    // Employment bez description
    const emptyDescEmp = cv.employment.find(
      (e) => !e.description.trim() && (e.position || e.company),
    );
    if (emptyDescEmp) {
      actions.push({
        id: "fill-emp-desc",
        label: "Dopisz opis stanowiska",
        prompt: `Dopisz opis mojego stanowiska ${emptyDescEmp.position || "(bez nazwy)"} w ${emptyDescEmp.company || "(bez firmy)"} — 3-4 bullety z silnymi czasownikami i liczbami.`,
        Icon: Briefcase,
      });
    }

    // Mało skill-i
    if (cv.skills.professional.length < 5) {
      actions.push({
        id: "add-skills",
        label: "Zasugeruj umiejętności",
        prompt:
          "Zasugeruj mi 5-8 konkretnych umiejętności zawodowych (narzędzia, systemy, metodyki) pasujących do mojego doświadczenia. Dodaj je do grupy zawodowe.",
        Icon: ListChecks,
      });
    }

    // Brak liczb w employment descriptions
    const hasAnyMetric = cv.employment.some((e) =>
      /\d+\s*(%|pln|osób|mln|tys|szt|godz|min)|\d+x/i.test(e.description),
    );
    if (!hasAnyMetric && cv.employment.length > 0) {
      actions.push({
        id: "add-metrics",
        label: "Dopisz mierzalne efekty",
        prompt:
          "Dopisz mierzalne efekty do moich opisów stanowisk. Jeśli brakuje Ci danych, zadaj mi po 2-3 konkretne pytania o liczby.",
        Icon: Trophy,
      });
    }

    // Dopasuj do ogłoszenia — zawsze
    actions.push({
      id: "match-job",
      label: opts?.hasJobContext ? "Pokaż co brakuje do ogłoszenia" : "Dopasuj do ogłoszenia",
      prompt: opts?.hasJobContext
        ? "Pokaż konkretnie czego jeszcze brakuje w moim CV względem wklejonego ogłoszenia i zaproponuj zmiany."
        : "Zaraz wkleję ogłoszenie o pracę. Powiedz, które kompetencje pasują, czego brakuje i jakie słowa kluczowe ATS muszą się pojawić.",
      Icon: Target,
    });

    // ATS check — zawsze
    actions.push({
      id: "ats-check",
      label: "Sprawdź ATS",
      prompt:
        "Sprawdź moje CV pod kątem systemów ATS: jakie słowa kluczowe są kluczowe dla mojej branży, czego brakuje, co można wzmocnić.",
      Icon: MagnifyingGlass,
    });

    // Improve general tone gdy profile istnieje
    if (cv.profile.trim()) {
      actions.push({
        id: "improve-profile",
        label: "Popraw profil",
        prompt:
          "Popraw moje aktualne podsumowanie zawodowe — zachowaj fakty, wyeliminuj żargon, dodaj mierzalne osiągnięcia.",
        Icon: Sparkle,
      });
    }

    // Cap: max 6 akcji, hot na górze
    const hot = actions.filter((a) => a.priority === "hot");
    const normal = actions.filter((a) => a.priority !== "hot");
    return [...hot, ...normal].slice(0, 6);
  }, [cv, opts?.overflowed, opts?.hasJobContext]);
}

type Props = {
  onPick: (prompt: string) => void;
  compact?: boolean;
  overflowed?: boolean;
  hasJobContext?: boolean;
};

export function Suggestions({ onPick, compact, overflowed, hasJobContext }: Props) {
  const actions = useDynamicQuickActions({ overflowed, hasJobContext });

  return (
    <div className="hide-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-x-visible">
      {actions.map(({ id, label, prompt, Icon, priority }) => (
        <motion.button
          key={id}
          type="button"
          onClick={() => onPick(prompt)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className={
            priority === "hot"
              ? "group inline-flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border border-rust/40 bg-[color-mix(in_oklab,var(--rust)_8%,var(--cream))] px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)] transition-[box-shadow,border-color,background-color] hover:border-rust hover:bg-[color-mix(in_oklab,var(--rust)_14%,var(--cream))] hover:shadow-[0_4px_14px_-6px_rgba(10,14,26,0.16)] sm:gap-2 sm:px-4 sm:py-2 sm:text-[13.5px]"
              : compact
                ? "group inline-flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-[0_1px_4px_-2px_rgba(10,14,26,0.06)] transition-[box-shadow,border-color,background-color] hover:border-saffron hover:bg-saffron/8 hover:shadow-[0_3px_10px_-4px_rgba(10,14,26,0.14)] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[13px]"
                : "group inline-flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)] transition-[box-shadow,border-color,background-color] hover:border-saffron hover:bg-saffron/8 hover:shadow-[0_4px_14px_-6px_rgba(10,14,26,0.16)] sm:gap-2 sm:px-4 sm:py-2 sm:text-[13.5px]"
          }
        >
          <Icon
            size={compact ? 13 : 14}
            weight="duotone"
            className={
              priority === "hot"
                ? "text-[color:var(--rust)]"
                : "text-ink-muted group-hover:text-saffron transition-colors"
            }
          />
          {label}
        </motion.button>
      ))}
    </div>
  );
}

export function WelcomeCard({
  onPick,
  onOpenJobDialog,
  hasJobContext,
  overflowed,
}: {
  onPick: (p: string) => void;
  onOpenJobDialog?: () => void;
  hasJobContext?: boolean;
  overflowed?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative flex flex-col items-start gap-3.5 overflow-hidden rounded-3xl border border-ink/8 bg-gradient-to-br from-cream-soft via-cream to-cream-soft p-4 shadow-[0_10px_40px_-20px_rgba(10,14,26,0.18)] sm:gap-5 sm:p-5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--saffron)_22%,transparent)_0%,transparent_70%)] blur-xl"
      />
      <div className="relative flex items-center gap-3 sm:gap-4">
        <PracusMark size={40} online className="shrink-0 sm:hidden" />
        <PracusMark size={48} online className="hidden shrink-0 sm:block" />
        <div className="flex min-w-0 flex-col">
          <p className="font-heading text-[clamp(1.1rem,5vw,1.375rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink">
            Cześć, jestem <span className="text-[color:var(--saffron)]">Pracuś</span>.
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-ink-muted sm:text-[13px]">
            15 lat rekrutacji · polski rynek pracy
          </p>
        </div>
      </div>

      <p className="relative text-[13.5px] font-medium leading-relaxed text-ink-soft sm:text-[15px]">
        Pomogę Ci napisać CV, które dostaje rozmowy. Proponuję konkretne zmiany — ty decydujesz,
        czy zastosować.
      </p>

      {/* PRIMARY CTA: job listing — Pracuś działa najlepiej z docelowym ogłoszeniem */}
      {onOpenJobDialog && !hasJobContext ? (
        <motion.button
          type="button"
          onClick={onOpenJobDialog}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="relative flex w-full items-start gap-2.5 rounded-2xl border-2 border-dashed border-saffron/50 bg-saffron/8 px-3 py-3 text-left shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)] transition-colors hover:border-saffron hover:bg-saffron/12 sm:gap-3 sm:px-4 sm:py-3.5"
        >
          <Target size={18} weight="duotone" className="mt-0.5 shrink-0 text-[color:var(--saffron)] sm:size-[22px]" />
          <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
            <span className="flex flex-wrap items-center gap-1.5 font-heading text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[15px]">
              Wklej ogłoszenie pracy
              <span className="inline-flex items-center rounded-full bg-saffron/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink sm:px-2 sm:text-[10px]">
                zalecane
              </span>
            </span>
            <span className="text-[12px] font-medium leading-snug text-ink-muted sm:text-[13px]">
              Dopasuję słowa kluczowe ATS i wskażę braki. Wklej treść ogłoszenia{" "}
              <strong className="font-semibold text-ink">lub link</strong>.
            </span>
          </div>
        </motion.button>
      ) : null}

      <p className="relative text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted sm:text-[12.5px]">
        {hasJobContext ? "Albo od razu wybierz" : "Możesz też zacząć od"}
      </p>

      <div className="relative -mx-4 w-[calc(100%+2rem)] px-4 sm:mx-0 sm:w-full sm:px-0">
        <Suggestions onPick={onPick} overflowed={overflowed} hasJobContext={hasJobContext} />
      </div>
    </motion.div>
  );
}
