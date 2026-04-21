"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
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
      className="group grid grid-cols-[auto_38%_1fr] items-start gap-x-[3mm] gap-y-[1mm]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.4em]" />
      <div className="flex flex-col gap-[0.5mm]">
        <YearRange
          startYear={item.startYear}
          startMonth={item.startMonth}
          endYear={item.endYear}
          endMonth={item.endMonth}
          current={item.current}
          onChange={(patch) => updateEducation(item.id, patch)}
          variant="inline"
          className="lumen-display text-[calc(var(--cv-font-size)*0.95)] leading-tight text-[color:var(--cv-ink)]"
        />
        <EditableText
          value={item.location}
          onChange={(v) => updateEducation(item.id, { location: v })}
          placeholder="Miasto"
          className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <p className="lumen-display text-[calc(var(--cv-font-size)*1.0)] leading-tight text-[color:var(--cv-ink)]">
            <EditableText
              value={item.school}
              onChange={(v) => updateEducation(item.id, { school: v })}
              placeholder="Nazwa uczelni / szkoły"
              as="span"
            />
          </p>
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
          className="mt-[1mm] text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-muted)]"
        />
      </div>
    </li>
  );
}

export function LumenEducation() {
  const items = useCVStore((s) => s.cv.education);
  const addEducation = useCVStore((s) => s.addEducation);
  const reorderEducation = useCVStore((s) => s.reorderEducation);

  const ids = items.map((i) => i.id);

  return (
    <div>
      <SortableList ids={ids} onReorder={reorderEducation}>
        <ul className="flex flex-col gap-[5mm]">
          {items.map((item) => (
            <EduRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEducation}
        className="mt-[3mm] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj pozycję
      </button>
    </div>
  );
}
