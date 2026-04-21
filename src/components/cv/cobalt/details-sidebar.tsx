"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { CobaltSectionHeading } from "./section-heading";

const FIELDS: Array<{ id: ContactField; placeholder: string; label: string }> = [
  { id: "address", placeholder: "Miasto, kraj", label: "Adres" },
  { id: "phone", placeholder: "+48 000 000 000", label: "Telefon" },
  { id: "email", placeholder: "email@domena.pl", label: "Email" },
];

export function CobaltDetailsSidebar() {
  const personal = useCVStore((s) => s.cv.personal);
  const hiddenFields = useCVStore((s) => s.cv.settings.hiddenContactFields ?? []);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const setContactFieldHidden = useCVStore((s) => s.setContactFieldHidden);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const hiddenSet = new Set(hiddenFields);
  const visible = FIELDS.filter((f) => !hiddenSet.has(f.id));
  const hidden = FIELDS.filter((f) => hiddenSet.has(f.id));

  return (
    <section data-cv-section="details-cobalt">
      <CobaltSectionHeading>Kontakt</CobaltSectionHeading>
      <dl className="flex flex-col gap-[2.4mm]">
        {visible.map(({ id, placeholder, label }) => (
          <div key={id} className="group">
            <dt className="cobalt-display text-[calc(var(--cv-font-size)*0.85)] font-bold text-[color:var(--cv-ink)]">
              <span className="inline-flex items-center gap-1.5">
                {label}
                <button
                  type="button"
                  onClick={() => setContactFieldHidden(id, true)}
                  aria-label={`Usuń pole ${label}`}
                  tabIndex={-1}
                  className="inline-flex h-[14px] w-[14px] items-center justify-center rounded-full text-[color:var(--cv-muted)] opacity-40 transition hover:bg-[color:color-mix(in_oklab,var(--cv-ink)_8%,transparent)] hover:opacity-100"
                >
                  <X size={11} weight="bold" />
                </button>
              </span>
            </dt>
            <dd className="text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-ink)]">
              <EditableText
                value={personal[id]}
                onChange={(v) => updatePersonal({ [id]: v })}
                placeholder={placeholder}
              />
            </dd>
          </div>
        ))}
        {hidden.length > 0 ? (
          <div className="relative mt-[1mm]">
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="inline-flex items-center gap-1 text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
            >
              <Plus size={10} weight="bold" /> Dodaj pole
            </button>
            {showAddMenu ? (
              <div className="absolute left-0 top-full z-30 mt-1 w-[140px] rounded-md border border-[color:var(--cv-line)] bg-[color:var(--cv-bg)] shadow-md overflow-hidden">
                {hidden.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setContactFieldHidden(id, false);
                      setShowAddMenu(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-[calc(var(--cv-font-size)*0.88)] text-[color:var(--cv-ink)] hover:bg-[color:var(--cv-line-soft)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </dl>
    </section>
  );
}
