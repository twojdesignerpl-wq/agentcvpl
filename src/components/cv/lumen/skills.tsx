"use client";

import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCVStore } from "@/lib/cv/store";
import { EditableText } from "@/components/cv/editable/editable-text";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

type Group = "professional" | "personal";

type SkillGroupProps = {
  group: Group;
  heading?: string;
  items: string[];
  onUpdate: (group: Group, idx: number, value: string) => void;
  onRemove: (group: Group, idx: number) => void;
  onAdd: (group: Group, value: string) => void;
};

function SkillGroup({ group, heading, items, onUpdate, onRemove, onAdd }: SkillGroupProps) {
  const draftRef = useRef<HTMLSpanElement>(null);

  const commitDraft = () => {
    const el = draftRef.current;
    if (!el) return;
    const value = (el.innerText ?? "").trim();
    if (!value) return;
    onAdd(group, value);
    el.innerText = "";
  };

  const handleKey = (e: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
      requestAnimationFrame(() => draftRef.current?.focus());
    }
  };

  return (
    <div>
      {heading ? (
        <p className="lumen-eyebrow mb-[1.6mm] text-[calc(var(--cv-font-size)*0.78)] text-[color:var(--cv-muted)]">
          {heading}
        </p>
      ) : null}
      <ul className="grid grid-cols-3 gap-x-[3mm] gap-y-[2mm]">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`} className="group flex items-center gap-[2mm]">
            <span
              aria-hidden
              className="inline-block h-[1.6mm] w-[1.6mm] shrink-0 bg-[color:var(--cv-ink)]"
            />
            <EditableText
              value={item}
              onChange={(v) => onUpdate(group, idx, v)}
              className="flex-1 min-w-0 text-[calc(var(--cv-font-size)*0.95)] leading-tight text-[color:var(--cv-ink)]"
            />
            <button
              type="button"
              onClick={() => onRemove(group, idx)}
              aria-label={`Usuń ${item}`}
              tabIndex={-1}
              className="shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
            >
              <X size={9} />
            </button>
          </li>
        ))}
        <li className="flex items-center gap-[2mm]">
          <span
            aria-hidden
            className="inline-block h-[1.6mm] w-[1.6mm] shrink-0 bg-[color:var(--cv-muted-soft)]"
          />
          <span
            ref={draftRef}
            role="textbox"
            contentEditable
            suppressContentEditableWarning
            data-placeholder={items.length === 0 ? "Dodaj umiejętność" : "Dodaj"}
            onBlur={commitDraft}
            onKeyDown={handleKey}
            lang="pl"
            className="flex-1 min-w-0 outline-none whitespace-pre-wrap break-normal text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)] cursor-text"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={commitDraft}
            aria-label="Dodaj umiejętność"
            tabIndex={-1}
            className="shrink-0 opacity-60 hover:opacity-100 text-[color:var(--cv-muted)]"
          >
            <Plus size={10} weight="bold" />
          </button>
        </li>
      </ul>
    </div>
  );
}

export function LumenSkills() {
  const professional = useCVStore((s) => s.cv.skills.professional);
  const personal = useCVStore((s) => s.cv.skills.personal);
  const setSkills = useCVStore((s) => s.setSkills);

  const updateAt = (group: Group, idx: number, value: string) => {
    const bucket = group === "professional" ? professional : personal;
    const trimmed = value.trim();
    if (!trimmed) {
      setSkills(group, bucket.filter((_, i) => i !== idx));
      return;
    }
    setSkills(group, bucket.map((v, i) => (i === idx ? trimmed : v)));
  };

  const removeAt = (group: Group, idx: number) => {
    const bucket = group === "professional" ? professional : personal;
    setSkills(group, bucket.filter((_, i) => i !== idx));
  };

  const addOne = (group: Group, value: string) => {
    const bucket = group === "professional" ? professional : personal;
    if (!bucket.includes(value)) {
      setSkills(group, [...bucket, value]);
    }
  };

  return (
    <div className="flex flex-col gap-[3mm]">
      <SkillGroup
        group="professional"
        heading={personal.length > 0 ? "Zawodowe" : undefined}
        items={professional}
        onUpdate={updateAt}
        onRemove={removeAt}
        onAdd={addOne}
      />
      {personal.length > 0 ? (
        <SkillGroup
          group="personal"
          heading="Miękkie"
          items={personal}
          onUpdate={updateAt}
          onRemove={removeAt}
          onAdd={addOne}
        />
      ) : null}
    </div>
  );
}
