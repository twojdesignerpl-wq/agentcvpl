"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { EmploymentItem } from "@/lib/cv/schema";

function EmpRow({ item }: { item: EmploymentItem }) {
  const updateEmployment = useCVStore((s) => s.updateEmployment);
  const removeEmployment = useCVStore((s) => s.removeEmployment);
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
          onChange={(patch) => updateEmployment(item.id, patch)}
          variant="inline"
          className="lumen-display text-[calc(var(--cv-font-size)*0.95)] leading-tight text-[color:var(--cv-ink)]"
        />
        <EditableText
          value={item.location}
          onChange={(v) => updateEmployment(item.id, { location: v })}
          placeholder="Miasto"
          className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <p className="lumen-display flex flex-wrap items-baseline gap-[0.3em] text-[calc(var(--cv-font-size)*1.0)] leading-tight text-[color:var(--cv-ink)]">
            <EditableText
              value={item.position}
              onChange={(v) => updateEmployment(item.id, { position: v })}
              placeholder="Stanowisko"
              as="span"
            />
            {item.company ? <span className="text-[color:var(--cv-muted)] font-normal">w</span> : null}
            <EditableText
              value={item.company}
              onChange={(v) => updateEmployment(item.id, { company: v })}
              placeholder="Firma"
              as="span"
            />
          </p>
          <button
            type="button"
            onClick={() => removeEmployment(item.id)}
            aria-label="Usuń doświadczenie"
            tabIndex={-1}
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
          >
            <Trash size={11} />
          </button>
        </div>
        <EditableText
          value={item.description}
          onChange={(v) => updateEmployment(item.id, { description: v })}
          placeholder="Opis roli — kluczowe zadania, wyniki, liczby."
          multiline
          as="p"
          className="mt-[1.5mm] text-[calc(var(--cv-font-size)*0.95)] leading-[1.55] text-[color:var(--cv-muted)]"
        />
      </div>
    </li>
  );
}

export function LumenEmployment() {
  const items = useCVStore((s) => s.cv.employment);
  const addEmployment = useCVStore((s) => s.addEmployment);
  const reorderEmployment = useCVStore((s) => s.reorderEmployment);

  const ids = items.map((i) => i.id);

  return (
    <div>
      <SortableList ids={ids} onReorder={reorderEmployment}>
        <ul className="flex flex-col gap-[5mm]">
          {items.map((item) => (
            <EmpRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEmployment}
        className="mt-[3mm] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj doświadczenie
      </button>
    </div>
  );
}
