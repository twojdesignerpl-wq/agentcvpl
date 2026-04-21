"use client";

import { EditableTagList } from "@/components/cv/editable/editable-tag-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";

export function TemplateHobbies() {
  const hobbies = useCVStore((s) => s.cv.hobbies);
  const setHobbies = useCVStore((s) => s.setHobbies);

  return (
    <section data-cv-section="hobbies">
      <SectionHeading>Zainteresowania</SectionHeading>
      <EditableTagList
        items={hobbies}
        onChange={setHobbies}
        placeholder="Dodaj zainteresowanie"
        ariaLabel="Zainteresowania"
        className="text-[color:var(--cv-ink)]"
      />
    </section>
  );
}
