"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { PhotoUpload } from "@/components/cv/photo-upload";
import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

const CONTACT_FIELD_LABELS: Record<ContactField, string> = {
  address: "Adres",
  email: "Email",
  website: "Strona",
  phone: "Telefon",
};

const CONTACT_FIELD_PLACEHOLDERS: Record<ContactField, string> = {
  address: "Adres",
  email: "email@domena.pl",
  website: "www.twojastrona.pl",
  phone: "+48 000 000 000",
};

export function TemplateHeader() {
  const personal = useCVStore((s) => s.cv.personal);
  const photoShape = useCVStore((s) => s.cv.settings.photoShape);
  const hiddenFields = useCVStore((s) => s.cv.settings.hiddenContactFields ?? []);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setContactFieldHidden = useCVStore((s) => s.setContactFieldHidden);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const order: ContactField[] = ["address", "email", "website", "phone"];
  const hiddenSet = new Set(hiddenFields);
  const visibleFields = order.filter((f) => !hiddenSet.has(f));
  const hiddenList = order.filter((f) => hiddenSet.has(f));

  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-start gap-x-[6mm]">
      {photoShape === "none" ? (
        <div className="w-0 h-0" aria-hidden />
      ) : (
        <PhotoUpload
          photo={personal.photo}
          shape={photoShape}
          onChange={setPhoto}
          size={86}
          alt={`${personal.firstName} ${personal.lastName}`.trim() || "Zdjęcie profilowe"}
        />
      )}

      <div className="flex flex-col justify-center gap-[2mm] pt-[1mm] min-w-0">
        <h1 className="leading-[1.0] text-[calc(var(--cv-font-size)*2.7)] font-bold tracking-[-0.01em]">
          <EditableText
            value={personal.firstName}
            onChange={(v) => updatePersonal({ firstName: v })}
            placeholder="Imię"
            as="span"
            className="block"
          />
          <EditableText
            value={personal.lastName}
            onChange={(v) => updatePersonal({ lastName: v })}
            placeholder="Nazwisko"
            as="span"
            className="block"
          />
        </h1>
        <EditableText
          value={personal.role}
          onChange={(v) => updatePersonal({ role: v })}
          placeholder="Twoja rola zawodowa"
          as="p"
          className="text-[color:var(--cv-muted)] text-[calc(var(--cv-font-size)*1.05)]"
        />
      </div>

      <address className="not-italic flex flex-col items-end gap-[0.4em] text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-ink)] pt-[3mm]">
        {visibleFields.map((field) => (
          <div key={field} className="group flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setContactFieldHidden(field, true)}
              aria-label={`Usuń pole ${CONTACT_FIELD_LABELS[field]}`}
              tabIndex={-1}
              className="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full text-[color:var(--cv-muted)] opacity-40 transition hover:bg-[color:color-mix(in_oklab,var(--cv-ink)_8%,transparent)] hover:opacity-100"
            >
              <X size={11} weight="bold" />
            </button>
            <EditableText
              value={personal[field]}
              onChange={(v) => updatePersonal({ [field]: v })}
              placeholder={CONTACT_FIELD_PLACEHOLDERS[field]}
              className="text-right"
            />
          </div>
        ))}
        {hiddenList.length > 0 ? (
          <div className="relative mt-[1mm]">
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="inline-flex items-center gap-1 text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
            >
              <Plus size={10} weight="bold" /> Dodaj pole
            </button>
            {showAddMenu ? (
              <div className="absolute right-0 top-full z-30 mt-1 w-[150px] rounded-md border border-[color:var(--cv-line)] bg-white shadow-md overflow-hidden">
                {hiddenList.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => {
                      setContactFieldHidden(field, false);
                      setShowAddMenu(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-[calc(var(--cv-font-size)*0.88)] text-[color:var(--cv-ink)] hover:bg-[color:var(--cv-line-soft)]"
                  >
                    {CONTACT_FIELD_LABELS[field]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </address>
    </header>
  );
}
