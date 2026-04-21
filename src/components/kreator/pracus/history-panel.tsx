"use client";

import { useState } from "react";
import { ClockCounterClockwise, ArrowClockwise, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "motion/react";
import { useCVStore } from "@/lib/cv/store";
import { useHistoryStore, formatSnapshotTime } from "@/lib/cv/history-store";

export function HistoryButton() {
  const [open, setOpen] = useState(false);
  const history = useHistoryStore((s) => s.history);
  const restore = useHistoryStore((s) => s.restore);
  const remove = useHistoryStore((s) => s.remove);
  const clearAll = useHistoryStore((s) => s.clear);
  const setCV = useCVStore((s) => s.setCV);

  const handleRestore = (id: string) => {
    const cv = restore(id);
    if (cv) {
      // Snapshot CURRENT state first (żeby user mógł wrócić)
      useHistoryStore.getState().push("Przed cofnięciem", useCVStore.getState().cv);
      setCV(cv);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={history.length === 0}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream px-3.5 py-2 text-[13px] font-medium text-ink hover:border-saffron hover:bg-saffron/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={`Historia zmian — ${history.length} pozycji`}
      >
        <ClockCounterClockwise size={14} weight="bold" className="text-ink-muted" />
        Historia{history.length > 0 ? ` (${history.length})` : ""}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-label="Historia zmian Pracusia"
              className="absolute right-4 top-[60px] z-50 w-[320px] max-h-[520px] overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft shadow-[0_16px_48px_-24px_rgba(10,14,26,0.32)] flex flex-col"
            >
              <header className="flex items-center justify-between px-4 py-2.5 border-b border-ink/8">
                <span className="font-heading text-[13px] font-semibold text-ink">
                  Historia wersji CV
                </span>
                <div className="flex gap-1">
                  {history.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => clearAll()}
                      className="text-[11px] text-ink-muted hover:text-rust transition-colors"
                      aria-label="Wyczyść całą historię"
                    >
                      wyczyść
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-ink-muted hover:text-ink transition-colors ml-2"
                    aria-label="Zamknij"
                  >
                    <X size={13} weight="bold" />
                  </button>
                </div>
              </header>

              <div className="overflow-auto flex-1 p-2">
                {history.length === 0 ? (
                  <div className="p-4 text-[12px] text-ink-muted text-center">
                    Historia pusta. Zmiany zastosowane przez Pracusia będą tu widoczne.
                  </div>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {history.map((snap) => (
                      <li
                        key={snap.id}
                        className="rounded-lg border border-ink/6 bg-cream p-2.5 flex items-center gap-2 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-medium text-ink truncate">
                            {snap.label}
                          </div>
                          <div className="text-[10.5px] text-ink-muted">
                            {formatSnapshotTime(snap.timestamp)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRestore(snap.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-cream-soft px-2 py-1 text-[10.5px] font-medium text-ink hover:border-saffron transition-colors"
                          aria-label={`Cofnij do: ${snap.label}`}
                        >
                          <ArrowClockwise size={10} weight="bold" /> Cofnij
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(snap.id)}
                          className="text-ink-muted hover:text-rust transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Usuń snapshot"
                        >
                          <Trash size={12} weight="regular" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
