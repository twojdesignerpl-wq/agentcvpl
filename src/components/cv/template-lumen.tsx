"use client";

import { useCVStore } from "@/lib/cv/store";
import { LumenHeader } from "./lumen/header";
import { LumenSectionRow } from "./lumen/section-row";
import { LumenEmployment } from "./lumen/employment";
import { LumenEducation } from "./lumen/education";
import { LumenSkills } from "./lumen/skills";
import { EditableText } from "./editable/editable-text";
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

export function TemplateLumen() {
  const settings = useCVStore((s) => s.cv.settings);
  const profile = useCVStore((s) => s.cv.profile);
  const updateProfile = useCVStore((s) => s.updateProfile);

  return (
    <div className="lumen-display flex flex-col gap-[10mm] min-h-full">
      <LumenHeader />

      {settings.showProfile ? (
        <LumenSectionRow heading="Profil">
          <EditableText
            value={profile}
            onChange={updateProfile}
            placeholder="Kilka zdań o Tobie — specjalizacja, doświadczenie, najważniejsze osiągnięcie."
            multiline
            as="p"
            className="text-[calc(var(--cv-font-size)*1)] leading-[1.6] text-[color:var(--cv-muted)]"
          />
        </LumenSectionRow>
      ) : null}

      {settings.showEmployment ? (
        <LumenSectionRow heading="Doświadczenie">
          <LumenEmployment />
        </LumenSectionRow>
      ) : null}

      {settings.showEducation ? (
        <LumenSectionRow heading="Edukacja">
          <LumenEducation />
        </LumenSectionRow>
      ) : null}

      {settings.showSkills ? (
        <LumenSectionRow heading="Umiejętności">
          <LumenSkills />
        </LumenSectionRow>
      ) : null}

      {settings.showLanguages ? (
        <LumenSectionRow heading="Języki">
          <TemplateLanguages />
        </LumenSectionRow>
      ) : null}

      {settings.showProjects ? (
        <LumenSectionRow heading="Projekty">
          <TemplateProjects />
        </LumenSectionRow>
      ) : null}

      {settings.showCertifications ? (
        <LumenSectionRow heading="Certyfikaty">
          <TemplateCertifications />
        </LumenSectionRow>
      ) : null}

      {settings.showVolunteer ? (
        <LumenSectionRow heading="Wolontariat">
          <TemplateVolunteer />
        </LumenSectionRow>
      ) : null}

      {settings.showPublications ? (
        <LumenSectionRow heading="Publikacje">
          <TemplatePublications />
        </LumenSectionRow>
      ) : null}

      {settings.showAwards ? (
        <LumenSectionRow heading="Nagrody">
          <TemplateAwards />
        </LumenSectionRow>
      ) : null}

      {settings.showConferences ? (
        <LumenSectionRow heading="Konferencje">
          <TemplateConferences />
        </LumenSectionRow>
      ) : null}

      {settings.showHobbies ? (
        <LumenSectionRow heading="Zainteresowania">
          <TemplateHobbies />
        </LumenSectionRow>
      ) : null}

      {settings.showReferences ? (
        <LumenSectionRow heading="Referencje">
          <TemplateReferences />
        </LumenSectionRow>
      ) : null}

      <TemplateCustomSections />
    </div>
  );
}
