"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";
import { MobileAITextarea } from "./mobile-ai-textarea";
import { MobileDateRange } from "./date-range";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileEmploymentForm() {
  const employment = useCVStore((s) => s.cv.employment);
  const add = useCVStore((s) => s.addEmployment);
  const update = useCVStore((s) => s.updateEmployment);
  const remove = useCVStore((s) => s.removeEmployment);
  const reorder = useCVStore((s) => s.reorderEmployment);

  const moveBy = (idx: number, delta: number) => {
    const ids = employment.map((e) => e.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-4">
      {employment.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak wpisów. Dodaj pierwsze doświadczenie zawodowe.
        </p>
      ) : null}
      {employment.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3 shadow-[0_1px_2px_rgba(10,14,26,0.04)]"
        >
          <MobileArrayCardHeader
            label={`Pozycja #${idx + 1}`}
            index={idx}
            total={employment.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć tę pozycję doświadczenia?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Stanowisko"
              value={item.position}
              onChange={(e) => update(item.id, { position: e.target.value })}
              placeholder="np. Senior Frontend Developer"
            />
            <div className="grid grid-cols-2 gap-2">
              <MobileTextField
                label="Firma"
                value={item.company}
                onChange={(e) => update(item.id, { company: e.target.value })}
                placeholder="np. Allegro"
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
              labelCurrent="Obecnie tam pracuję"
            />
            <MobileAITextarea
              label="Opis obowiązków / osiągnięć"
              value={item.description}
              onChange={(text) => update(item.id, { description: text })}
              rows={4}
              placeholder={"• Co robiłeś?\n• Jaki miało to efekt (liczby, %)?\n• Jakie technologie?"}
              hint="Używaj bulletów i konkretów."
              aiField={`employment.${item.id}.description`}
              aiFieldLabel={`Opis · ${item.position || item.company || "Stanowisko"}`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] py-3 text-[14px] font-semibold text-ink transition-colors hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj stanowisko
      </button>
    </div>
  );
}
