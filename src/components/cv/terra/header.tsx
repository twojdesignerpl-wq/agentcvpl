"use client";

import { useState, type ComponentType } from "react";
import { EditableText } from "@/components/cv/editable/editable-text";
import { PhotoUpload } from "@/components/cv/photo-upload";
import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import {
  At,
  LinkSimple,
  MapPin,
  Phone,
  Plus,
  X,
} from "@phosphor-icons/react/dist/ssr";

type IconComponent = ComponentType<{ size?: number; weight?: "regular" | "fill" | "bold" }>;

const FIELDS: Array<{ id: ContactField; placeholder: string; label: string; Icon: IconComponent }> = [
  { id: "email", placeholder: "email@domena.pl", label: "Email", Icon: At },
  { id: "website", placeholder: "Portfolio", label: "Portfolio", Icon: LinkSimple },
  { id: "address", placeholder: "Miasto / adres", label: "Lokalizacja", Icon: MapPin },
  { id: "phone", placeholder: "+48 000 000 000", label: "Telefon", Icon: Phone },
];

export function TerraHeader() {
  const personal = useCVStore((s) => s.cv.personal);
  const photoShape = useCVStore((s) => s.cv.settings.photoShape);
  const hiddenFields = useCVStore((s) => s.cv.settings.hiddenContactFields ?? []);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setContactFieldHidden = useCVStore((s) => s.setContactFieldHidden);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const hiddenSet = new Set(hiddenFields);
  const visible = FIELDS.filter((f) => !hiddenSet.has(f.id));
  const hidden = FIELDS.filter((f) => hiddenSet.has(f.id));

  return (
    <header data-cv-section="header-terra">
      <div className="flex items-center gap-[6mm]">
        {photoShape !== "none" ? (
          <PhotoUpload
            photo={personal.photo}
            shape={photoShape}
            onChange={setPhoto}
            size={82}
            alt={`${personal.firstName} ${personal.lastName}`.trim() || "Zdjęcie profilowe"}
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-[1mm]">
          <h1 className="terra-serif flex flex-wrap items-baseline gap-[0.35em] text-[calc(var(--cv-font-size)*2.75)] font-normal italic leading-[1.0] tracking-[-0.015em] text-[color:var(--cv-ink)]">
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
            className="mt-[1.5mm] text-[calc(var(--cv-font-size)*0.82)] font-semibold uppercase tracking-[0.22em] text-[color:var(--cv-accent)]"
          />
        </div>
      </div>

      <div className="mt-[5mm] h-px w-full bg-[color:var(--cv-line)]" />

      <ul className="mt-[3.5mm] flex flex-wrap items-center gap-x-[6mm] gap-y-[1.5mm] text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-ink)]">
        {visible.map(({ id, placeholder, label, Icon }) => (
          <li key={id} className="group inline-flex items-center gap-[0.45em]">
            <Icon size={11} weight="regular" />
            <EditableText
              value={personal[id]}
              onChange={(v) => updatePersonal({ [id]: v })}
              placeholder={placeholder}
              className="min-w-0"
            />
            <button
              type="button"
              onClick={() => setContactFieldHidden(id, true)}
              aria-label={`Usuń pole ${label}`}
              tabIndex={-1}
              className="inline-flex h-[14px] w-[14px] items-center justify-center rounded-full text-[color:var(--cv-muted)] opacity-40 transition hover:bg-[color:color-mix(in_oklab,var(--cv-ink)_8%,transparent)] hover:opacity-100"
            >
              <X size={11} weight="bold" />
            </button>
          </li>
        ))}
        {hidden.length > 0 ? (
          <li className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="inline-flex items-center gap-1 text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-accent)] transition"
            >
              <Plus size={10} weight="bold" /> Dodaj pole
            </button>
            {showAddMenu ? (
              <div className="absolute left-0 top-full z-30 mt-1 w-[160px] rounded-md border border-[color:var(--cv-line)] bg-white shadow-md overflow-hidden">
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
          </li>
        ) : null}
      </ul>
    </header>
  );
}
