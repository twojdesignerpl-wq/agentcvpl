"use client";

import type { RefObject } from "react";
import {
  ArrowCounterClockwise,
  Check,
  Minus,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { AnimatedPopover } from "./animated-popover";

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2.0;
export const ZOOM_STEP = 0.1;
export const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export function clampZoom(value: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value * 100) / 100));
}

type Props = {
  zoom: number;
  mode: "auto" | "manual";
  presetOpen: boolean;
  onPresetOpenChange: (open: boolean) => void;
  onZoomChange: (next: number) => void;
  onReset: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function ZoomControl({
  zoom,
  mode,
  presetOpen,
  onPresetOpenChange,
  onZoomChange,
  onReset,
  containerRef,
}: Props) {
  const percent = Math.round(zoom * 100);
  const canDec = zoom > ZOOM_MIN + 0.001;
  const canInc = zoom < ZOOM_MAX - 0.001;

  const stepButton = cn(
    "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform,opacity] duration-150 ease-out",
    "text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] active:scale-[0.92]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50",
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-0.5 rounded-full border bg-cream-soft pl-1 pr-1 py-1 transition-colors",
        presetOpen
          ? "border-[color:var(--ink)]"
          : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]",
      )}
    >
      <button
        type="button"
        onClick={() => onZoomChange(clampZoom(zoom - ZOOM_STEP))}
        disabled={!canDec}
        aria-label="Pomniejsz"
        className={stepButton}
      >
        <Minus size={12} weight="bold" />
      </button>

      <button
        type="button"
        onClick={() => onPresetOpenChange(!presetOpen)}
        aria-haspopup="listbox"
        aria-expanded={presetOpen}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-full px-2 text-[12px] font-semibold tabular-nums transition-[background-color,transform] duration-150 ease-out active:scale-[0.98]",
          "min-w-[56px] hover:bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50",
          mode === "auto" && "text-[color:var(--ink-muted)]",
        )}
      >
        {percent}%
        {mode === "auto" ? (
          <span
            className="ml-0.5 rounded-full bg-[color:var(--saffron)]/20 px-1 text-[9px] font-bold uppercase tracking-wider text-[color:var(--ink)]"
            aria-label="auto"
          >
            A
          </span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onZoomChange(clampZoom(zoom + ZOOM_STEP))}
        disabled={!canInc}
        aria-label="Powiększ"
        className={stepButton}
      >
        <Plus size={12} weight="bold" />
      </button>

      <span
        aria-hidden
        className="mx-1 h-4 w-px shrink-0 bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]"
      />

      <button
        type="button"
        onClick={onReset}
        aria-label="Dopasuj automatycznie"
        title="Dopasuj automatycznie do okna"
        disabled={mode === "auto"}
        className={cn(stepButton, "mr-0.5")}
      >
        <ArrowCounterClockwise size={12} weight="bold" />
      </button>

      <AnimatedPopover
        open={presetOpen}
        align="center"
        role="listbox"
        aria-label="Presety zoomu"
        className="w-[168px] overflow-hidden rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card py-1.5 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
      >
        <div className="flex flex-col">
          {ZOOM_PRESETS.map((p) => {
            const active = mode === "manual" && Math.abs(zoom - p) < 0.005;
            return (
              <button
                key={p}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onZoomChange(p);
                  onPresetOpenChange(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2 text-[12px] transition-colors duration-150 ease-out",
                  "hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]",
                  active ? "font-semibold text-[color:var(--ink)]" : "text-[color:var(--ink-muted)]",
                )}
              >
                <span className="tabular-nums">{Math.round(p * 100)}%</span>
                {active ? (
                  <Check size={12} weight="bold" className="text-[color:var(--saffron)]" />
                ) : null}
              </button>
            );
          })}
          <span className="my-1 h-px w-full bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]" />
          <button
            type="button"
            onClick={() => {
              onReset();
              onPresetOpenChange(false);
            }}
            className={cn(
              "flex cursor-pointer items-center justify-between px-3 py-2 text-[12px] transition-colors duration-150 ease-out",
              "hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]",
              mode === "auto"
                ? "font-semibold text-[color:var(--ink)]"
                : "text-[color:var(--ink-muted)]",
            )}
          >
            <span>Dopasuj auto</span>
            {mode === "auto" ? (
              <Check size={12} weight="bold" className="text-[color:var(--saffron)]" />
            ) : null}
          </button>
        </div>
      </AnimatedPopover>
    </div>
  );
}
