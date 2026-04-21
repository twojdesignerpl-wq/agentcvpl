"use client";

import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import type { CustomSection } from "@/lib/cv/schema";
import { MobileTextField, MobileTextarea } from "./mobile-field";
import { MobileTagInput } from "./tag-input";
import { cn } from "@/lib/utils";

type Layout = CustomSection["layout"];

const LAYOUTS: Array<{ id: Layout; label: string; description: string }> = [
  { id: "list", label: "Lista", description: "Pozycje z tytułem, meta i opisem" },
  { id: "paragraph", label: "Akapit", description: "Jeden blok tekstu" },
  { id: "tags", label: "Tagi", description: "Słowa kluczowe / chipy" },
];

export function MobileCustomSectionsForm() {
  const sections = useCVStore((s) => s.cv.customSections);
  const add = useCVStore((s) => s.addCustomSection);
  const update = useCVStore((s) => s.updateCustomSection);
  const remove = useCVStore((s) => s.removeCustomSection);
  const addItem = useCVStore((s) => s.addCustomSectionItem);
  const updateItem = useCVStore((s) => s.updateCustomSectionItem);
  const removeItem = useCVStore((s) => s.removeCustomSectionItem);

  return (
    <div className="space-y-3">
      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak własnych sekcji. Dodaj coś nietypowego — sport, prowadzone kursy, mentoring.
        </p>
      ) : null}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
              Sekcja #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm("Usunąć sekcję i jej zawartość?")) remove(section.id);
              }}
              aria-label={`Usuń sekcję ${idx + 1}`}
              className="tap-target -mr-2 inline-flex items-center justify-center rounded-full text-rose-600 hover:bg-rose-50"
            >
              <Trash size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <MobileTextField
              label="Tytuł sekcji"
              value={section.title}
              onChange={(e) => update(section.id, { title: e.target.value })}
              placeholder="np. Kursy, Sport, Patenty"
            />
            <div>
              <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                Układ
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {LAYOUTS.map((l) => {
                  const active = section.layout === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => update(section.id, { layout: l.id })}
                      aria-pressed={active}
                      className={cn(
                        "tap-target rounded-xl border px-2 py-2 text-center text-[12px] font-semibold transition-colors",
                        active
                          ? "border-[color:var(--ink)] bg-ink text-cream"
                          : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] text-ink hover:border-[color:var(--ink)]",
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11.5px] text-[color:var(--ink-muted)]">
                {LAYOUTS.find((l) => l.id === section.layout)?.description}
              </p>
            </div>

            {section.layout === "list" ? (
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-2.5"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="mono-label text-[0.54rem] text-[color:var(--ink-muted)]">
                        Pozycja #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(section.id, item.id)}
                        aria-label="Usuń pozycję"
                        className="tap-target inline-flex items-center justify-center rounded-full text-rose-600 hover:bg-rose-50"
                      >
                        <Trash size={13} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <MobileTextField
                        label="Tytuł"
                        value={item.primary}
                        onChange={(e) =>
                          updateItem(section.id, item.id, { primary: e.target.value })
                        }
                        placeholder="np. Prince2 Foundation"
                      />
                      <MobileTextField
                        label="Dodatkowo (data, miejsce, meta)"
                        value={item.secondary}
                        onChange={(e) =>
                          updateItem(section.id, item.id, { secondary: e.target.value })
                        }
                        placeholder="np. 2023"
                      />
                      <MobileTextarea
                        label="Opis"
                        value={item.body}
                        onChange={(e) =>
                          updateItem(section.id, item.id, { body: e.target.value })
                        }
                        rows={2}
                        placeholder="Szczegóły, kontekst."
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(section.id)}
                  className="tap-target flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-2.5 text-[12.5px] font-semibold text-ink hover:border-[color:var(--ink)]"
                >
                  <Plus size={12} weight="bold" /> Dodaj pozycję
                </button>
              </div>
            ) : null}

            {section.layout === "paragraph" ? (
              <MobileTextarea
                label="Treść"
                value={section.paragraph}
                onChange={(e) => update(section.id, { paragraph: e.target.value })}
                rows={4}
                placeholder="Jeden akapit treści."
              />
            ) : null}

            {section.layout === "tags" ? (
              <MobileTagInput
                label="Tagi"
                values={section.tags}
                onChange={(next) => update(section.id, { tags: next })}
                placeholder="np. Photoshop, Figma"
                hint="Enter aby dodać"
              />
            ) : null}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj własną sekcję
      </button>
    </div>
  );
}
