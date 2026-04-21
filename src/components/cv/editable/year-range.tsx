"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { MONTH_LABELS } from "@/lib/cv/schema";
import { MenuSelect, type MenuOption } from "@/components/ui/menu-select";

type DateValue = {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  current: boolean;
};

type Props = DateValue & {
  onChange: (next: DateValue) => void;
  className?: string;
  variant?: "stacked" | "inline";
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS: number[] = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i);

const YEAR_OPTIONS: ReadonlyArray<MenuOption<string>> = [
  { value: "", label: "—" },
  ...YEARS.map((y) => ({ value: String(y), label: String(y) })),
];

const MONTH_OPTIONS: ReadonlyArray<MenuOption<string>> = [
  { value: "", label: "—" },
  ...MONTH_LABELS.map((m) => ({ value: m.value, label: `${m.value} · ${m.label}` })),
];

const FIELD_TRIGGER_BASE =
  "w-full rounded-lg border border-[color:var(--cv-line)] bg-[color:var(--cv-line-soft)] px-2 py-1.5 text-[11px] text-[color:var(--cv-ink)] tabular-nums hover:border-[color:color-mix(in_oklab,var(--cv-ink)_22%,transparent)] focus-visible:border-[color:var(--cv-ink)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40";

function formatDate(month: string, year: string): string {
  if (!year && !month) return "";
  if (!year) return month;
  if (!month) return year;
  return `${month}.${year}`;
}

