"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, SignIn } from "@phosphor-icons/react/dist/ssr";
import { useIsClient } from "@/hooks/use-is-client";
import { LoginButtons } from "./login-buttons";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  redirectTo?: string;
};

/**
 * Modal wyświetlany gdy API route zwraca 401 (np. export PDF bez auth).
 * Używa tego samego `LoginButtons` co `/zaloguj` — po zalogowaniu user wraca
 * do kreatora z zachowanym localStorage CV.
 */
export function RequireLoginModal({
  open,
  onClose,
  title = "Zaloguj się, aby pobrać CV",
  message = "Twoje CV zostanie zapisane — synchronizujemy je z kontem. Darmowe, bez karty.",
  redirectTo = "/kreator",
}: Props) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!isClient || typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-[color:color-mix(in_oklab,var(--ink)_60%,transparent)] backdrop-blur-sm"
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="require-login-title"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="relative flex w-full max-w-[440px] flex-col gap-5 rounded-t-3xl border-t border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-[0_-16px_48px_-16px_rgba(10,14,26,0.35)] sm:rounded-3xl sm:pb-6"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] text-ink"
              >
                <SignIn size={18} weight="bold" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="require-login-title" className="font-display text-[1.25rem] font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1 text-[13.5px] leading-snug text-[color:var(--ink-soft)]">{message}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="tap-target -mr-2 -mt-2 inline-flex items-center justify-center rounded-full text-ink/60 hover:text-ink"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
            <LoginButtons redirectTo={redirectTo} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
