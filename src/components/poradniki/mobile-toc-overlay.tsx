"use client";

import { useEffect, useState } from "react";
import { ListBullets, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";
import type { PoradnikBlock } from "@/lib/poradniki/data";
import { cn } from "@/lib/utils";

export function MobileTocOverlay({
  blocks,
}: {
  blocks: ReadonlyArray<PoradnikBlock>;
}) {
  const [open, setOpen] = useState(false);
  const h2s = blocks.filter(
    (b): b is Extract<PoradnikBlock, { kind: "h2" }> => b.kind === "h2",
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (h2s.length < 3) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Pokaż spis treści"
        className={cn(
          "safe-bottom tap-target fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] px-4 py-2.5 text-[13px] font-semibold text-[color:var(--ink)] shadow-[0_12px_32px_-12px_rgba(10,14,26,0.35)] backdrop-blur-md transition-transform active:scale-95 lg:hidden",
        )}
      >
        <ListBullets size={16} weight="bold" />
        Spis treści
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] flex items-end lg:hidden"
          >
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] backdrop-blur-sm"
              aria-hidden
            />
            <motion.nav
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              aria-label="Spis treści"
              className="relative flex max-h-[80dvh] w-full flex-col rounded-t-3xl border-t border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] shadow-[0_-16px_48px_-16px_rgba(10,14,26,0.35)]"
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <h2 className="font-display text-[1.05rem] font-semibold tracking-tight">
                  Spis treści
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zamknij"
                  className="tap-target -mr-2 inline-flex items-center justify-center rounded-full text-ink/70 transition-colors hover:text-ink"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
              <ol className="flex-1 space-y-1 overflow-y-auto px-3 pb-[calc(env(safe-area-inset-bottom,0px)+20px)]">
                {h2s.map((h, idx) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={() => setOpen(false)}
                      className="tap-target flex items-baseline gap-3 rounded-xl px-3 py-3 text-[14.5px] leading-snug text-[color:var(--ink-soft)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)] hover:text-[color:var(--ink)]"
                    >
                      <span className="mono-label shrink-0 text-[0.65rem] text-[color:var(--ink-muted)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium">{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
