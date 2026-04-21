"use client";

import { useState } from "react";
import { CaretLeft, CaretRight, CalendarBlank, X } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Sty", "Lut", "Mar", "Kwi",
  "Maj", "Cze", "Lip", "Sie",
  "Wrz", "Paź", "Lis", "Gru",
] as const;

const MONTH_FULL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień",
  "Maj", "Czerwiec", "Lipiec", "Sierpień",
  "Wrzesień", "Październik", "Listopad", "Grudzień",
] as const;

interface MonthPickerProps {
  /** Value in "YYYY-MM" format (e.g. "2025-02") */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function parseValue(v: string): { year: number; month: number } | null {
  if (!v) return null;
  const [y, m] = v.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return null;
  return { year: y, month: m };
}

function formatDisplay(v: string): string {
  const parsed = parseValue(v);
  if (!parsed) return "";
  return `${MONTH_FULL[parsed.month - 1]} ${parsed.year}`;
}

function toValue(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function MonthPicker({
  value,
  onChange,
  placeholder = "Wybierz miesiąc...",
  className,
  disabled = false,
}: MonthPickerProps) {
  const parsed = parseValue(value);
  const now = new Date();
  const [viewYear, setViewYear] = useState(parsed?.year ?? now.getFullYear());
  const [open, setOpen] = useState(false);

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  function select(month: number) {
    onChange(toValue(viewYear, month));
    setOpen(false);
  }

  function clear() {
    onChange("");
    setOpen(false);
  }

  function thisMonth() {
    onChange(toValue(currentYear, currentMonth));
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none select-none",
          "hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <CalendarBlank size={15} className="shrink-0 text-muted-foreground" />
          {value ? formatDisplay(value) : placeholder}
        </span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }
            }}
            className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Wyczyść datę"
          >
            <X size={14} />
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-3">
        {/* Year navigation */}
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Poprzedni rok"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <span className="text-sm font-semibold tabular-nums">{viewYear}</span>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Następny rok"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        {/* Month grid 4×3 */}
        <div className="grid grid-cols-4 gap-1">
          {MONTHS.map((label, idx) => {
            const month = idx + 1;
            const isSelected = parsed?.year === viewYear && parsed?.month === month;
            const isCurrent = currentYear === viewYear && currentMonth === month;

            return (
              <button
                key={label}
                type="button"
                onClick={() => select(month)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-accent/60 text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="h-7 text-xs text-muted-foreground"
          >
            Wyczyść
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={thisMonth}
            className="h-7 text-xs text-primary"
          >
            Bieżący miesiąc
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
