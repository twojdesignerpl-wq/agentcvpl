"use client";

import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { PaperPlaneTilt, StopCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  disabled: boolean;
  isStreaming: boolean;
  placeholder?: string;
};

const MAX_ROWS = 6;

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  disabled,
  isStreaming,
  placeholder = "Zapytaj Pracusia…",
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight || "22") || 22;
    const max = line * MAX_ROWS + 20;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 rounded-2xl border bg-cream px-4 py-3",
        "border-ink/12 shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)]",
        "focus-within:border-saffron focus-within:ring-4 focus-within:ring-saffron/15 focus-within:bg-cream-soft",
        "transition-[border-color,box-shadow,background-color]",
      )}
    >
      <textarea
        ref={ref}
        aria-label="Wiadomość do Pracuś AI"
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/70 outline-none",
          "font-body font-medium pt-1",
        )}
      />
      {isStreaming ? (
        <motion.button
          type="button"
          onClick={onStop}
          whileTap={{ scale: 0.92 }}
          aria-label="Zatrzymaj Pracusia"
          className="shrink-0 size-11 grid place-items-center rounded-full bg-rust text-cream hover:bg-[color-mix(in_oklab,var(--rust)_90%,black)] shadow-[0_6px_16px_-8px_rgba(10,14,26,0.3)] transition-colors"
        >
          <StopCircle size={20} weight="fill" />
        </motion.button>
      ) : (
        <motion.button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.92 } : undefined}
          whileHover={canSend ? { scale: 1.04 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          aria-label="Wyślij do Pracusia"
          className={cn(
            "shrink-0 size-11 grid place-items-center rounded-full transition-colors",
            canSend
              ? "bg-saffron text-ink hover:bg-[color-mix(in_oklab,var(--saffron)_90%,black)] shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--saffron)_60%,transparent)]"
              : "bg-ink/10 text-ink-muted/60 cursor-not-allowed",
          )}
        >
          <PaperPlaneTilt size={19} weight="fill" />
        </motion.button>
      )}
    </div>
  );
}
