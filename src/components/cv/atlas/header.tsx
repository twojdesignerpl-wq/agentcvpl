"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { PhotoUpload } from "@/components/cv/photo-upload";
import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import {
  EnvelopeSimple,
  MapPin,
  Compass,
  Phone,
  Plus,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useState, type ComponentType } from "react";

const FIELDS: Array<{ id: ContactField; placeholder: string; label: string; Icon: ComponentType<{ size?: number; weight?: "regular" | "fill" | "bold" }> }> = [
  { id: "email", placeholder: "email@domena.pl", label: "Email", Icon: EnvelopeSimple },
  { id: "address", placeholder: "Adres", label: "Adres", Icon: MapPin },
  { id: "website", placeholder: "www.twojastrona.pl", label: "Strona", Icon: Compass },
  { id: "phone", placeholder: "+48 000 000 000", label: "Telefon", Icon: Phone },
];

export function AtlasHeader() {
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
    <header className="flex items-start gap-[7mm]">
      {photoShape !== "none" ? (
        <PhotoUpload
          photo={personal.photo}
          shape={photoShape}
          onChange={setPhoto}
          size={106}
          alt={`${personal.firstName} ${personal.lastName}`.trim() || "Zdjęcie profilowe"}
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-[1.5mm] min-w-0 pt-[1mm]">
        <EditableText
          value={personal.role}
          onChange={(v) => updatePersonal({ role: v })}
          placeholder="Twoja rola zawodowa"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.9)] font-semibold uppercase tracking-[0.08em] text-[color:var(--cv-accent)]"
        />
        <h1 className="flex flex-wrap items-baseline gap-[0.3em] text-[calc(var(--cv-font-size)*2.6)] font-bold leading-[1.04] tracking-[-0.02em] text-[color:var(--cv-ink)]">
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

        <ul className="mt-[1mm] flex flex-col gap-[0.55em]">
          {visible.map(({ id, placeholder, label, Icon }) => (
            <li
              key={id}
              className="group flex items-center gap-[0.6em] text-[calc(var(--cv-font-size)*0.92)] text-[color:var(--cv-ink)]"
            >
              <span
                className="inline-flex h-[1.55em] w-[1.55em] shrink-0 items-center justify-center rounded-full border border-[color:var(--cv-accent)] text-[color:var(--cv-accent)]"
                aria-hidden
              >
                <Icon size={12} weight="regular" />
              </span>
              <EditableText
                value={personal[id]}
                onChange={(v) => updatePersonal({ [id]: v })}
                placeholder={placeholder}
                className="flex-1 min-w-0"
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
            <li className="relative mt-[0.2em]">
              <button
                type="button"
                onClick={() => setShowAddMenu((v) => !v)}
                className="inline-flex items-center gap-1 text-[calc(var(--cv-font-size)*0.82)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
              >
                <Plus size={10} weight="bold" /> Dodaj pole
              </button>
              {showAddMenu ? (
                <div className="absolute left-0 top-full z-30 mt-1 w-[150px] rounded-md border border-[color:var(--cv-line)] bg-white shadow-md overflow-hidden">
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
      </div>
    </header>
  );
}
