"use client";

import { EditableTagList } from "@/components/cv/editable/editable-tag-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";

export function TemplateKeySkills() {
  const skills = useCVStore((s) => s.cv.skills);
  const setSkills = useCVStore((s) => s.setSkills);

  return (
    <section data-cv-section="skills">
      <SectionHeading>Umiejętności</SectionHeading>
      <div className="grid grid-cols-2 gap-x-[0.8em]">
        <div>
          <h3 className="text-[1em] font-semibold mb-[0.6em]">Zawodowe</h3>
          <EditableTagList
            items={skills.professional}
            onChange={(next) => setSkills("professional", next)}
            placeholder="Dodaj umiejętność"
            ariaLabel="Umiejętności zawodowe"
            className="text-[color:var(--cv-ink)]"
          />
        </div>
        <div>
          <h3 className="text-[1em] font-semibold mb-[0.6em]">Osobiste</h3>
          <EditableTagList
            items={skills.personal}
            onChange={(next) => setSkills("personal", next)}
            placeholder="Dodaj umiejętność"
            ariaLabel="Umiejętności osobiste"
            className="text-[color:var(--cv-ink)]"
          />
        </div>
      </div>
    </section>
  );
}
