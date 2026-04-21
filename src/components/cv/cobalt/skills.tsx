"use client";

import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCVStore } from "@/lib/cv/store";
import { CobaltSectionHeading } from "./section-heading";
import { EditableText } from "@/components/cv/editable/editable-text";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

type Group = "professional" | "personal";

type SkillGroupProps = {
  group: Group;
  heading: string;
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
      <h3 className="cobalt-display text-[calc(var(--cv-font-size)*0.85)] font-bold uppercase tracking-[0.1em] text-[color:var(--cv-muted)]">
        {heading}
      </h3>
      <ul className="mt-[1.6mm] flex flex-col gap-[1.4mm]">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`} className="group">
            <div className="flex items-center gap-1">
              <EditableText
                value={item}
                onChange={(v) => onUpdate(group, idx, v)}
                className="flex-1 min-w-0 text-[calc(var(--cv-font-size)*1)] leading-tight text-[color:var(--cv-ink)]"
              />
              <button
                type="button"
                onClick={() => onRemove(group, idx)}
                aria-label={`Usuń ${item}`}
                tabIndex={-1}
                className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
              >
                <X size={9} />
              </button>
            </div>
            <div className="cobalt-skill-bar mt-[0.8mm]" aria-hidden />
          </li>
        ))}
        <li className="flex items-center gap-1">
          <span
            ref={draftRef}
            role="textbox"
            contentEditable
            suppressContentEditableWarning
            data-placeholder={items.length === 0 ? "Dodaj umiejętność" : "Dodaj"}
            onBlur={commitDraft}
            onKeyDown={handleKey}
            lang="pl"
            className="flex-1 min-w-0 outline-none whitespace-pre-wrap break-normal text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-muted)] cursor-text"
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

export function CobaltSkills() {
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
    <section data-cv-section="skills-cobalt">
      <CobaltSectionHeading>Umiejętności</CobaltSectionHeading>
      <div className="flex flex-col gap-[3mm]">
        <SkillGroup
          group="professional"
          heading="Zawodowe"
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
    </section>
  );
}
