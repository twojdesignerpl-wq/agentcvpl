"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Microphone, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { ConferenceItem } from "@/lib/cv/schema";

function ConfRow({ item }: { item: ConferenceItem }) {
  const update = useCVStore((s) => s.updateConference);
  const remove = useCVStore((s) => s.removeConference);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  const dateText =
    item.month && item.year ? `${item.month}.${item.year}` : item.year || "";

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.title}
            onChange={(v) => update(item.id, { title: v })}
            placeholder="Tytuł prelekcji / tematyka"
            as="p"
            className="font-semibold text-[1em] leading-snug"
          />
          <EditableText
            value={dateText}
            onChange={(v) => {
              const [m, y] = v.includes(".") ? v.split(".") : ["", v];
              update(item.id, { month: m ?? "", year: y ?? "" });
            }}
            placeholder="MM.RRRR"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)] tabular-nums"
          />
        </div>
        <div className="flex items-baseline justify-between gap-2 text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-muted)]">
          <EditableText
            value={item.event}
            onChange={(v) => update(item.id, { event: v })}
            placeholder="Nazwa konferencji / wydarzenia"
          />
          <EditableText
            value={item.role}
            onChange={(v) => update(item.id, { role: v })}
            placeholder="Rola (prelegent/uczestnik)"
            className="text-[calc(var(--cv-font-size)*0.85)]"
          />
        </div>
        <EditableText
          value={item.description}
          onChange={(v) => update(item.id, { description: v })}
          placeholder="Krótki opis (opcjonalnie)"
          multiline
          as="p"
          className="mt-[0.35em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.url}
            onChange={(v) => update(item.id, { url: v })}
            placeholder="Link do nagrania / slajdów"
            className="text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)]"
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label="Usuń konferencję"
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

export function TemplateConferences() {
  const items = useCVStore((s) => s.cv.conferences);
  const add = useCVStore((s) => s.addConference);
  const reorder = useCVStore((s) => s.reorderConferences);
  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="conferences">
      <SectionHeading>Konferencje i prelekcje</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[0.9em]">
          {items.map((item) => (
            <ConfRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Microphone size={11} weight="regular" /> Dodaj konferencję
        <Plus size={10} weight="bold" className="opacity-60" />
      </button>
    </section>
  );
}
