"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { LANGUAGE_LEVEL_LABELS, type LanguageLevel } from "@/lib/cv/schema";
import { MobileTextField } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";

const LEVEL_OPTIONS = Object.entries(LANGUAGE_LEVEL_LABELS) as Array<[LanguageLevel, string]>;

export function MobileLanguagesForm() {
  const languages = useCVStore((s) => s.cv.languages);
  const add = useCVStore((s) => s.addLanguage);
  const update = useCVStore((s) => s.updateLanguage);
  const remove = useCVStore((s) => s.removeLanguage);
  const reorder = useCVStore((s) => s.reorderLanguages);

  const moveBy = (idx: number, delta: number) => {
    const ids = languages.map((l) => l.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-3">
      {languages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-4 text-center text-[13px] text-[color:var(--ink-muted)]">
          Dodaj języki, którymi się posługujesz.
        </p>
      ) : null}
      {languages.map((lang, idx) => (
        <div
          key={lang.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Język #${idx + 1}`}
            index={idx}
            total={languages.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(lang.id)}
            confirmMessage="Usunąć język?"
          />
          <div className="space-y-2">
            <MobileTextField
              label="Język"
              value={lang.name}
              onChange={(e) => update(lang.id, { name: e.target.value })}
              placeholder="np. Angielski"
            />
            <div>
              <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                Poziom
              </span>
              <select
                value={lang.level}
                onChange={(e) => update(lang.id, { level: e.target.value as LanguageLevel })}
                className="w-full min-h-[44px] rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] px-3 py-2 text-[14px] font-medium text-ink outline-none transition-colors focus:border-[color:var(--ink)] focus:bg-white"
              >
                {LEVEL_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] py-3 text-[14px] font-semibold text-ink transition-colors hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj język
      </button>
    </div>
  );
}
