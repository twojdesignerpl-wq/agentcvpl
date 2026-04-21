"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { TerraSectionHeading } from "./section-heading";
import { BookOpen, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { EducationItem } from "@/lib/cv/schema";

function EduRow({ item }: { item: EducationItem }) {
  const updateEducation = useCVStore((s) => s.updateEducation);
  const removeEducation = useCVStore((s) => s.removeEducation);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-x-[0.8em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.5em]" />
      <div>
        <EditableText
          value={item.degree}
          onChange={(v) => updateEducation(item.id, { degree: v })}
          placeholder="Stopień, kierunek"
          as="p"
          className="terra-serif text-[calc(var(--cv-font-size)*1.08)] italic font-normal leading-[1.2] text-[color:var(--cv-ink)]"
        />
        <div className="mt-[1.5mm] flex flex-wrap items-center gap-x-[3mm] gap-y-[0.5mm] text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)]">
          <span className="inline-flex items-center gap-[0.4em]">
            <BookOpen size={11} weight="regular" />
            <EditableText
              value={item.school}
              onChange={(v) => updateEducation(item.id, { school: v })}
              placeholder="Nazwa uczelni / szkoły"
              as="span"
            />
          </span>
          <span className="ml-auto">
            <YearRange
              startYear={item.startYear}
              startMonth={item.startMonth}
              endYear={item.endYear}
              endMonth={item.endMonth}
              current={item.current}
              onChange={(patch) => updateEducation(item.id, patch)}
              variant="inline"
              className="text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)]"
            />
          </span>
          <button
            type="button"
            onClick={() => removeEducation(item.id)}
            aria-label="Usuń pozycję edukacji"
            tabIndex={-1}
            className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
          >
            <Trash size={10} />
          </button>
        </div>
        <EditableText
          value={item.location}
          onChange={(v) => updateEducation(item.id, { location: v })}
          placeholder="Lokalizacja (opcjonalnie)"
          as="p"
          className="mt-[0.5mm] text-[calc(var(--cv-font-size)*0.85)] italic text-[color:var(--cv-muted-soft)]"
        />
      </div>
    </li>
  );
}

export function TerraEducation() {
  const items = useCVStore((s) => s.cv.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const reorderEducation = useCVStore((s) => s.reorderEducation);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="education-terra">
      <TerraSectionHeading>Edukacja</TerraSectionHeading>
      <SortableList ids={ids} onReorder={reorderEducation}>
        <ul className="flex flex-col gap-[4mm]">
          {items.map((item) => (
            <EduRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEducation}
        className="mt-[3mm] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-accent)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj pozycję
      </button>
    </section>
  );
}
