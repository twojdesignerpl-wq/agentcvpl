"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";

export function TemplateProfile() {
  const profile = useCVStore((s) => s.cv.profile);
  const updateProfile = useCVStore((s) => s.updateProfile);

  return (
    <section data-cv-section="profile">
      <SectionHeading>Profil</SectionHeading>
      <EditableText
        value={profile}
        onChange={updateProfile}
        placeholder="Kilka zdań o Tobie — specjalizacja, doświadczenie, najważniejsze osiągnięcie."
        multiline
        as="p"
        className="text-[1em] leading-[1.5] text-[color:var(--cv-ink)]"
      />
    </section>
  );
}
