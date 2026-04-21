"use client";

import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { EditableText } from "./editable-text";

type Props = {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
};

export function EditableTagList({ items, onChange, placeholder, className, ariaLabel }: Props) {
  const draftRef = useRef<HTMLSpanElement>(null);

  const readDraft = () => (draftRef.current?.innerText ?? "").trim();
  const setDraftText = (text: string) => {
    if (draftRef.current) draftRef.current.innerText = text;
  };
  const focusDraft = () => {
    const el = draftRef.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const commit = () => {
    const value = readDraft();
    if (!value) return;
    if (!items.includes(value)) onChange([...items, value]);
    setDraftText("");
  };

  const updateAt = (index: number, next: string) => {
    const trimmed = next.trim();
    if (!trimmed) {
      onChange(items.filter((_, i) => i !== index));
      return;
    }
    onChange(items.map((v, i) => (i === index ? trimmed : v)));
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKey = (e: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
      focusDraft();
      return;
    }
    if (e.key === "Backspace" && readDraft() === "" && items.length > 0) {
      e.preventDefault();
      const last = items[items.length - 1];
      onChange(items.slice(0, -1));
      setDraftText(last);
      requestAnimationFrame(focusDraft);
    }
  };

  return (
    <ul className={cn("flex flex-col gap-[0.35em]", className)} role="list" aria-label={ariaLabel}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="group flex items-start gap-1 min-w-0">
          <EditableText
            value={item}
            onChange={(v) => updateAt(i, v)}
            className="text-[1em] flex-1"
            ariaLabel={`Pozycja: ${item}`}
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Usuń ${item}`}
            className="shrink-0 mt-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
            tabIndex={-1}
          >
            <X size={10} />
          </button>
        </li>
      ))}
      <li className="flex items-start gap-1 min-w-0">
        <span
          ref={draftRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={placeholder ?? "Dodaj pozycję"}
          data-placeholder={placeholder ?? "Dodaj pozycję"}
          onBlur={commit}
          onKeyDown={handleKey}
          lang="pl"
          className="flex-1 min-w-0 outline-none text-[1em] whitespace-pre-wrap break-normal hyphens-auto cursor-text"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
          aria-label="Dodaj"
          className="shrink-0 mt-1 opacity-60 hover:opacity-100"
          tabIndex={-1}
        >
          <Plus size={10} />
        </button>
      </li>
    </ul>
  );
}
