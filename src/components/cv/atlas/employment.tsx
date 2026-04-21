"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { AtlasSectionHeading } from "./section-heading";
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
      className="group grid grid-cols-[auto_18%_1fr_18%] items-start gap-[1em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.4em]" />
      <YearRange
        startYear={item.startYear}
        startMonth={item.startMonth}
        endYear={item.endYear}
        endMonth={item.endMonth}
        current={item.current}
        onChange={(patch) => updateEmployment(item.id, patch)}
        variant="inline"
        className="text-[calc(var(--cv-font-size)*0.9)] font-medium text-[color:var(--cv-accent)] leading-[1.35]"
      />
      <div className="flex flex-col min-w-0">
        <div className="flex flex-wrap items-baseline gap-[0.35em] text-[1em] leading-snug font-semibold">
          <EditableText
            value={item.position}
            onChange={(v) => updateEmployment(item.id, { position: v })}
            placeholder="Stanowisko"
            as="span"
          />
          <span className="text-[color:var(--cv-muted)] font-normal">w</span>
          <EditableText
            value={item.company}
            onChange={(v) => updateEmployment(item.id, { company: v })}
            placeholder="Nazwa firmy"
            as="span"
          />
        </div>
        <EditableText
          value={item.description}
          onChange={(v) => updateEmployment(item.id, { description: v })}
          placeholder="Opis roli — kluczowe zadania, wyniki, liczby."
          multiline
          as="p"
          className="mt-[0.45em] text-[calc(var(--cv-font-size)*0.95)] leading-[1.5] text-[color:var(--cv-muted)]"
        />
      </div>
      <div className="flex items-start justify-end gap-1 min-w-0">
        <EditableText
          value={item.location}
          onChange={(v) => updateEmployment(item.id, { location: v })}
          placeholder="Miasto"
          className="text-right text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
        />
        <button
          type="button"
          onClick={() => removeEmployment(item.id)}
          aria-label="Usuń doświadczenie"
          tabIndex={-1}
          className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)] mt-[0.2em]"
        >
          <Trash size={10} />
        </button>
      </div>
    </li>
  );
}

export function AtlasEmployment() {
  const items = useCVStore((s) => s.cv.employment);
  const addEmployment = useCVStore((s) => s.addEmployment);
  const reorderEmployment = useCVStore((s) => s.reorderEmployment);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="employment-atlas">
      <AtlasSectionHeading underline>Doświadczenie zawodowe</AtlasSectionHeading>
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
