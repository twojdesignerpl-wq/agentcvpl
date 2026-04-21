"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MONTH_LABELS } from "@/lib/cv/schema";
import { MobileTextField, MobileTextarea } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";
import { MOBILE_SELECT_BASE as SELECT_BASE } from "./select-base";

export function MobileConferencesForm() {
  const items = useCVStore((s) => s.cv.conferences);
  const add = useCVStore((s) => s.addConference);
  const update = useCVStore((s) => s.updateConference);
  const remove = useCVStore((s) => s.removeConference);
  const reorder = useCVStore((s) => s.reorderConferences);

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((c) => c.id);
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
          Brak wpisów. Prelekcje, panele, meetupy.
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Konferencja #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć wystąpienie?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Tytuł wystąpienia"
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder="np. Next.js 16 w praktyce"
            />
            <MobileTextField
              label="Wydarzenie"
              value={item.event}
              onChange={(e) => update(item.id, { event: e.target.value })}
              placeholder="np. Warsaw JS Meetup"
            />
            <MobileTextField
              label="Rola"
              value={item.role}
              onChange={(e) => update(item.id, { role: e.target.value })}
              placeholder="Prelegent / panelista"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Miesiąc
                </span>
                <select
                  value={item.month}
                  onChange={(e) => update(item.id, { month: e.target.value })}
                  className={SELECT_BASE}
                >
                  <option value="">—</option>
                  {MONTH_LABELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
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
              placeholder="Temat, kontekst, publiczność."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj wystąpienie
      </button>
    </div>
  );
}
