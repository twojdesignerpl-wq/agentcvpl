"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { EditableTagList } from "@/components/cv/editable/editable-tag-list";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { CustomSection, CustomSectionItem } from "@/lib/cv/schema";

function ItemRow({
  sectionId,
  item,
}: {
  sectionId: string;
  item: CustomSectionItem;
}) {
  const update = useCVStore((s) => s.updateCustomSectionItem);
  const remove = useCVStore((s) => s.removeCustomSectionItem);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.primary}
            onChange={(v) => update(sectionId, item.id, { primary: v })}
            placeholder="Tytuł / nazwa"
            as="p"
            className="font-semibold text-[1em] leading-snug"
          />
          <EditableText
            value={item.secondary}
            onChange={(v) => update(sectionId, item.id, { secondary: v })}
            placeholder="Data / lokalizacja"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)]"
          />
        </div>
        <EditableText
          value={item.body}
          onChange={(v) => update(sectionId, item.id, { body: v })}
          placeholder="Opis (opcjonalnie)"
          multiline
          as="p"
          className="mt-[0.3em] text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
        />
        <button
          type="button"
          onClick={() => remove(sectionId, item.id)}
          aria-label="Usuń element"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

function CustomSectionBlock({ section }: { section: CustomSection }) {
  const update = useCVStore((s) => s.updateCustomSection);
  const remove = useCVStore((s) => s.removeCustomSection);
  const addItem = useCVStore((s) => s.addCustomSectionItem);

  const itemIds = section.items.map((i) => i.id);

  const reorderItems = (newIds: string[]) => {
    const map = new Map(section.items.map((i) => [i.id, i] as const));
    const next = newIds.map((id) => map.get(id)).filter(Boolean) as CustomSectionItem[];
    update(section.id, { items: next });
  };

  return (
    <section data-cv-section="custom" className="group/section relative">
      <div className="flex items-baseline justify-between gap-2 mb-[1em]">
        <EditableText
          value={section.title}
          onChange={(v) => update(section.id, { title: v })}
          placeholder="Własna sekcja"
          as="h2"
          className="font-bold text-[calc(var(--cv-font-size)*1.2)] tracking-[-0.005em] leading-tight"
        />
        <div className="flex items-center gap-1.5">
          <select
            value={section.layout}
            onChange={(e) =>
              update(section.id, {
                layout: e.target.value as CustomSection["layout"],
              })
            }
            aria-label="Układ sekcji"
            className="text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] bg-transparent cursor-pointer opacity-0 group-hover/section:opacity-100 transition"
          >
            <option value="list">Lista pozycji</option>
            <option value="paragraph">Akapit</option>
            <option value="tags">Tagi</option>
          </select>
          <button
            type="button"
            onClick={() => remove(section.id)}
            aria-label="Usuń sekcję"
            className="text-[color:var(--cv-muted)] opacity-0 group-hover/section:opacity-70 hover:!opacity-100 transition"
            tabIndex={-1}
          >
            <Trash size={12} />
          </button>
        </div>
      </div>

      {section.layout === "list" ? (
        <>
          <SortableList ids={itemIds} onReorder={reorderItems}>
            <ul className="flex flex-col gap-[1em]">
              {section.items.map((it) => (
                <ItemRow key={it.id} sectionId={section.id} item={it} />
              ))}
            </ul>
          </SortableList>
          <button
            type="button"
            onClick={() => addItem(section.id)}
            className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
          >
            <Plus size={11} weight="bold" /> Dodaj pozycję
          </button>
        </>
      ) : null}

      {section.layout === "paragraph" ? (
        <EditableText
          value={section.paragraph}
          onChange={(v) => update(section.id, { paragraph: v })}
          placeholder="Wpisz tekst sekcji..."
          multiline
          as="p"
          className="text-[1em] leading-[1.55] text-[color:var(--cv-ink)]"
        />
      ) : null}

      {section.layout === "tags" ? (
        <EditableTagList
          items={section.tags}
          onChange={(next) => update(section.id, { tags: next })}
          placeholder="Dodaj tag"
          ariaLabel={section.title}
          className="text-[color:var(--cv-ink)]"
        />
      ) : null}
    </section>
  );
}

export function TemplateCustomSections() {
  const customSections = useCVStore((s) => s.cv.customSections);
  if (customSections.length === 0) return null;
  return (
    <>
      {customSections.map((s) => (
        <CustomSectionBlock key={s.id} section={s} />
      ))}
    </>
  );
}
