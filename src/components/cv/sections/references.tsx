"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { ReferenceItem } from "@/lib/cv/schema";

function RefRow({ item }: { item: ReferenceItem }) {
  const update = useCVStore((s) => s.updateReference);
  const remove = useCVStore((s) => s.removeReference);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <EditableText
          value={item.name}
          onChange={(v) => update(item.id, { name: v })}
          placeholder="Imię i nazwisko"
          as="p"
          className="font-semibold text-[1em] leading-snug"
        />
        <div className="flex items-baseline gap-1 text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-muted)]">
          <EditableText
            value={item.title}
            onChange={(v) => update(item.id, { title: v })}
            placeholder="Stanowisko"
          />
          <span>·</span>
          <EditableText
            value={item.company}
            onChange={(v) => update(item.id, { company: v })}
            placeholder="Firma"
          />
        </div>
        <EditableText
          value={item.relation}
          onChange={(v) => update(item.id, { relation: v })}
          placeholder="Relacja (np. przełożony, współpracownik)"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.9)] italic text-[color:var(--cv-muted)]"
        />
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.contact}
            onChange={(v) => update(item.id, { contact: v })}
            placeholder="Kontakt (email/telefon) lub „dostępne na prośbę"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-ink)]"
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label="Usuń referencję"
            className="text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition"
            tabIndex={-1}
          >
            <Trash size={11} />
          </button>
        </div>
      </div>
    </li>
  );
}

export function TemplateReferences() {
  const items = useCVStore((s) => s.cv.references);
  const add = useCVStore((s) => s.addReference);
  const reorder = useCVStore((s) => s.reorderReferences);
  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="references">
      <SectionHeading>Referencje</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[0.9em]">
          {items.map((item) => (
            <RefRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj referencję
      </button>
    </section>
  );
}
