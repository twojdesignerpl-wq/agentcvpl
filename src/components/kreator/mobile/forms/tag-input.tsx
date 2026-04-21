"use client";

import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  hint?: string;
};

export function MobileTagInput({ label, values, onChange, placeholder, hint }: Props) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...values, v]);
    setDraft("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div className="block">
      <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
        {label}
      </span>
      <div
        className={cn(
          "flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] p-2 transition-colors focus-within:border-[color:var(--ink)] focus-within:bg-white",
        )}
      >
        {values.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] py-1 pl-3 pr-1 text-[13px] font-medium text-ink"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(idx)}
              aria-label={`Usuń ${tag}`}
              className="inline-flex size-5 items-center justify-center rounded-full text-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] hover:text-ink"
            >
              <X size={10} weight="bold" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={values.length === 0 ? placeholder : "Dodaj kolejny…"}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-[14px] text-ink outline-none placeholder:text-[color:color-mix(in_oklab,var(--ink)_40%,transparent)]"
        />
        {draft.trim() ? (
          <button
            type="button"
            onClick={commit}
            className="inline-flex size-7 items-center justify-center rounded-full bg-ink text-cream transition-opacity hover:opacity-90"
            aria-label="Dodaj tag"
          >
            <Plus size={12} weight="bold" />
          </button>
        ) : null}
      </div>
      {hint ? (
        <span className="mt-1 block text-[11.5px] text-[color:var(--ink-muted)]">{hint}</span>
      ) : null}
    </div>
  );
}
