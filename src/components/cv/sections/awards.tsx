"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { AwardItem } from "@/lib/cv/schema";

function AwardRow({ item }: { item: AwardItem }) {
  const update = useCVStore((s) => s.updateAward);
  const remove = useCVStore((s) => s.removeAward);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.title}
            onChange={(v) => update(item.id, { title: v })}
            placeholder="Nazwa nagrody / wyróżnienia"
            as="p"
            className="font-semibold text-[1em] leading-snug"
          />
          <EditableText
            value={item.year}
            onChange={(v) => update(item.id, { year: v })}
            placeholder="Rok"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)] tabular-nums"
          />
        </div>
        <EditableText
          value={item.issuer}
          onChange={(v) => update(item.id, { issuer: v })}
          placeholder="Instytucja / organizator"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-muted)]"
        />
        <EditableText
          value={item.description}
          onChange={(v) => update(item.id, { description: v })}
          placeholder="Krótki opis (opcjonalnie)"
          multiline
          as="p"
          className="mt-[0.35em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <button
          type="button"
          onClick={() => remove(item.id)}
          aria-label="Usuń nagrodę"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateAwards() {
  const items = useCVStore((s) => s.cv.awards);
  const add = useCVStore((s) => s.addAward);
  const reorder = useCVStore((s) => s.reorderAwards);
  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="awards">
      <SectionHeading>Nagrody i wyróżnienia</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[0.9em]">
          {items.map((item) => (
            <AwardRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Trophy size={11} weight="regular" /> Dodaj nagrodę
        <Plus size={10} weight="bold" className="opacity-60" />
      </button>
    </section>
  );
}
