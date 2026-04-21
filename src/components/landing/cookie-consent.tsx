"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cookie } from "@phosphor-icons/react/dist/ssr";

const STORAGE_KEY = "agentcv-cookies-consent-v1";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // SSR boundary: localStorage jest dostępny dopiero po hydracji,
    // więc inicjalny check musi żyć w efekcie (setState OK).
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setShow(true); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {
      setShow(true);
    }
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // storage blocked → zapamiętaj tylko w sesji
    }
    setShow(false);
  };

  const acceptAll = () =>
    save({ essential: true, analytics: true, marketing: true, timestamp: Date.now() });

  const rejectOptional = () =>
    save({ essential: true, analytics: false, marketing: false, timestamp: Date.now() });

  const saveSelected = () =>
    save({ essential: true, analytics, marketing, timestamp: Date.now() });

  return (
    <AnimatePresence>
      {show ? (
        <motion.aside
          initial={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          role="dialog"
          aria-label="Zgoda na cookies"
          aria-modal="false"
          className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-[760px] rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] p-5 shadow-[0_24px_72px_-24px_rgba(10,14,26,0.32),0_2px_8px_-2px_rgba(10,14,26,0.08)] md:inset-x-auto md:left-8 md:right-8 md:bottom-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] text-[color:var(--ink)]"
            >
              <Cookie size={20} weight="duotone" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-[17px] font-semibold text-ink leading-tight tracking-[-0.01em]">
                Cookies — wybierz, co akceptujesz
              </h2>
              <p className="mt-1.5 text-[13px] text-ink-muted leading-snug">
                Używamy niezbędnych cookies do działania kreatora (autosave CV, sesja logowania
                Google/Facebook). Analityczne i marketingowe — tylko jeśli się zgodzisz. Szczegóły
                w{" "}
                <a
                  href="/polityka-prywatnosci"
                  className="text-ink underline underline-offset-2 hover:text-[color:var(--saffron)] transition-colors"
                >
                  polityce prywatności
                </a>
                .
              </p>

              {expanded ? (
                <ul className="mt-4 flex flex-col gap-2">
                  <CategoryRow
                    title="Niezbędne"
                    description="Autosave CV, sesja logowania (Supabase Auth) — bez tego nic nie działa."
                    locked
                  />
                  <CategoryRow
                    title="Analityczne"
                    description="Vercel Analytics — anonimowe odwiedziny, żebyśmy widzieli co poprawiać."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <CategoryRow
                    title="Marketingowe"
                    description="Aktualnie nie używamy — zostawione na przyszłość."
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--ink)] px-4 py-2 text-[12.5px] font-semibold text-[color:var(--cream)] transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
                >
                  Akceptuj wszystkie
                </button>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-cream px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-[color:var(--ink)]"
                >
                  Tylko niezbędne
                </button>
                {expanded ? (
                  <button
                    type="button"
                    onClick={saveSelected}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--saffron)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--saffron)_10%,var(--cream))] px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-[color:var(--saffron)]"
                  >
                    Zapisz wybór
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-2 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    Dostosuj
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

type CategoryRowProps = {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  locked?: boolean;
};

function CategoryRow({ title, description, checked, onChange, locked }: CategoryRowProps) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-cream px-3 py-2">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink leading-tight">{title}</p>
        <p className="mt-0.5 text-[11.5px] text-ink-muted leading-snug">{description}</p>
      </div>
      {locked ? (
        <span className="shrink-0 rounded-full bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
          Zawsze
        </span>
      ) : (
        <ToggleSwitch checked={Boolean(checked)} onChange={onChange ?? (() => undefined)} label={title} />
      )}
    </li>
  );
}

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked
          ? "bg-[color:var(--jade)]"
          : "bg-[color:color-mix(in_oklab,var(--ink)_14%,transparent)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
