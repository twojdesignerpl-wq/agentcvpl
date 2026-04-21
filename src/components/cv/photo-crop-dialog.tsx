"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { X, ArrowsOutSimple, ArrowsInSimple } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  shape: "circle" | "square";
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
};

const OUT_SIZE = 480;
const FRAME = 280;

export function PhotoCropDialog({ src, shape, onConfirm, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      imgRef.current = img;
      const baseScale = Math.max(FRAME / img.naturalWidth, FRAME / img.naturalHeight);
      setZoom(baseScale);
      setOffset({ x: 0, y: 0 });
    };
    img.src = src;
  }, [src]);

  const baseScale = natural.w
    ? Math.max(FRAME / natural.w, FRAME / natural.h)
    : 1;
  const minZoom = baseScale;
  const maxZoom = baseScale * 4;

  const clampOffset = (x: number, y: number, z: number) => {
    const dispW = natural.w * z;
    const dispH = natural.h * z;
    const maxX = Math.max(0, (dispW - FRAME) / 2);
    const maxY = Math.max(0, (dispH - FRAME) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offX: offset.x,
      offY: offset.y,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const next = clampOffset(dragRef.current.offX + dx, dragRef.current.offY + dy, zoom);
    setOffset(next);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    dragRef.current = null;
  };

  const onZoomChange = (value: number) => {
    const clamped = Math.max(minZoom, Math.min(maxZoom, value));
    setZoom(clamped);
    setOffset((prev) => clampOffset(prev.x, prev.y, clamped));
  };

  const confirm = () => {
    if (!imgRef.current || !natural.w) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_SIZE;
    canvas.height = OUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = OUT_SIZE / FRAME;
    const drawW = natural.w * zoom * scale;
    const drawH = natural.h * zoom * scale;
    const drawX = OUT_SIZE / 2 - drawW / 2 + offset.x * scale;
    const drawY = OUT_SIZE / 2 - drawH / 2 + offset.y * scale;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUT_SIZE, OUT_SIZE);
    ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);

    onConfirm(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-label="Kadrowanie zdjęcia"
    >
      <div className="w-[420px] max-w-[92vw] rounded-2xl bg-card p-5 shadow-2xl">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[15px] font-semibold">Kadrowanie zdjęcia</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Zamknij"
            className="text-ink-muted hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>

        <div className="relative mx-auto" style={{ width: FRAME, height: FRAME }}>
          <div
            className="relative h-full w-full cursor-grab overflow-hidden bg-[color:var(--cream-deep)] touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {natural.w ? (
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  width: natural.w,
                  height: natural.h,
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transformOrigin: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-none pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ) : null}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 ring-[2px] ring-[color:var(--saffron)]",
                shape === "circle" ? "rounded-full" : "rounded-md",
              )}
              style={{
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ArrowsInSimple size={14} className="text-ink-muted" />
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={(maxZoom - minZoom) / 100 || 0.01}
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="accent-[var(--saffron)] flex-1 cursor-pointer"
            aria-label="Zoom zdjęcia"
          />
          <ArrowsOutSimple size={14} className="text-ink-muted" />
        </div>

        <p className="mt-3 text-[11px] text-ink-muted text-center">
          Przeciągnij, aby dopasować ramę. Kadr zapisywany jest w formacie 1:1 dla CV.
        </p>

        <footer className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-[12px] text-ink-muted hover:text-ink"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={confirm}
            className="rounded-md bg-ink px-4 py-2 text-[12px] font-semibold text-cream hover:opacity-90"
          >
            Zapisz kadr
          </button>
        </footer>
      </div>
    </div>
  );
}
