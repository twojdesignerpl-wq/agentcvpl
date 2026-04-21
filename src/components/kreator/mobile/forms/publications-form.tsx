"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField, MobileTextarea } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobilePublicationsForm() {
  const items = useCVStore((s) => s.cv.publications);
  const add = useCVStore((s) => s.addPublication);
  const update = useCVStore((s) => s.updatePublication);
  const remove = useCVStore((s) => s.removePublication);
  const reorder = useCVStore((s) => s.reorderPublications);

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((p) => p.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak wpisów. Artykuły, książki, blog.
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Publikacja #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć publikację?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Tytuł"
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder="np. Architektura monolitów w 2026"
            />
            <MobileTextField
              label="Autorzy"
              value={item.authors}
              onChange={(e) => update(item.id, { authors: e.target.value })}
              placeholder="Jan Kowalski, Anna Nowak"
            />
            <div className="grid grid-cols-[1fr_100px] gap-2">
              <MobileTextField
                label="Miejsce / magazyn"
                value={item.venue}
                onChange={(e) => update(item.id, { venue: e.target.value })}
                placeholder="np. InfoQ"
              />
              <MobileTextField
                label="Rok"
                inputMode="numeric"
                value={item.year}
                onChange={(e) => update(item.id, { year: e.target.value })}
                placeholder="2025"
              />
            </div>
            <MobileTextField
              label="Link"
              type="url"
              inputMode="url"
              value={item.url}
              onChange={(e) => update(item.id, { url: e.target.value })}
              placeholder="https://…"
            />
            <MobileTextarea
              label="Opis (opcjonalnie)"
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              rows={2}
              placeholder="O czym publikacja, Twoja rola."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj publikację
      </button>
    </div>
  );
}
