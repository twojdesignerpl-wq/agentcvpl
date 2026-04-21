"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { YearRange } from "@/components/cv/editable/year-range";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { VolunteerItem } from "@/lib/cv/schema";

function VolRow({ item }: { item: VolunteerItem }) {
  const update = useCVStore((s) => s.updateVolunteer);
  const remove = useCVStore((s) => s.removeVolunteer);
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
        onChange={(patch) => update(item.id, patch)}
        className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
      />
      <div className="flex flex-col">
        <EditableText
          value={item.role}
          onChange={(v) => update(item.id, { role: v })}
          placeholder="Rola / funkcja"
          as="p"
          className="font-semibold text-[1em] leading-snug"
        />
        <EditableText
          value={item.organization}
          onChange={(v) => update(item.id, { organization: v })}
          placeholder="Organizacja"
          as="p"
          className="text-[1em] leading-snug text-[color:var(--cv-ink)]"
        />
        <EditableText
          value={item.description}
          onChange={(v) => update(item.id, { description: v })}
          placeholder="Krótki opis działań i rezultatów."
          multiline
          as="p"
          className="mt-[0.5em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <button
          type="button"
          onClick={() => remove(item.id)}
          aria-label="Usuń pozycję wolontariatu"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateVolunteer() {
  const items = useCVStore((s) => s.cv.volunteer);
  const add = useCVStore((s) => s.addVolunteer);
  const reorder = useCVStore((s) => s.reorderVolunteer);
  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="volunteer">
      <SectionHeading>Wolontariat</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[1.2em]">
          {items.map((item) => (
            <VolRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj wolontariat
      </button>
    </section>
  );
}
