"use client";

import { useCVStore } from "@/lib/cv/store";
import { TemplateHeader } from "./sections/header";
import { TemplateProfile } from "./sections/profile";
import { TemplateEducation } from "./sections/education";
import { TemplateKeySkills } from "./sections/key-skills";
import { TemplateEmployment } from "./sections/employment";
import { TemplateLanguages } from "./sections/languages";
import { TemplateProjects } from "./sections/projects";
import { TemplateCertifications } from "./sections/certifications";
import { TemplateVolunteer } from "./sections/volunteer";
import { TemplatePublications } from "./sections/publications";
import { TemplateAwards } from "./sections/awards";
import { TemplateConferences } from "./sections/conferences";
import { TemplateHobbies } from "./sections/hobbies";
import { TemplateReferences } from "./sections/references";
import { TemplateCustomSections } from "./sections/custom-sections";

export function TemplateOrbit() {
  const settings = useCVStore((s) => s.cv.settings);

  return (
    <div className="block">
      <TemplateHeader />
      <hr className="mt-[8mm] mb-[7mm] border-0 h-px bg-[color:var(--cv-line)]" />
      <div className="grid grid-cols-[38%_4%_58%]">
        <aside className="flex flex-col gap-[6mm] min-w-0">
          {settings.showProfile ? <TemplateProfile /> : null}
          {settings.showEducation ? <TemplateEducation /> : null}
          {settings.showSkills ? <TemplateKeySkills /> : null}
          {settings.showLanguages ? <TemplateLanguages /> : null}
          {settings.showCertifications ? <TemplateCertifications /> : null}
          {settings.showHobbies ? <TemplateHobbies /> : null}
        </aside>
        <div aria-hidden />
        <main className="flex flex-col gap-[6mm] min-w-0">
          {settings.showEmployment ? <TemplateEmployment /> : null}
          {settings.showProjects ? <TemplateProjects /> : null}
          {settings.showVolunteer ? <TemplateVolunteer /> : null}
          {settings.showPublications ? <TemplatePublications /> : null}
          {settings.showAwards ? <TemplateAwards /> : null}
          {settings.showConferences ? <TemplateConferences /> : null}
          {settings.showReferences ? <TemplateReferences /> : null}
          <TemplateCustomSections />
        </main>
      </div>
    </div>
  );
}
