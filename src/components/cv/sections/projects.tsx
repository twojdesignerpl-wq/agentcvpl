"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { SortableHandle, SortableList, useSortableRow } from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { ProjectItem } from "@/lib/cv/schema";

function ProjRow({ item }: { item: ProjectItem }) {
  const updateProject = useCVStore((s) => s.updateProject);
  const removeProject = useCVStore((s) => s.removeProject);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.name}
            onChange={(v) => updateProject(item.id, { name: v })}
            placeholder="Nazwa projektu"
            as="p"
            className="font-semibold text-[1em] leading-snug"
          />
          <EditableText
            value={item.url}
            onChange={(v) => updateProject(item.id, { url: v })}
            placeholder="link / repozytorium"
            className="text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)]"
          />
        </div>
        <EditableText
          value={item.description}
          onChange={(v) => updateProject(item.id, { description: v })}
          placeholder="Krótki opis — cel, efekt, technologie."
          multiline
          as="p"
          className="mt-[0.35em] text-[1em] leading-[1.5]"
        />
        <button
          type="button"
          onClick={() => removeProject(item.id)}
          aria-label="Usuń projekt"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateProjects() {
  const items = useCVStore((s) => s.cv.projects);
  const addProject = useCVStore((s) => s.addProject);
  const reorderProjects = useCVStore((s) => s.reorderProjects);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="projects">
      <SectionHeading>Projekty</SectionHeading>
      <SortableList ids={ids} onReorder={reorderProjects}>
        <ul className="flex flex-col gap-[1em]">
          {items.map((item) => (
            <ProjRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={addProject}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Plus size={11} weight="bold" /> Dodaj projekt
      </button>
    </section>
  );
}
