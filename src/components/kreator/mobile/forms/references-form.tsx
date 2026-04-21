"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileReferencesForm() {
  const items = useCVStore((s) => s.cv.references);
  const add = useCVStore((s) => s.addReference);
  const update = useCVStore((s) => s.updateReference);
  const remove = useCVStore((s) => s.removeReference);
  const reorder = useCVStore((s) => s.reorderReferences);

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((r) => r.id);
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
          Brak wpisów. Osoby, które mogą poręczyć (byli szefowie, współpracownicy).
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Referencja #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć referencję?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Imię i nazwisko"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="np. Anna Nowak"
            />
            <div className="grid grid-cols-2 gap-2">
              <MobileTextField
                label="Stanowisko"
                value={item.title}
                onChange={(e) => update(item.id, { title: e.target.value })}
                placeholder="np. Tech Lead"
              />
              <MobileTextField
                label="Firma"
                value={item.company}
                onChange={(e) => update(item.id, { company: e.target.value })}
                placeholder="np. Allegro"
              />
            </div>
            <MobileTextField
              label="Kontakt"
              value={item.contact}
              onChange={(e) => update(item.id, { contact: e.target.value })}
              placeholder="e-mail lub telefon"
              hint="Za zgodą osoby"
            />
            <MobileTextField
              label="Relacja"
              value={item.relation}
              onChange={(e) => update(item.id, { relation: e.target.value })}
              placeholder="np. Bezpośredni przełożony 2022-2024"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj referencję
      </button>
    </div>
  );
}
