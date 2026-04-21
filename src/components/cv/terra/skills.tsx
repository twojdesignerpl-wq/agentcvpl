"use client";

import { useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCVStore } from "@/lib/cv/store";
import { TerraSectionHeading } from "./section-heading";
import { EditableText } from "@/components/cv/editable/editable-text";
import { LANGUAGE_LEVEL_LABELS } from "@/lib/cv/schema";
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
      <h3 className="terra-serif text-[calc(var(--cv-font-size)*1.02)] italic font-normal leading-[1.25] text-[color:var(--cv-ink)]">
        {heading}
      </h3>
      <div className="mt-[1.2mm] flex flex-wrap items-baseline gap-x-[0.35em] gap-y-[0.15em] text-[calc(var(--cv-font-size)*0.92)] leading-[1.45] text-[color:var(--cv-muted)]">
        {items.map((item, idx) => (
          <span key={`${item}-${idx}`} className="group inline-flex items-center">
            <EditableText
              value={item}
              onChange={(v) => onUpdate(group, idx, v)}
              className="inline-block"
            />
            {idx < items.length - 1 ? <span aria-hidden>,</span> : null}
            <button
              type="button"
              onClick={() => onRemove(group, idx)}
              aria-label={`Usuń ${item}`}
              tabIndex={-1}
              className="ml-[0.2em] opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
            >
              <X size={9} />
            </button>
          </span>
        ))}
        <span className="inline-flex items-center">
          <span
            ref={draftRef}
            role="textbox"
            contentEditable
            suppressContentEditableWarning
            data-placeholder={items.length === 0 ? "Dodaj umiejętności" : "Dodaj"}
            onBlur={commitDraft}
            onKeyDown={handleKey}
            lang="pl"
            className="inline-block min-w-[3em] outline-none cursor-text"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={commitDraft}
            aria-label="Dodaj umiejętność"
            tabIndex={-1}
            className="ml-[0.15em] opacity-60 hover:opacity-100 text-[color:var(--cv-muted)]"
          >
            <Plus size={10} weight="bold" />
          </button>
        </span>
      </div>
    </div>
  );
}

export function TerraSkills() {
  const professional = useCVStore((s) => s.cv.skills.professional);
  const personal = useCVStore((s) => s.cv.skills.personal);
  const languages = useCVStore((s) => s.cv.languages);
  const showLanguages = useCVStore((s) => s.cv.settings.showLanguages);
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

  const languagesText = useMemo(() => {
    return languages
      .map((l) => {
        const level = LANGUAGE_LEVEL_LABELS[l.level]?.split(" — ")[0] ?? l.level;
        return l.name ? `${l.name} (${level})` : "";
      })
      .filter(Boolean)
      .join(", ");
  }, [languages]);

  return (
    <section data-cv-section="skills-terra">
      <TerraSectionHeading>Umiejętności</TerraSectionHeading>
      <div className="flex flex-col gap-[4mm]">
        <SkillGroup
          group="professional"
          heading="Zawodowe"
          items={professional}
          onUpdate={updateAt}
          onRemove={removeAt}
          onAdd={addOne}
        />
        <SkillGroup
          group="personal"
          heading="Osobiste"
          items={personal}
          onUpdate={updateAt}
          onRemove={removeAt}
          onAdd={addOne}
        />
        {showLanguages ? (
          <div>
            <h3 className="terra-serif text-[calc(var(--cv-font-size)*1.02)] italic font-normal leading-[1.25] text-[color:var(--cv-ink)]">
              Języki
            </h3>
            <p className="mt-[1.2mm] text-[calc(var(--cv-font-size)*0.92)] leading-[1.45] text-[color:var(--cv-muted)]">
              {languagesText || <span className="italic text-[color:var(--cv-muted-soft)]">Dodaj języki w pasku narzędzi</span>}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
