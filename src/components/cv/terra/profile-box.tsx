"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { useCVStore } from "@/lib/cv/store";

export function TerraProfileBox() {
  const profile = useCVStore((s) => s.cv.profile);
  const updateProfile = useCVStore((s) => s.updateProfile);

  return (
    <section
      data-cv-section="profile-terra"
      className="rounded-[3mm] bg-[color:var(--cv-accent-soft)] px-[5mm] py-[4mm]"
    >
      <EditableText
        value={profile}
        onChange={updateProfile}
        placeholder="Kilka zdań o Tobie — specjalizacja, doświadczenie, najważniejsze osiągnięcie."
        multiline
        as="p"
        className="text-[calc(var(--cv-font-size)*0.97)] leading-[1.55] text-[color:var(--cv-ink)]"
      />
    </section>
  );
}
