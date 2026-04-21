"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { PhotoUpload } from "@/components/cv/photo-upload";
import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

const CONTACT_FIELDS: Array<{ id: ContactField; label: string; placeholder: string }> = [
  { id: "address", label: "Adres", placeholder: "Miasto, kraj" },
  { id: "phone", label: "Telefon", placeholder: "+48 000 000 000" },
  { id: "email", label: "Email", placeholder: "email@domena.pl" },
  { id: "website", label: "Strona", placeholder: "www.twojastrona.pl" },
];

export function LumenHeader() {
  const personal = useCVStore((s) => s.cv.personal);
  const photoShape = useCVStore((s) => s.cv.settings.photoShape);
  const hiddenFields = useCVStore((s) => s.cv.settings.hiddenContactFields ?? []);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setContactFieldHidden = useCVStore((s) => s.setContactFieldHidden);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const hiddenSet = new Set(hiddenFields);
  const visible = CONTACT_FIELDS.filter((f) => !hiddenSet.has(f.id));
  const hidden = CONTACT_FIELDS.filter((f) => hiddenSet.has(f.id));

  return (
    <header className="flex flex-col items-center text-center">
      {photoShape !== "none" ? (
        <div className="mb-[8mm]">
          <PhotoUpload
            photo={personal.photo}
            shape={photoShape}
            onChange={setPhoto}
            size={104}
            alt={`${personal.firstName} ${personal.lastName}`.trim() || "Zdjęcie profilowe"}
          />
        </div>
      ) : null}

      <h1 className="lumen-display flex flex-wrap items-baseline justify-center gap-[0.3em] text-[calc(var(--cv-font-size)*2.95)] leading-[1.0] text-[color:var(--cv-ink)]">
        <EditableText
          value={personal.firstName}
          onChange={(v) => updatePersonal({ firstName: v })}
          placeholder="Imię"
          as="span"
        />
        <EditableText
          value={personal.lastName}
          onChange={(v) => updatePersonal({ lastName: v })}
          placeholder="Nazwisko"
          as="span"
        />
      </h1>

      <EditableText
        value={personal.role}
        onChange={(v) => updatePersonal({ role: v })}
        placeholder="Twoja rola zawodowa"
        as="p"
        className="lumen-eyebrow mt-[3mm] text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-ink)]"
      />

      {visible.length > 0 ? (
        <div
          className="mt-[8mm] grid w-full gap-x-[6mm] gap-y-[3mm] text-left"
          style={{ gridTemplateColumns: `repeat(${Math.min(visible.length, 3)}, minmax(0, 1fr))` }}
        >
          {visible.map(({ id, label, placeholder }) => (
            <div key={id} className="group flex flex-col gap-[1mm]">
              <div className="lumen-display flex items-center gap-1 text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-ink)]">
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => setContactFieldHidden(id, true)}
                  aria-label={`Usuń pole ${label}`}
                  tabIndex={-1}
                  className="inline-flex h-[14px] w-[14px] items-center justify-center rounded-full text-[color:var(--cv-muted)] opacity-40 transition hover:bg-[color:color-mix(in_oklab,var(--cv-ink)_8%,transparent)] hover:opacity-100"
                >
                  <X size={11} weight="bold" />
                </button>
              </div>
              <EditableText
                value={personal[id]}
                onChange={(v) => updatePersonal({ [id]: v })}
                placeholder={placeholder}
                className="text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-muted)]"
              />
            </div>
          ))}
        </div>
      ) : null}

      {hidden.length > 0 ? (
        <div className="relative mt-[3mm] self-start">
          <button
            type="button"
            onClick={() => setShowAddMenu((v) => !v)}
            className="inline-flex items-center gap-1 text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
          >
            <Plus size={10} weight="bold" /> Dodaj pole
          </button>
          {showAddMenu ? (
            <div className="absolute left-0 top-full z-30 mt-1 w-[150px] rounded-md border border-[color:var(--cv-line)] bg-[color:var(--cv-bg)] shadow-md overflow-hidden">
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
    </header>
  );
}
