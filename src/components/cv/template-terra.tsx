"use client";

import { useCVStore } from "@/lib/cv/store";
import { TerraHeader } from "./terra/header";
import { TerraProfileBox } from "./terra/profile-box";
import { TerraEmployment } from "./terra/employment";
import { TerraEducation } from "./terra/education";
import { TerraSkills } from "./terra/skills";
import { TemplateProjects } from "./sections/projects";
import { TemplateCertifications } from "./sections/certifications";
import { TemplateVolunteer } from "./sections/volunteer";
import { TemplatePublications } from "./sections/publications";
import { TemplateAwards } from "./sections/awards";
import { TemplateConferences } from "./sections/conferences";
import { TemplateHobbies } from "./sections/hobbies";
import { TemplateReferences } from "./sections/references";
import { TemplateCustomSections } from "./sections/custom-sections";

export function TemplateTerra() {
  const settings = useCVStore((s) => s.cv.settings);

  return (
    <div className="block">
      <TerraHeader />
      {settings.showProfile ? (
        <div className="mt-[6mm]">
          <TerraProfileBox />
        </div>
      ) : null}
      {settings.showEmployment ? (
        <div className="mt-[7mm]">
          <TerraEmployment />
        </div>
      ) : null}
      {settings.showSkills || settings.showEducation ? (
        <>
          <div className="mt-[6mm] h-px w-full bg-[color:var(--cv-line)]" />
          <div className="mt-[6mm] grid grid-cols-[1fr_1fr] gap-x-[8mm]">
            <div className="min-w-0">{settings.showSkills ? <TerraSkills /> : null}</div>
            <div className="min-w-0">{settings.showEducation ? <TerraEducation /> : null}</div>
          </div>
        </>
      ) : null}
      {settings.showProjects ? (
        <div className="mt-[7mm]">
          <TemplateProjects />
        </div>
      ) : null}
      {settings.showCertifications ? (
        <div className="mt-[7mm]">
          <TemplateCertifications />
        </div>
      ) : null}
      {settings.showVolunteer ? (
        <div className="mt-[7mm]">
          <TemplateVolunteer />
        </div>
      ) : null}
      {settings.showPublications ? (
        <div className="mt-[7mm]">
          <TemplatePublications />
        </div>
      ) : null}
      {settings.showAwards ? (
        <div className="mt-[7mm]">
          <TemplateAwards />
        </div>
      ) : null}
      {settings.showConferences ? (
        <div className="mt-[7mm]">
          <TemplateConferences />
        </div>
      ) : null}
      {settings.showHobbies ? (
        <div className="mt-[7mm]">
          <TemplateHobbies />
        </div>
      ) : null}
      {settings.showReferences ? (
        <div className="mt-[7mm]">
          <TemplateReferences />
        </div>
      ) : null}
      <div className="mt-[7mm]">
        <TemplateCustomSections />
      </div>
    </div>
  );
}
