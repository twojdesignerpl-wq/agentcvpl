"use client";

import { useId } from "react";
import { MONTH_LABELS } from "@/lib/cv/schema";
import { cn } from "@/lib/utils";
import { MOBILE_SELECT_BASE, yearOptions } from "./select-base";

type Value = {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  current: boolean;
};

type Props = {
  value: Value;
  onChange: (patch: Partial<Value>) => void;
  labelStart?: string;
  labelEnd?: string;
  labelCurrent?: string;
};

const SELECT_BASE = MOBILE_SELECT_BASE;

export function MobileDateRange({
  value,
  onChange,
  labelStart = "Od",
  labelEnd = "Do",
  labelCurrent = "Trwa nadal",
}: Props) {
  const startId = useId();
  const endId = useId();
  const currentId = useId();
  const years = yearOptions();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            {labelStart}
          </span>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <select
              id={`${startId}-m`}
              value={value.startMonth}
              onChange={(e) => onChange({ startMonth: e.target.value })}
              className={cn(SELECT_BASE)}
              aria-label={`${labelStart} — miesiąc`}
            >
              <option value="">Miesiąc</option>
              {MONTH_LABELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              id={`${startId}-y`}
              value={value.startYear}
              onChange={(e) => onChange({ startYear: e.target.value })}
              className={cn(SELECT_BASE, "w-[92px]")}
              aria-label={`${labelStart} — rok`}
            >
              <option value="">Rok</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            {labelEnd}
          </span>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <select
              id={`${endId}-m`}
              value={value.endMonth}
              onChange={(e) => onChange({ endMonth: e.target.value })}
              disabled={value.current}
              className={cn(SELECT_BASE, value.current && "opacity-40")}
              aria-label={`${labelEnd} — miesiąc`}
            >
              <option value="">Miesiąc</option>
              {MONTH_LABELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              id={`${endId}-y`}
              value={value.endYear}
              onChange={(e) => onChange({ endYear: e.target.value })}
              disabled={value.current}
              className={cn(SELECT_BASE, "w-[92px]", value.current && "opacity-40")}
              aria-label={`${labelEnd} — rok`}
            >
              <option value="">Rok</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <label htmlFor={currentId} className="flex items-center gap-2 py-1 text-[14px] text-ink">
        <input
          id={currentId}
          type="checkbox"
          checked={value.current}
          onChange={(e) => onChange({ current: e.target.checked })}
          className="size-4 accent-[var(--saffron)]"
        />
        {labelCurrent}
      </label>
    </div>
  );
}
