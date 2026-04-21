"use client";

import { useCVStore } from "@/lib/cv/store";
import { CobaltHeader } from "./cobalt/header";
import { CobaltEmployment } from "./cobalt/employment";
import { CobaltEducation } from "./cobalt/education";
import { CobaltSkills } from "./cobalt/skills";
import { CobaltDetailsSidebar } from "./cobalt/details-sidebar";
import { CobaltLinksSidebar } from "./cobalt/links-sidebar";
import { TemplateProfile } from "./sections/profile";
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

export function TemplateCobalt() {
  const settings = useCVStore((s) => s.cv.settings);

  return (
    <div className="cobalt-display min-h-full">
      <div className="flex flex-col gap-[7mm]">
        <CobaltHeader />

        {settings.showProfile ? (
          <div className="max-w-[105mm]">
            <TemplateProfile />
          </div>
        ) : null}

        <div className="grid grid-cols-[60%_4%_36%]">
          <main className="flex flex-col gap-[6mm] min-w-0">
            {settings.showEmployment ? <CobaltEmployment /> : null}
            {settings.showEducation ? <CobaltEducation /> : null}
            {settings.showProjects ? <TemplateProjects /> : null}
            {settings.showVolunteer ? <TemplateVolunteer /> : null}
            {settings.showPublications ? <TemplatePublications /> : null}
            {settings.showAwards ? <TemplateAwards /> : null}
            {settings.showConferences ? <TemplateConferences /> : null}
            {settings.showReferences ? <TemplateReferences /> : null}
            <TemplateCustomSections />
          </main>

          <div aria-hidden />

          <aside className="flex flex-col gap-[6mm] min-w-0">
            <CobaltDetailsSidebar />
            {settings.showSkills ? <CobaltSkills /> : null}
            {settings.showLanguages ? <TemplateLanguages /> : null}
            {settings.showCertifications ? <TemplateCertifications /> : null}
            {settings.showHobbies ? <TemplateHobbies /> : null}
            {settings.showLinks ? <CobaltLinksSidebar /> : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
