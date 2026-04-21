"use client";

import { useCVStore } from "@/lib/cv/store";
import { AtlasHeader } from "./atlas/header";
import { TemplateProfile } from "./sections/profile";
import { AtlasSkills } from "./atlas/skills";
import { AtlasEducation } from "./atlas/education";
import { AtlasEmployment } from "./atlas/employment";
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

export function TemplateAtlas() {
  const settings = useCVStore((s) => s.cv.settings);

  return (
    <div className="block">
      <AtlasHeader />
      {settings.showProfile || settings.showSkills ? (
        <div className="mt-[8mm] grid grid-cols-[38%_1fr] gap-x-[8mm]">
          <div className="min-w-0">{settings.showProfile ? <TemplateProfile /> : null}</div>
          <div className="min-w-0">{settings.showSkills ? <AtlasSkills /> : null}</div>
        </div>
      ) : null}
      {settings.showEducation ? (
        <div className="mt-[7mm]">
          <AtlasEducation />
        </div>
      ) : null}
      {settings.showEmployment ? (
        <div className="mt-[7mm]">
          <AtlasEmployment />
        </div>
      ) : null}
      {settings.showLanguages ? (
        <div className="mt-[7mm]">
          <TemplateLanguages />
        </div>
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
