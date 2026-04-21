"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  className?: string;
  ariaLabel?: string;
  maxLength?: number;
};

export function EditableText({
  value,
  onChange,
  placeholder,
  multiline = false,
  as = "span",
  className,
  ariaLabel,
  maxLength,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const activeMatch = typeof document !== "undefined" && document.activeElement === el;
    if (!activeMatch && el.innerText !== value) {
      el.innerText = value;
    }
  }, [value]);

  const commit = () => {
    const el = ref.current;
    if (!el) return;
    let text = el.innerText;
    if (maxLength && text.length > maxLength) text = text.slice(0, maxLength);
    if (text !== value) onChange(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      const el = ref.current;
      if (el) el.innerText = value;
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const Tag = as as "span";
  return (
    <Tag
      ref={ref as unknown as React.RefObject<HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={commit}
      onFocus={() => setIsEditing(true)}
      onKeyDown={handleKeyDown}
      role="textbox"
      aria-label={ariaLabel ?? placeholder}
      data-placeholder={placeholder}
      data-editing={isEditing ? "true" : "false"}
      className={cn("cursor-text whitespace-pre-wrap break-normal hyphens-auto", className)}
      lang="pl"
    />
  );
}
