"use client";

import { motion, useReducedMotion } from "motion/react";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { cn } from "@/lib/utils";

type Props = {
  onOpen: () => void;
  className?: string;
};

/**
 * Floating Pracuś button — szybki dostęp do chatu AI z dowolnego miejsca kreatora mobilnego
 * (Editor i Styl). Pozycja: bottom-right, nad bottom-nav, respektuje safe-area.
 */
export function PracusFab({ onOpen, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Zapytaj Pracusia"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "tap-target fixed right-4 z-40 inline-flex size-14 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-[color:var(--cream)] shadow-[0_12px_32px_-8px_rgba(10,14,26,0.28)] transition-colors hover:border-[color:var(--ink)]",
        className,
      )}
      style={{
        bottom: `calc(var(--bottom-nav-h, 4rem) + env(safe-area-inset-bottom, 0px) + 12px)`,
      }}
    >
      {/* Pulsing saffron ring (wyciszone w reduced-motion) */}
      {!reduced ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-[color:var(--saffron)]"
          animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      <PracusMark size={32} online />
    </motion.button>
  );
}
