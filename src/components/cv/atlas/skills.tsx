"use client";

import { useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCVStore } from "@/lib/cv/store";
import { AtlasSectionHeading } from "./section-heading";
import { EditableText } from "@/components/cv/editable/editable-text";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

export function AtlasSkills() {
  const professional = useCVStore((s) => s.cv.skills.professional);
  const personalSkills = useCVStore((s) => s.cv.skills.personal);
  const setSkills = useCVStore((s) => s.setSkills);
  const draftRef = useRef<HTMLSpanElement>(null);

  const flat = useMemo(() => {
    const tagged = [
      ...professional.map((s) => ({ value: s, group: "professional" as const })),
      ...personalSkills.map((s) => ({ value: s, group: "personal" as const })),
    ];
    return tagged;
  }, [professional, personalSkills]);

  const mid = Math.ceil(flat.length / 2);
  const left = flat.slice(0, mid);
  const right = flat.slice(mid);

  const updateAt = (
    absoluteIdx: number,
    nextValue: string,
  ) => {
    const trimmed = nextValue.trim();
    const item = flat[absoluteIdx];
    if (!item) return;
    const bucket = item.group === "professional" ? professional : personalSkills;
    const localIdx = item.group === "professional"
      ? absoluteIdx
      : absoluteIdx - professional.length;
    if (!trimmed) {
      setSkills(item.group, bucket.filter((_, i) => i !== localIdx));
      return;
    }
    setSkills(item.group, bucket.map((v, i) => (i === localIdx ? trimmed : v)));
  };

  const removeAt = (absoluteIdx: number) => {
    const item = flat[absoluteIdx];
    if (!item) return;
    const bucket = item.group === "professional" ? professional : personalSkills;
    const localIdx = item.group === "professional"
      ? absoluteIdx
      : absoluteIdx - professional.length;
    setSkills(item.group, bucket.filter((_, i) => i !== localIdx));
  };

  const commitDraft = () => {
    const el = draftRef.current;
    if (!el) return;
    const value = (el.innerText ?? "").trim();
    if (!value) return;
    if (!professional.includes(value) && !personalSkills.includes(value)) {
      setSkills("professional", [...professional, value]);
    }
    el.innerText = "";
  };

  const handleKey = (e: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
      requestAnimationFrame(() => draftRef.current?.focus());
    }
  };

  const renderColumn = (items: Array<{ value: string; group: "professional" | "personal" }>, startIdx: number) => (
    <ul className="flex flex-col gap-[0.45em]">
      {items.map((item, i) => {
        const absoluteIdx = startIdx + i;
        return (
          <li
            key={`${item.value}-${absoluteIdx}`}
            className="group flex items-start gap-[0.55em] text-[1em] text-[color:var(--cv-ink)]"
          >
            <span
              aria-hidden
              className="mt-[0.35em] inline-block h-[0.55em] w-[0.55em] shrink-0 rounded-full border-[1.5px] border-[color:var(--cv-accent)]"
            />
            <EditableText
              value={item.value}
              onChange={(v) => updateAt(absoluteIdx, v)}
              className="flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={() => removeAt(absoluteIdx)}
              aria-label={`Usuń ${item.value}`}
              tabIndex={-1}
              className="mt-[0.2em] shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
            >
              <X size={10} />
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section data-cv-section="skills-atlas">
      <AtlasSectionHeading>Umiejętności</AtlasSectionHeading>
      <div className="grid grid-cols-2 gap-x-[1em] gap-y-[0.3em]">
        {renderColumn(left, 0)}
        {renderColumn(right, mid)}
      </div>
      <div className="mt-[0.7em] flex items-center gap-[0.55em] text-[1em] text-[color:var(--cv-ink)]">
        <span
          aria-hidden
          className="inline-block h-[0.55em] w-[0.55em] shrink-0 rounded-full border-[1.5px] border-[color:var(--cv-muted-soft)]"
        />
        <span
          ref={draftRef}
          role="textbox"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Dodaj umiejętność"
          onBlur={commitDraft}
          onKeyDown={handleKey}
          lang="pl"
          className="flex-1 min-w-0 outline-none whitespace-pre-wrap break-normal hyphens-auto cursor-text"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commitDraft}
          aria-label="Dodaj umiejętność"
          className="shrink-0 opacity-60 hover:opacity-100 text-[color:var(--cv-muted)]"
          tabIndex={-1}
        >
          <Plus size={11} weight="bold" />
        </button>
      </div>
    </section>
  );
}
