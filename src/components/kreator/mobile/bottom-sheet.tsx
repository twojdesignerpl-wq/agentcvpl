"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  contentClassName?: string;
};

const DRAWER_EASE = [0.32, 0.72, 0, 1] as const;

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeight = "85dvh",
  className,
  contentClassName,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.classList.add("body-lock");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("body-lock");
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] backdrop-blur-sm"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: DRAWER_EASE }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 600) onClose();
            }}
            style={{ maxHeight, touchAction: "none" }}
            className={cn(
              "relative flex w-full max-w-[560px] flex-col rounded-t-3xl border-t border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] shadow-[0_-12px_48px_-12px_rgba(10,14,26,0.35)]",
              className,
            )}
          >
            <div className="flex shrink-0 flex-col items-center pt-2 pb-1" style={{ touchAction: "none" }}>
              <div
                aria-hidden
                className="h-1 w-10 rounded-full bg-[color:color-mix(in_oklab,var(--ink)_22%,transparent)]"
              />
            </div>
            {title ? (
              <div className="flex items-center justify-between px-5 pb-3 pt-1">
                <h2 id={titleId} className="font-display text-[1.05rem] font-semibold tracking-tight">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Zamknij"
                  className="tap-target -mr-2 inline-flex items-center justify-center rounded-full text-ink/70 transition-colors hover:text-ink"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            ) : null}
            <div
              className={cn(
                "flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-1",
                contentClassName,
              )}
              style={{ touchAction: "pan-y" }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
