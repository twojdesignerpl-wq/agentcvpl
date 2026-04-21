"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { CobaltSectionHeading } from "./section-heading";
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
      className="group grid grid-cols-[auto_1fr] gap-[0.6em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.3em]" />
      <div className="flex flex-col min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-[0.1em]">
          <EditableText
            value={item.company}
            onChange={(v) => updateEmployment(item.id, { company: v })}
            placeholder="Nazwa firmy"
            as="p"
            className="font-bold text-[1em] leading-snug text-[color:var(--cv-ink)]"
          />
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
          value={item.position}
          onChange={(v) => updateEmployment(item.id, { position: v })}
          placeholder="Stanowisko"
          as="p"
          className="font-semibold text-[calc(var(--cv-font-size)*0.96)] leading-snug text-[color:var(--cv-ink)]"
        />
        <div className="mt-[0.15em] flex flex-wrap items-baseline gap-[0.5em] text-[calc(var(--cv-font-size)*0.88)] text-[color:var(--cv-muted)]">
          <YearRange
            startYear={item.startYear}
            startMonth={item.startMonth}
            endYear={item.endYear}
            endMonth={item.endMonth}
            current={item.current}
            onChange={(patch) => updateEmployment(item.id, patch)}
            variant="inline"
            className="leading-[1.4]"
          />
          {item.location ? <span aria-hidden>·</span> : null}
          <EditableText
            value={item.location}
            onChange={(v) => updateEmployment(item.id, { location: v })}
            placeholder="Miasto"
            className="leading-[1.4]"
          />
        </div>
        <EditableText
          value={item.description}
          onChange={(v) => updateEmployment(item.id, { description: v })}
          placeholder="Opis roli — kluczowe zadania, wyniki, liczby (każdy bullet w nowej linii)."
          multiline
          as="p"
          className="cobalt-bullets mt-[0.5em] text-[calc(var(--cv-font-size)*0.95)] leading-[1.5] text-[color:var(--cv-ink)]"
        />
      </div>
    </li>
  );
}

export function CobaltEmployment() {
  const items = useCVStore((s) => s.cv.employment);
  const addEmployment = useCVStore((s) => s.addEmployment);
  const reorderEmployment = useCVStore((s) => s.reorderEmployment);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="employment-cobalt">
      <CobaltSectionHeading>Doświadczenie</CobaltSectionHeading>
      <SortableList ids={ids} onReorder={reorderEmployment}>
        <ul className="flex flex-col gap-[1.1em]">
          {items.map((item) => (
            <EmpRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEmployment}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj doświadczenie
      </button>
    </section>
  );
}
