"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { CobaltSectionHeading } from "./section-heading";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { EducationItem } from "@/lib/cv/schema";

function EduRow({ item }: { item: EducationItem }) {
  const updateEducation = useCVStore((s) => s.updateEducation);
  const removeEducation = useCVStore((s) => s.removeEducation);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li
      ref={rowRef}
      style={rowStyle}
      className="group grid grid-cols-[auto_1fr] gap-[0.6em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.3em]" />
      <div className="flex flex-col min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <EditableText
            value={item.school}
            onChange={(v) => updateEducation(item.id, { school: v })}
            placeholder="Nazwa uczelni / szkoły"
            as="p"
            className="font-bold text-[1em] leading-snug text-[color:var(--cv-ink)]"
          />
          <button
            type="button"
            onClick={() => removeEducation(item.id)}
            aria-label="Usuń pozycję edukacji"
            tabIndex={-1}
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
          >
            <Trash size={11} />
          </button>
        </div>
        <EditableText
          value={item.degree}
          onChange={(v) => updateEducation(item.id, { degree: v })}
          placeholder="Stopień, kierunek"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.96)] leading-snug text-[color:var(--cv-ink)]"
        />
        <div className="mt-[0.15em] flex flex-wrap items-baseline gap-[0.5em] text-[calc(var(--cv-font-size)*0.88)] text-[color:var(--cv-muted)]">
          <YearRange
            startYear={item.startYear}
            startMonth={item.startMonth}
            endYear={item.endYear}
            endMonth={item.endMonth}
            current={item.current}
            onChange={(patch) => updateEducation(item.id, patch)}
            variant="inline"
            className="leading-[1.4]"
          />
          {item.location ? <span aria-hidden>·</span> : null}
          <EditableText
            value={item.location}
            onChange={(v) => updateEducation(item.id, { location: v })}
            placeholder="Miasto"
            className="leading-[1.4]"
          />
        </div>
      </div>
    </li>
  );
}

export function CobaltEducation() {
  const items = useCVStore((s) => s.cv.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const reorderEducation = useCVStore((s) => s.reorderEducation);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="education-cobalt">
      <CobaltSectionHeading>Edukacja</CobaltSectionHeading>
      <SortableList ids={ids} onReorder={reorderEducation}>
        <ul className="flex flex-col gap-[0.9em]">
          {items.map((item) => (
            <EduRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEducation}
        className="mt-[0.8em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj pozycję
      </button>
    </section>
  );
}
