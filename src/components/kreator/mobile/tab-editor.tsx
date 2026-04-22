"use client";

import {
  User,
  TextT,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Heart,
  Rocket,
  Certificate,
  HandHeart,
  BookOpen,
  Trophy,
  Microphone,
  UserList,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MobileSectionAccordion } from "./forms/section-accordion";
import { SectionJumpBar } from "./section-jump-bar";
import { MobilePersonalForm } from "./forms/personal-form";
import { MobileProfileForm } from "./forms/profile-form";
import { MobileEmploymentForm } from "./forms/employment-form";
import { MobileEducationForm } from "./forms/education-form";
import { MobileSkillsForm } from "./forms/skills-form";
import { MobileLanguagesForm } from "./forms/languages-form";
import { MobileHobbiesForm } from "./forms/hobbies-form";
import { MobileProjectsForm } from "./forms/projects-form";
import { MobileCertificationsForm } from "./forms/certifications-form";
import { MobileVolunteerForm } from "./forms/volunteer-form";
import { MobilePublicationsForm } from "./forms/publications-form";
import { MobileAwardsForm } from "./forms/awards-form";
import { MobileConferencesForm } from "./forms/conferences-form";
import { MobileReferencesForm } from "./forms/references-form";
import { MobileCustomSectionsForm } from "./forms/custom-sections-form";

export function MobileTabEditor() {
  const settings = useCVStore((s) => s.cv.settings);
  const employmentCount = useCVStore((s) => s.cv.employment.length);
  const educationCount = useCVStore((s) => s.cv.education.length);
  const languagesCount = useCVStore((s) => s.cv.languages.length);
  const hobbiesCount = useCVStore((s) => s.cv.hobbies.length);
  const projectsCount = useCVStore((s) => s.cv.projects.length);
  const certsCount = useCVStore((s) => s.cv.certifications.length);
  const volunteerCount = useCVStore((s) => s.cv.volunteer.length);
  const publicationsCount = useCVStore((s) => s.cv.publications.length);
  const awardsCount = useCVStore((s) => s.cv.awards.length);
  const conferencesCount = useCVStore((s) => s.cv.conferences.length);
  const referencesCount = useCVStore((s) => s.cv.references.length);
  const customCount = useCVStore((s) => s.cv.customSections.length);
  const profileLen = useCVStore((s) => s.cv.profile.length);

  const toggleProfile = useCVStore((s) => s.toggleProfile);
  const toggleEmployment = useCVStore((s) => s.toggleEmployment);
  const toggleEducation = useCVStore((s) => s.toggleEducation);
  const toggleSkills = useCVStore((s) => s.toggleSkills);
  const toggleLanguages = useCVStore((s) => s.toggleLanguages);
  const toggleHobbies = useCVStore((s) => s.toggleHobbies);
  const toggleProjects = useCVStore((s) => s.toggleProjects);
  const toggleCerts = useCVStore((s) => s.toggleCertifications);
  const toggleVolunteer = useCVStore((s) => s.toggleVolunteer);
  const togglePublications = useCVStore((s) => s.togglePublications);
  const toggleAwards = useCVStore((s) => s.toggleAwards);
  const toggleConferences = useCVStore((s) => s.toggleConferences);
  const toggleReferences = useCVStore((s) => s.toggleReferences);

  return (
    <div className="px-4 pb-24 pt-3">
      <div className="flex items-baseline justify-between px-1 pb-1">
        <h1 className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">
          Twoje CV
        </h1>
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
          Autosave
        </span>
      </div>

      <SectionJumpBar />

      <div className="mt-3 space-y-3">

      <MobileSectionAccordion id="personal" title="Dane osobowe" icon={User} defaultOpen>
        <MobilePersonalForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="profile"
        title="Profil zawodowy"
        icon={TextT}
        count={profileLen}
        visible={settings.showProfile}
        onToggleVisible={toggleProfile}
      >
        <MobileProfileForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="employment"
        title="Doświadczenie"
        icon={Briefcase}
        count={employmentCount}
        visible={settings.showEmployment}
        onToggleVisible={toggleEmployment}
      >
        <MobileEmploymentForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="education"
        title="Edukacja"
        icon={GraduationCap}
        count={educationCount}
        visible={settings.showEducation}
        onToggleVisible={toggleEducation}
      >
        <MobileEducationForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="skills"
        title="Umiejętności"
        icon={Wrench}
        visible={settings.showSkills}
        onToggleVisible={toggleSkills}
      >
        <MobileSkillsForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="languages"
        title="Języki"
        icon={Globe}
        count={languagesCount}
        visible={settings.showLanguages}
        onToggleVisible={toggleLanguages}
      >
        <MobileLanguagesForm />
      </MobileSectionAccordion>

      <div className="my-4 flex items-center gap-3 px-1">
        <span className="h-px flex-1 bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]" />
        <span className="mono-label text-[0.54rem] text-[color:var(--ink-muted)]">
          Sekcje dodatkowe
        </span>
        <span className="h-px flex-1 bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]" />
      </div>

      <MobileSectionAccordion
        id="projects"
        title="Projekty"
        icon={Rocket}
        count={projectsCount}
        visible={settings.showProjects}
        onToggleVisible={toggleProjects}
      >
        <MobileProjectsForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="certifications"
        title="Certyfikaty"
        icon={Certificate}
        count={certsCount}
        visible={settings.showCertifications}
        onToggleVisible={toggleCerts}
      >
        <MobileCertificationsForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="volunteer"
        title="Wolontariat"
        icon={HandHeart}
        count={volunteerCount}
        visible={settings.showVolunteer}
        onToggleVisible={toggleVolunteer}
      >
        <MobileVolunteerForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="publications"
        title="Publikacje"
        icon={BookOpen}
        count={publicationsCount}
        visible={settings.showPublications}
        onToggleVisible={togglePublications}
      >
        <MobilePublicationsForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="awards"
        title="Nagrody"
        icon={Trophy}
        count={awardsCount}
        visible={settings.showAwards}
        onToggleVisible={toggleAwards}
      >
        <MobileAwardsForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="conferences"
        title="Konferencje"
        icon={Microphone}
        count={conferencesCount}
        visible={settings.showConferences}
        onToggleVisible={toggleConferences}
      >
        <MobileConferencesForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="references"
        title="Referencje"
        icon={UserList}
        count={referencesCount}
        visible={settings.showReferences}
        onToggleVisible={toggleReferences}
      >
        <MobileReferencesForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion
        id="hobbies"
        title="Zainteresowania"
        icon={Heart}
        count={hobbiesCount}
        visible={settings.showHobbies}
        onToggleVisible={toggleHobbies}
      >
        <MobileHobbiesForm />
      </MobileSectionAccordion>

      <MobileSectionAccordion id="custom" title="Własne sekcje" icon={Stack} count={customCount}>
        <MobileCustomSectionsForm />
      </MobileSectionAccordion>
      </div>
    </div>
  );
}
