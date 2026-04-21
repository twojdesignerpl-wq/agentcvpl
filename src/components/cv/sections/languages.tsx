"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { LANGUAGE_LEVEL_LABELS, type LanguageLevel, type LanguageItem } from "@/lib/cv/schema";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";

const LEVELS: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "native"];

function LangRow({ item }: { item: LanguageItem }) {
  const updateLanguage = useCVStore((s) => s.updateLanguage);
  const removeLanguage = useCVStore((s) => s.removeLanguage);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li
      ref={rowRef}
      style={rowStyle}
      className="group grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-2"
    >
      <SortableHandle handleProps={handleProps} className="self-center" />
      <EditableText
        value={item.name}
        onChange={(v) => updateLanguage(item.id, { name: v })}
        placeholder="Język"
        className="text-[1em]"
      />
      <select
        value={item.level}
        onChange={(e) =>
          updateLanguage(item.id, { level: e.target.value as LanguageLevel })
        }
        aria-label="Poziom językowy"
        className="bg-transparent text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)] cursor-pointer"
      >
        {LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            {LANGUAGE_LEVEL_LABELS[lvl]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => removeLanguage(item.id)}
        aria-label="Usuń język"
        className="opacity-0 group-hover:opacity-70 hover:!opacity-100 transition text-[color:var(--cv-muted)]"
        tabIndex={-1}
      >
        <Trash size={10} />
      </button>
    </li>
  );
}

export function TemplateLanguages() {
  const items = useCVStore((s) => s.cv.languages);
  const addLanguage = useCVStore((s) => s.addLanguage);
  const reorderLanguages = useCVStore((s) => s.reorderLanguages);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="languages">
      <SectionHeading>Języki</SectionHeading>
      <SortableList ids={ids} onReorder={reorderLanguages}>
        <ul className="flex flex-col gap-[0.5em]">
          {items.map((item) => (
            <LangRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addLanguage}
        className="mt-[0.8em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj język
      </button>
    </section>
  );
}
