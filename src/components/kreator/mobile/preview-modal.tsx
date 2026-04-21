"use client";

import { useEffect, useRef, useState, type RefObject, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  ArrowsOutSimple,
  ArrowsInSimple,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react/dist/ssr";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  pageRef: RefObject<HTMLDivElement | null>;
  bodyRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  footer?: ReactNode;
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795275591;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;

export function MobilePreviewModal({ open, onClose, children }: Props) {
  const isClient = useIsClient();
  const [containerWidth, setContainerWidth] = useState(0);
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setManualZoom(null);
    onClose();
  };

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

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      setContainerWidth(el.clientWidth);
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  if (!isClient || typeof window === "undefined") return null;

  const horizontalPadding = 16;
  const fitZoom =
    containerWidth > 0
      ? Math.max(0.2, Math.min(1.3, (containerWidth - horizontalPadding * 2) / A4_WIDTH_PX))
      : 0.85;
  const zoom = manualZoom ?? fitZoom;
  const scaledWidth = A4_WIDTH_PX * zoom;
  const scaledHeight = A4_HEIGHT_PX * zoom;

  const incZoom = () => setManualZoom((z) => Math.min(2, (z ?? fitZoom) + 0.15));
  const decZoom = () => setManualZoom((z) => Math.max(0.3, (z ?? fitZoom) - 0.15));
  const resetZoom = () => setManualZoom(null);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="preview-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[color:color-mix(in_oklab,var(--ink)_96%,transparent)]"
        >
          <header className="safe-top flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Zamknij podgląd"
              className="tap-target inline-flex items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm hover:bg-white/15"
            >
              <X size={18} weight="bold" />
            </button>
            <div className="flex items-center gap-2">
              <span className="mono-label text-[0.58rem] text-cream/70 tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={decZoom}
                aria-label="Pomniejsz"
                className="tap-target inline-flex items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm hover:bg-white/15"
              >
                <MagnifyingGlassMinus size={15} weight="bold" />
              </button>
              <button
                type="button"
                onClick={incZoom}
                aria-label="Powiększ"
                className="tap-target inline-flex items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm hover:bg-white/15"
              >
                <MagnifyingGlassPlus size={15} weight="bold" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                aria-label="Dopasuj do ekranu"
                className={cn(
                  "tap-target inline-flex items-center justify-center rounded-full text-cream backdrop-blur-sm transition-colors",
                  manualZoom === null ? "bg-saffron/30" : "bg-white/10 hover:bg-white/15",
                )}
              >
                {manualZoom === null ? (
                  <ArrowsOutSimple size={15} weight="bold" />
                ) : (
                  <ArrowsInSimple size={15} weight="bold" />
                )}
              </button>
            </div>
          </header>

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 overflow-auto overscroll-contain"
            style={{ touchAction: "pinch-zoom pan-x pan-y" }}
          >
            <div
              className="flex items-start justify-center px-4 py-6"
              style={{ minWidth: scaledWidth + 32, minHeight: "100%" }}
            >
              <div
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
              >
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    width: `${A4_WIDTH_MM}mm`,
                    height: `${A4_HEIGHT_MM}mm`,
                  }}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>

          <footer className="safe-bottom shrink-0 border-t border-white/10 bg-black/20 px-4 py-2 text-center">
            <p className="mono-label text-[0.54rem] text-cream/55">
              Pinch żeby powiększyć · scroll pionowo · tap X żeby wrócić
            </p>
          </footer>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
