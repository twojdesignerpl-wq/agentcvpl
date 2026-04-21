"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
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
      className="group grid grid-cols-[auto_18%_1fr] items-start gap-[1em]"
    >
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <YearRange
        startYear={item.startYear}
        startMonth={item.startMonth}
        endYear={item.endYear}
        endMonth={item.endMonth}
        current={item.current}
        onChange={(patch) => updateEmployment(item.id, patch)}
        className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
      />
      <div className="flex flex-col">
        <EditableText
          value={item.position}
          onChange={(v) => updateEmployment(item.id, { position: v })}
          placeholder="Stanowisko"
          as="p"
          className="font-semibold text-[1em] leading-snug"
        />
        <EditableText
          value={item.company}
          onChange={(v) => updateEmployment(item.id, { company: v })}
          placeholder="Nazwa firmy"
          as="p"
          className="text-[1em] leading-snug text-[color:var(--cv-ink)]"
        />
        <EditableText
          value={item.description}
          onChange={(v) => updateEmployment(item.id, { description: v })}
          placeholder="Opis roli — kluczowe zadania, wyniki, liczby."
          multiline
          as="p"
          className="mt-[0.6em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <button
          type="button"
          onClick={() => removeEmployment(item.id)}
          aria-label="Usuń doświadczenie"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateEmployment() {
  const items = useCVStore((s) => s.cv.employment);
  const addEmployment = useCVStore((s) => s.addEmployment);
  const reorderEmployment = useCVStore((s) => s.reorderEmployment);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="employment">
      <SectionHeading>Doświadczenie zawodowe</SectionHeading>
      <SortableList ids={ids} onReorder={reorderEmployment}>
        <ul className="flex flex-col gap-[1.4em]">
          {items.map((item) => (
            <EmpRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEmployment}
        className="mt-[1em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj doświadczenie
      </button>
    </section>
  );
}
