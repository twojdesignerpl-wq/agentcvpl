"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

// 16px font-size to prevent iOS Safari zoom-on-focus. Height 52px dla komfortu tap.
const BASE_FIELD =
  "w-full min-h-[52px] rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] px-3.5 py-3 text-[16px] font-medium leading-snug text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[color:color-mix(in_oklab,var(--ink)_40%,transparent)] focus:border-[color:var(--ink)] focus:bg-white focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--saffron)_45%,transparent)]";

const LABEL_CLASS =
  "mono-label mb-1.5 block text-[clamp(0.6rem,2.6vw,0.7rem)] tracking-[0.14em] text-[color:var(--ink-muted)]";

type MobileTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export const MobileTextField = forwardRef<HTMLInputElement, MobileTextFieldProps>(
  function MobileTextField({ label, hint, className, id: idProp, ...rest }, ref) {
    const fallbackId = useId();
    const id = idProp ?? fallbackId;
    return (
      <label htmlFor={id} className="block">
        <span className={LABEL_CLASS}>{label}</span>
        <input ref={ref} id={id} className={cn(BASE_FIELD, className)} {...rest} />
        {hint ? (
          <span className="mt-1 block text-[11.5px] text-[color:var(--ink-muted)]">{hint}</span>
        ) : null}
      </label>
    );
  },
);

type MobileTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  function MobileTextarea({ label, hint, className, id: idProp, rows = 4, ...rest }, ref) {
    const fallbackId = useId();
    const id = idProp ?? fallbackId;
    return (
      <label htmlFor={id} className="block">
        <span className={LABEL_CLASS}>{label}</span>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(BASE_FIELD, "min-h-[128px] resize-none leading-relaxed", className)}
          {...rest}
        />
        {hint ? (
          <span className="mt-1 block text-[11.5px] text-[color:var(--ink-muted)]">{hint}</span>
        ) : null}
      </label>
    );
  },
);
