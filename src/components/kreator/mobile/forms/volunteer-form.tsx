"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";
import { MobileAITextarea } from "./mobile-ai-textarea";
import { MobileDateRange } from "./date-range";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileVolunteerForm() {
  const items = useCVStore((s) => s.cv.volunteer);
  const add = useCVStore((s) => s.addVolunteer);
  const update = useCVStore((s) => s.updateVolunteer);
  const remove = useCVStore((s) => s.removeVolunteer);
  const reorder = useCVStore((s) => s.reorderVolunteer);

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((v) => v.id);
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
          Brak wpisów. Fundacje, WOŚP, Caritas, mentoring.
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Wolontariat #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć ten wpis wolontariatu?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Rola"
              value={item.role}
              onChange={(e) => update(item.id, { role: e.target.value })}
              placeholder="np. Mentor, koordynator"
            />
            <div className="grid grid-cols-2 gap-2">
              <MobileTextField
                label="Organizacja"
                value={item.organization}
                onChange={(e) => update(item.id, { organization: e.target.value })}
                placeholder="np. WOŚP"
              />
              <MobileTextField
                label="Lokalizacja"
                value={item.location}
                onChange={(e) => update(item.id, { location: e.target.value })}
                placeholder="Warszawa"
              />
            </div>
            <MobileDateRange
              value={{
                startYear: item.startYear,
                startMonth: item.startMonth,
                endYear: item.endYear,
                endMonth: item.endMonth,
                current: item.current,
              }}
              onChange={(patch) => update(item.id, patch)}
              labelCurrent="Nadal się angażuję"
            />
            <MobileAITextarea
              label="Opis (opcjonalnie)"
              value={item.description}
              onChange={(text) => update(item.id, { description: text })}
              rows={3}
              placeholder="Co robisz, jaki masz wpływ."
              aiField={`volunteer.${item.id}.description`}
              aiFieldLabel={`Wolontariat · ${item.role || item.organization || "Wpis"}`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj wolontariat
      </button>
    </div>
  );
}
