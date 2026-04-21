"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField, MobileTextarea } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileAwardsForm() {
  const items = useCVStore((s) => s.cv.awards);
  const add = useCVStore((s) => s.addAward);
  const update = useCVStore((s) => s.updateAward);
  const remove = useCVStore((s) => s.removeAward);
  const reorder = useCVStore((s) => s.reorderAwards);

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((a) => a.id);
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
          Brak wpisów. Konkursy, wyróżnienia branżowe.
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Nagroda #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć nagrodę?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Nazwa"
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder="np. Developer of the Year"
            />
            <div className="grid grid-cols-[1fr_100px] gap-2">
              <MobileTextField
                label="Wystawca"
                value={item.issuer}
                onChange={(e) => update(item.id, { issuer: e.target.value })}
                placeholder="np. Forbes"
              />
              <MobileTextField
                label="Rok"
                inputMode="numeric"
                value={item.year}
                onChange={(e) => update(item.id, { year: e.target.value })}
                placeholder="2025"
              />
            </div>
            <MobileTextarea
              label="Opis (opcjonalnie)"
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              rows={2}
              placeholder="Za co wyróżnienie, kontekst."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj nagrodę
      </button>
    </div>
  );
}
