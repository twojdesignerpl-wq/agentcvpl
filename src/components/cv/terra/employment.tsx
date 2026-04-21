"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { TerraSectionHeading } from "./section-heading";
import { Briefcase, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { EmploymentItem } from "@/lib/cv/schema";

function EmpRow({ item, isLast }: { item: EmploymentItem; isLast: boolean }) {
  const updateEmployment = useCVStore((s) => s.updateEmployment);
  const removeEmployment = useCVStore((s) => s.removeEmployment);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group relative grid grid-cols-[auto_1fr] gap-x-[0.8em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.7em]" />
      <div>
        <div className="flex flex-wrap items-baseline gap-x-[5mm] gap-y-[1mm]">
          <h3 className="terra-serif text-[calc(var(--cv-font-size)*1.18)] italic font-normal leading-[1.2] text-[color:var(--cv-ink)]">
            <EditableText
              value={item.position}
              onChange={(v) => updateEmployment(item.id, { position: v })}
              placeholder="Stanowisko"
              as="span"
            />
          </h3>
          <span className="inline-flex items-center gap-[0.4em] text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)]">
            <Briefcase size={11} weight="regular" />
            <EditableText
              value={item.company}
              onChange={(v) => updateEmployment(item.id, { company: v })}
              placeholder="Nazwa firmy"
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
              onChange={(patch) => updateEmployment(item.id, patch)}
              variant="inline"
              className="text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)]"
            />
          </span>
        </div>

        <EditableText
          value={item.description}
          onChange={(v) => updateEmployment(item.id, { description: v })}
          placeholder="Opis roli — każdą linię potraktuj jako osobny punkt. Ostatnią linię zostaw jako podsumowanie (wiersz przerwy = oddzielenie)."
          multiline
          as="p"
          className="mt-[2.5mm] whitespace-pre-line text-[calc(var(--cv-font-size)*0.95)] leading-[1.55] text-[color:var(--cv-ink)]"
        />

        <div className="mt-[2mm] flex items-center justify-between gap-3 text-[calc(var(--cv-font-size)*0.88)] text-[color:var(--cv-muted)]">
          <EditableText
            value={item.location}
            onChange={(v) => updateEmployment(item.id, { location: v })}
            placeholder="Lokalizacja (opcjonalnie)"
            className="italic"
          />
          <button
            type="button"
            onClick={() => removeEmployment(item.id)}
            aria-label="Usuń doświadczenie"
            tabIndex={-1}
            className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
          >
            <Trash size={11} />
          </button>
        </div>

        {!isLast ? <div className="mt-[5mm] h-px w-full bg-[color:var(--cv-line)]" /> : null}
      </div>
    </li>
  );
}

export function TerraEmployment() {
  const items = useCVStore((s) => s.cv.employment);
  const addEmployment = useCVStore((s) => s.addEmployment);
  const reorderEmployment = useCVStore((s) => s.reorderEmployment);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="employment-terra">
      <TerraSectionHeading>Doświadczenie</TerraSectionHeading>
      <SortableList ids={ids} onReorder={reorderEmployment}>
        <ul className="flex flex-col gap-[5mm]">
          {items.map((item, idx) => (
            <EmpRow key={item.id} item={item} isLast={idx === items.length - 1} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addEmployment}
        className="mt-[4mm] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-accent)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj doświadczenie
      </button>
    </section>
  );
}
