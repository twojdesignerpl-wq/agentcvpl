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
import type { PublicationItem } from "@/lib/cv/schema";

function PubRow({ item }: { item: PublicationItem }) {
  const update = useCVStore((s) => s.updatePublication);
  const remove = useCVStore((s) => s.removePublication);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.title}
            onChange={(v) => update(item.id, { title: v })}
            placeholder="Tytuł publikacji"
            as="p"
            className="font-semibold text-[1em] leading-snug italic"
          />
          <EditableText
            value={item.year}
            onChange={(v) => update(item.id, { year: v })}
            placeholder="Rok"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)] tabular-nums"
          />
        </div>
        <EditableText
          value={item.authors}
          onChange={(v) => update(item.id, { authors: v })}
          placeholder="Autorzy (oddzielone przecinkami)"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-muted)]"
        />
        <EditableText
          value={item.venue}
          onChange={(v) => update(item.id, { venue: v })}
          placeholder="Czasopismo / wydawca / konferencja"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-ink)]"
        />
        <EditableText
          value={item.description}
          onChange={(v) => update(item.id, { description: v })}
          placeholder="Krótkie streszczenie (opcjonalnie)"
          multiline
          as="p"
          className="mt-[0.35em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.url}
            onChange={(v) => update(item.id, { url: v })}
            placeholder="DOI / link"
            className="text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)]"
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label="Usuń publikację"
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

export function TemplatePublications() {
  const items = useCVStore((s) => s.cv.publications);
  const add = useCVStore((s) => s.addPublication);
  const reorder = useCVStore((s) => s.reorderPublications);
  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="publications">
      <SectionHeading>Publikacje</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[1em]">
          {items.map((item) => (
            <PubRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj publikację
      </button>
    </section>
  );
}
