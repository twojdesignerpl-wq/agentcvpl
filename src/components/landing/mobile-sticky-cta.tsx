"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { useIsClient } from "@/hooks/use-is-client";

type Props = {
  href: string;
  label: string;
  subLabel?: string;
  showAfterPx?: number;
  storageKey?: string;
};

function readPersistedDismissed(storageKey?: string): boolean {
  if (!storageKey || typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(storageKey) === "dismissed";
  } catch {
    return false;
  }
}

export function MobileStickyCta({
  href,
  label,
  subLabel = "Pierwsze CV za darmo",
  showAfterPx = 480,
  storageKey,
}: Props) {
  const isClient = useIsClient();
  const [show, setShow] = useState(false);
  const [dismissedLocal, setDismissedLocal] = useState(false);
  const dismissed = dismissedLocal || (isClient && readPersistedDismissed(storageKey));

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > showAfterPx);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [showAfterPx]);

  const dismiss = () => {
    setDismissedLocal(true);
    if (storageKey && typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(storageKey, "dismissed");
      } catch {
        // ignore
      }
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-2 lg:hidden"
        >
          <div className="mx-auto flex max-w-[520px] items-center gap-2 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_96%,transparent)] p-2 pr-3 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.35)] backdrop-blur-md">
            <Link
              href={href}
              className="tap-target flex flex-1 items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-cream transition-opacity hover:opacity-95 active:scale-[0.99]"
            >
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate text-[14px] font-semibold tracking-tight">
                  {label}
                </span>
                <span className="mono-label mt-0.5 block truncate text-[0.56rem] text-[color:var(--cream)]/55">
                  {subLabel}
                </span>
              </span>
              <ArrowRight size={16} weight="bold" className="shrink-0" />
            </Link>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Zamknij pasek"
              className="tap-target inline-flex shrink-0 items-center justify-center rounded-full text-[color:var(--ink-muted)] hover:bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] hover:text-ink"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