export function YearRange({
  startYear,
  startMonth,
  endYear,
  endMonth,
  current,
  onChange,
  className,
  variant = "stacked",
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<"left" | "right">("left");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const startDisplay = formatDate(startMonth, startYear);
  const endDisplay = current ? "obecnie" : formatDate(endMonth, endYear);
  const hasValue = Boolean(startDisplay || endDisplay || current);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function computeAnchor(): "left" | "right" {
    if (!rootRef.current) return "left";
    const scope = rootRef.current.closest(".cv-scope");
    const scopeRect = scope?.getBoundingClientRect();
    if (!scopeRect) return "left";
    const triggerRect = rootRef.current.getBoundingClientRect();
    const triggerCenter = (triggerRect.left + triggerRect.right) / 2;
    const scopeCenter = (scopeRect.left + scopeRect.right) / 2;
    return triggerCenter > scopeCenter ? "right" : "left";
  }

  function openPopover() {
    setAnchor(computeAnchor());
    setOpen(true);
  }

  function togglePopover() {
    if (open) {
      setOpen(false);
    } else {
      openPopover();
    }
  }

  const inlineText = (() => {
    if (!hasValue) return "okres";
    if (!startDisplay) return endDisplay || "—";
    if (!endDisplay) return startDisplay;
    return `${startDisplay} – ${endDisplay}`;
  })();

  const hasMonths = Boolean(startMonth || endMonth);
  const shouldStack =
    variant === "inline" &&
    hasMonths &&
    Boolean(startDisplay) &&
    Boolean(endDisplay || current);

  const base: DateValue = { startYear, startMonth, endYear, endMonth, current };
  const update = (patch: Partial<DateValue>) => onChange({ ...base, ...patch });

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      {variant === "inline" ? (
        <button
          type="button"
          onClick={togglePopover}
          aria-label="Edytuj zakres dat"
          className={cn(
            "group inline-flex gap-[0.35em] tabular-nums leading-[1.35] transition-opacity hover:opacity-80 text-left",
            shouldStack ? "items-start" : "items-center",
            !hasValue && "italic text-[color:var(--cv-muted-soft)]",
          )}
        >
          <CalendarBlank
            size={11}
            weight="regular"
            className={cn(
              "shrink-0 opacity-70 transition-opacity group-hover:opacity-100",
              hasValue ? "" : "opacity-60",
              shouldStack && "mt-[0.2em]",
            )}
          />
          {shouldStack ? (
            <span
              className={cn(
                "flex flex-col leading-[1.25]",
                current ? "items-center" : "items-start",
              )}
            >
              <span className="whitespace-nowrap">
                <span className="opacity-60">od</span> {startDisplay}
              </span>
              <span className="whitespace-nowrap opacity-85">
                {current ? (
                  "obecnie"
                ) : (
                  <>
                    <span className="opacity-70">do</span> {endDisplay}
                  </>
                )}
              </span>
            </span>
          ) : (
            <span className="whitespace-nowrap">{inlineText}</span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={togglePopover}
          aria-label="Edytuj zakres dat"
          className={cn(
            "group relative flex flex-col gap-[0.1em] leading-[1.25] tabular-nums transition-opacity hover:opacity-80 pr-4",
            current ? "items-center text-center" : "items-start text-left",
          )}
        >
          <span className="block">{startDisplay || "—"}</span>
          {current ? null : (
            <span className="block opacity-70 text-[0.95em]">—</span>
          )}
          <span className="block">{current ? "obecnie" : endDisplay || "—"}</span>
          <CalendarBlank
            size={10}
            weight="regular"
            className="absolute right-0 top-0 opacity-55 transition-opacity group-hover:opacity-90"
          />
        </button>
      )}
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Zakres dat"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.97 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    y: -4,
                    scale: 0.96,
                    transition: { duration: 0.13, ease: [0.23, 1, 0.32, 1] },
                  }
            }
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "absolute top-full z-50 mt-1.5 w-[280px] rounded-2xl border border-[color:color-mix(in_oklab,var(--cv-ink)_12%,transparent)]",
              "bg-[color:var(--cream-soft,#fbf7ee)] p-3 font-body text-[11px] text-[color:var(--cv-ink)]",
              "shadow-[0_16px_48px_-16px_rgba(10,14,26,0.22),0_2px_8px_-4px_rgba(10,14,26,0.08)]",
              anchor === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            <div className="mb-2.5">
              <p className="mono-label mb-1.5 text-[9px] tracking-[0.18em] text-[color:var(--cv-muted)]">
                Od
              </p>
              <div className="flex gap-1.5">
                <MenuSelect
                  value={startMonth}
                  options={MONTH_OPTIONS}
                  onChange={(v) => update({ startMonth: v })}
                  ariaLabel="Miesiąc początkowy"
                  className="flex-1 min-w-0"
                  triggerClassName={FIELD_TRIGGER_BASE}
                  menuMaxHeight={240}
                  menuWidth={170}
                />
                <MenuSelect
                  value={startYear}
                  options={YEAR_OPTIONS}
                  onChange={(v) => update({ startYear: v })}
                  ariaLabel="Rok początkowy"
                  className="w-[92px] shrink-0"
                  triggerClassName={FIELD_TRIGGER_BASE}
                  menuMaxHeight={240}
                  menuWidth={92}
                  align="end"
                />
              </div>
            </div>
            <div className="mb-2.5">
              <p className="mono-label mb-1.5 text-[9px] tracking-[0.18em] text-[color:var(--cv-muted)]">
                Do
              </p>
              <div className="flex gap-1.5">
                <MenuSelect
                  value={current ? "" : endMonth}
                  options={MONTH_OPTIONS}
                  onChange={(v) => update({ endMonth: v, current: false })}
                  disabled={current}
                  ariaLabel="Miesiąc końcowy"
                  className="flex-1 min-w-0"
                  triggerClassName={FIELD_TRIGGER_BASE}
                  menuMaxHeight={240}
                  menuWidth={170}
                />
                <MenuSelect
                  value={current ? "" : endYear}
                  options={YEAR_OPTIONS}
                  onChange={(v) => update({ endYear: v, current: false })}
                  disabled={current}
                  ariaLabel="Rok końcowy"
                  className="w-[92px] shrink-0"
                  triggerClassName={FIELD_TRIGGER_BASE}
                  menuMaxHeight={240}
                  menuWidth={92}
                  align="end"
                />
              </div>
            </div>
            <label className="mb-2 flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-[color:var(--cv-line-soft)]">
              <input
                type="checkbox"
                checked={current}
                onChange={(e) =>
                  update(
                    e.target.checked
                      ? { endYear: "", endMonth: "", current: true }
                      : { current: false },
                  )
                }
                className="accent-[color:var(--cv-accent,#1a1a1a)]"
              />
              <span className="text-[11px] text-[color:var(--cv-ink)]">
                Obecnie pracuję / uczę się
              </span>
            </label>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full cursor-pointer rounded-lg bg-[color:var(--cv-ink)] px-3 py-2 text-[11px] font-semibold text-[#ffffff] transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
            >
              Gotowe
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
