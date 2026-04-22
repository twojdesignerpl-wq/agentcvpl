"use client";

import { useCVStore } from "@/lib/cv/store";
import type { ContactField } from "@/lib/cv/schema";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CONTACT_FIELDS: Array<{ id: ContactField; label: string }> = [
  { id: "address", label: "Adres" },
  { id: "email", label: "E-mail" },
  { id: "website", label: "Strona / LinkedIn" },
  { id: "phone", label: "Telefon" },
];

export function StyleSheetAdvanced({ open, onClose }: Props) {
  const settings = useCVStore((s) => s.cv.settings);
  const hidden = settings.hiddenContactFields ?? [];
  const setContactFieldHidden = useCVStore((s) => s.setContactFieldHidden);

  const togglePhoto = useCVStore((s) => s.setPhotoShape);
  const toggleProfile = useCVStore((s) => s.toggleProfile);
  const toggleEmployment = useCVStore((s) => s.toggleEmployment);
  const toggleEducation = useCVStore((s) => s.toggleEducation);
  const toggleSkills = useCVStore((s) => s.toggleSkills);
  const toggleLinks = useCVStore((s) => s.toggleLinks);
  const toggleLanguages = useCVStore((s) => s.toggleLanguages);
  const toggleProjects = useCVStore((s) => s.toggleProjects);
  const toggleCertifications = useCVStore((s) => s.toggleCertifications);
  const toggleVolunteer = useCVStore((s) => s.toggleVolunteer);
  const togglePublications = useCVStore((s) => s.togglePublications);
  const toggleAwards = useCVStore((s) => s.toggleAwards);
  const toggleConferences = useCVStore((s) => s.toggleConferences);
  const toggleHobbies = useCVStore((s) => s.toggleHobbies);
  const toggleReferences = useCVStore((s) => s.toggleReferences);

  type Row = { label: string; checked: boolean; onChange: (next: boolean) => void; optional?: boolean };

  const base: Row[] = [
    { label: "Profil zawodowy", checked: settings.showProfile, onChange: toggleProfile },
    { label: "Doświadczenie", checked: settings.showEmployment, onChange: toggleEmployment },
    { label: "Edukacja", checked: settings.showEducation, onChange: toggleEducation },
    { label: "Umiejętności", checked: settings.showSkills, onChange: toggleSkills },
    { label: "Linki", checked: settings.showLinks, onChange: toggleLinks },
  ];

  const optional: Row[] = [
    { label: "Języki", checked: settings.showLanguages, onChange: toggleLanguages, optional: true },
    { label: "Projekty", checked: settings.showProjects, onChange: toggleProjects, optional: true },
    { label: "Certyfikaty", checked: settings.showCertifications, onChange: toggleCertifications, optional: true },
    { label: "Wolontariat", checked: settings.showVolunteer, onChange: toggleVolunteer, optional: true },
    { label: "Publikacje", checked: settings.showPublications, onChange: togglePublications, optional: true },
    { label: "Nagrody", checked: settings.showAwards, onChange: toggleAwards, optional: true },
    { label: "Konferencje", checked: settings.showConferences, onChange: toggleConferences, optional: true },
    { label: "Zainteresowania", checked: settings.showHobbies, onChange: toggleHobbies, optional: true },
    { label: "Referencje", checked: settings.showReferences, onChange: toggleReferences, optional: true },
  ];

  // voidunused
  void togglePhoto;

  return (
    <BottomSheet open={open} onClose={onClose} title="Zaawansowane" maxHeight="92dvh">
      <div className="flex flex-col gap-5 pb-2">
        <section>
          <h3 className="mono-label mb-2 text-[0.6rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            Sekcje podstawowe
          </h3>
          <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]">
            {base.map((r) => (
              <ToggleRow key={r.label} {...r} />
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mono-label mb-2 text-[0.6rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            Sekcje dodatkowe
          </h3>
          <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]">
            {optional.map((r) => (
              <ToggleRow key={r.label} {...r} />
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mono-label mb-2 text-[0.6rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            Pola kontaktu w CV
          </h3>
          <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]">
            {CONTACT_FIELDS.map((f) => {
              const isHidden = hidden.includes(f.id);
              return (
                <ToggleRow
                  key={f.id}
                  label={f.label}
                  checked={!isHidden}
                  onChange={(next) => setContactFieldHidden(f.id, !next)}
                />
              );
            })}
          </ul>
          <p className="mt-2 text-[12px] leading-snug text-[color:var(--ink-muted)]">
            Wyłączone pola znikają z podglądu CV — treść wpisana pozostaje zapisana.
          </p>
        </section>
      </div>
    </BottomSheet>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  optional,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  optional?: boolean;
}) {
  return (
    <li>
      <label className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 active:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-[14px] font-medium text-ink">{label}</span>
          {optional ? (
            <span className="mono-label rounded-full bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] px-1.5 py-[1px] text-[0.54rem] text-[color:var(--ink-muted)]">
              opc.
            </span>
          ) : null}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            "relative h-6 w-10 shrink-0 cursor-pointer appearance-none rounded-full border transition-colors",
            "border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]",
            "checked:border-[color:var(--ink)] checked:bg-[color:var(--ink)]",
            "before:absolute before:left-0.5 before:top-0.5 before:size-5 before:rounded-full before:bg-white before:transition-transform",
            "checked:before:translate-x-4",
          )}
          aria-label={label}
        />
      </label>
    </li>
  );
}
