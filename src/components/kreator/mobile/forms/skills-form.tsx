"use client";

import { useCVStore } from "@/lib/cv/store";
import { MobileTagInput } from "./tag-input";

export function MobileSkillsForm() {
  const skills = useCVStore((s) => s.cv.skills);
  const setSkills = useCVStore((s) => s.setSkills);

  return (
    <div className="space-y-4">
      <MobileTagInput
        label="Umiejętności zawodowe"
        values={skills.professional}
        onChange={(next) => setSkills("professional", next)}
        placeholder="np. React, TypeScript, SQL"
        hint="Enter / przecinek aby dodać"
      />
      <MobileTagInput
        label="Umiejętności miękkie"
        values={skills.personal}
        onChange={(next) => setSkills("personal", next)}
        placeholder="np. Komunikacja, Leadership"
      />
    </div>
  );
}
