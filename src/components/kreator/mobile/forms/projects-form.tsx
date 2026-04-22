"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";
import { MobileAITextarea } from "./mobile-ai-textarea";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileProjectsForm() {
  const projects = useCVStore((s) => s.cv.projects);
  const add = useCVStore((s) => s.addProject);
  const update = useCVStore((s) => s.updateProject);
  const remove = useCVStore((s) => s.removeProject);
  const reorder = useCVStore((s) => s.reorderProjects);

  const moveBy = (idx: number, delta: number) => {
    const ids = projects.map((p) => p.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-3">
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak wpisów. Dodaj pierwszy projekt (side project, open source, portfolio).
        </p>
      ) : null}
      {projects.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Projekt #${idx + 1}`}
            index={idx}
            total={projects.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć projekt?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Nazwa"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="np. OpenBiblio"
            />
            <MobileTextField
              label="Link"
              type="url"
              inputMode="url"
              value={item.url}
              onChange={(e) => update(item.id, { url: e.target.value })}
              placeholder="https://github.com/…"
            />
            <MobileAITextarea
              label="Opis"
              value={item.description}
              onChange={(v) => update(item.id, { description: v })}
              rows={3}
              placeholder="Co robi projekt, Twoja rola, stack, wynik."
              aiField={`projects.${idx}.description`}
              aiFieldLabel={`Opis projektu: ${item.name || "bez nazwy"}`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj projekt
      </button>
    </div>
  );
}
