"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { AtlasSectionHeading } from "./section-heading";
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
      className="group grid grid-cols-[auto_18%_1fr_18%] items-start gap-[1em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.4em]" />
      <YearRange
        startYear={item.startYear}
        startMonth={item.startMonth}
        endYear={item.endYear}
        endMonth={item.endMonth}
        current={item.current}
        onChange={(patch) => updateEducation(item.id, patch)}
        variant="inline"
        className="text-[calc(var(--cv-font-size)*0.9)] font-medium text-[color:var(--cv-accent)] leading-[1.35]"
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
          multiline
          as="p"
          className="text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-muted)] mt-[0.1em]"
        />
      </div>
      <div className="flex items-start justify-end gap-1 min-w-0">
        <EditableText
          value={item.location}
          onChange={(v) => updateEducation(item.id, { location: v })}
          placeholder="Miasto"
          className="text-right text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
        />
        <button
          type="button"
          onClick={() => removeEducation(item.id)}
          aria-label="Usuń pozycję edukacji"
          tabIndex={-1}
          className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)] mt-[0.2em]"
        >
          <Trash size={10} />
        </button>
      </div>
    </li>
  );
}

export function AtlasEducation() {
  const items = useCVStore((s) => s.cv.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const reorderEducation = useCVStore((s) => s.reorderEducation);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="education-atlas">
      <AtlasSectionHeading underline>Edukacja</AtlasSectionHeading>
      <SortableList ids={ids} onReorder={reorderEducation}>
        <ul className="flex flex-col gap-[1em]">
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
