"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";
import { MobileDateRange } from "./date-range";
import { MobileArrayCardHeader } from "./array-card-header";

export function MobileEducationForm() {
  const education = useCVStore((s) => s.cv.education);
  const add = useCVStore((s) => s.addEducation);
  const update = useCVStore((s) => s.updateEducation);
  const remove = useCVStore((s) => s.removeEducation);
  const reorder = useCVStore((s) => s.reorderEducation);

  const moveBy = (idx: number, delta: number) => {
    const ids = education.map((e) => e.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-4">
      {education.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak wpisów. Dodaj pierwszą szkołę / uczelnię.
        </p>
      ) : null}
      {education.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3 shadow-[0_1px_2px_rgba(10,14,26,0.04)]"
        >
          <MobileArrayCardHeader
            label={`Wpis #${idx + 1}`}
            index={idx}
            total={education.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć ten wpis edukacji?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Szkoła / uczelnia"
              value={item.school}
              onChange={(e) => update(item.id, { school: e.target.value })}
              placeholder="np. Politechnika Warszawska"
            />
            <div className="grid grid-cols-2 gap-2">
              <MobileTextField
                label="Kierunek / stopień"
                value={item.degree}
                onChange={(e) => update(item.id, { degree: e.target.value })}
                placeholder="Informatyka, inż."
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
              labelCurrent="Obecnie się uczę"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] py-3 text-[14px] font-semibold text-ink transition-colors hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj wykształcenie
      </button>
    </div>
  );
}
