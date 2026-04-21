"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
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
      className="group grid grid-cols-[auto_28%_1fr] items-start gap-[0.5em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <YearRange
        startYear={item.startYear}
        startMonth={item.startMonth}
        endYear={item.endYear}
        endMonth={item.endMonth}
        current={item.current}
        onChange={(patch) => updateEducation(item.id, patch)}
        className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
      />
      <div className="flex flex-col min-w-0">
        <EditableText
          value={item.school}
          onChange={(v) => updateEducation(item.id, { school: v })}
          placeholder="Nazwa uczelni / szkoły"
          as="p"
          className="font-semibold text-[1em] leading-snug"
        />
        <EditableText
          value={item.degree}
          onChange={(v) => updateEducation(item.id, { degree: v })}
          placeholder="Stopień, kierunek"
          as="p"
          multiline
          className="text-[1em] leading-snug text-[color:var(--cv-ink-soft,var(--cv-ink))]"
        />
        <button
          type="button"
          onClick={() => removeEducation(item.id)}
          aria-label="Usuń pozycję edukacji"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateEducation() {
  const items = useCVStore((s) => s.cv.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const reorderEducation = useCVStore((s) => s.reorderEducation);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="education">
      <SectionHeading>Edukacja</SectionHeading>
      <SortableList ids={ids} onReorder={reorderEducation}>
        <ul className="flex flex-col gap-[1.1em]">
          {items.map((item) => (
            <EduRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEducation}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj pozycję
      </button>
    </section>
  );
}
