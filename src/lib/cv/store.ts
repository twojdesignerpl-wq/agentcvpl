"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  AwardItem,
  CertificationItem,
  ConferenceItem,
  ContactField,
  CustomSection,
  CustomSectionItem,
  CVData,
  EducationItem,
  EmploymentItem,
  FontFamilyId,
  LanguageItem,
  LanguageLevel,
  Personal,
  PhotoShape,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  RodoType,
  TemplateId,
  VolunteerItem,
} from "./schema";
import { FONT_SIZE_MAX, FONT_SIZE_MIN } from "./schema";
import { SAMPLE_CV, createEmptyCV } from "./sample";

const INITIAL_CV = createEmptyCV();

export type SectionKey =
  | "personal"
  | "profile"
  | "education"
  | "skills"
  | "employment"
  | "languages"
  | "projects"
  | "rodo";

type State = {
  cv: CVData;
  hydrated: boolean;
};

type Actions = {
  setHydrated: (v: boolean) => void;

  updatePersonal: (patch: Partial<Personal>) => void;
  updateProfile: (text: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (ids: string[]) => void;

  addEmployment: () => void;
  updateEmployment: (id: string, patch: Partial<EmploymentItem>) => void;
  removeEmployment: (id: string) => void;
  reorderEmployment: (ids: string[]) => void;

  setSkills: (group: "professional" | "personal", items: string[]) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (ids: string[]) => void;

  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (ids: string[]) => void;

  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (ids: string[]) => void;

  addVolunteer: () => void;
  updateVolunteer: (id: string, patch: Partial<VolunteerItem>) => void;
  removeVolunteer: (id: string) => void;
  reorderVolunteer: (ids: string[]) => void;

  addPublication: () => void;
  updatePublication: (id: string, patch: Partial<PublicationItem>) => void;
  removePublication: (id: string) => void;
  reorderPublications: (ids: string[]) => void;

  addAward: () => void;
  updateAward: (id: string, patch: Partial<AwardItem>) => void;
  removeAward: (id: string) => void;
  reorderAwards: (ids: string[]) => void;

  addConference: () => void;
  updateConference: (id: string, patch: Partial<ConferenceItem>) => void;
  removeConference: (id: string) => void;
  reorderConferences: (ids: string[]) => void;

  setHobbies: (items: string[]) => void;

  addReference: () => void;
  updateReference: (id: string, patch: Partial<ReferenceItem>) => void;
  removeReference: (id: string) => void;
  reorderReferences: (ids: string[]) => void;

  addCustomSection: () => void;
  updateCustomSection: (id: string, patch: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    patch: Partial<CustomSectionItem>,
  ) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;

  setRodoType: (type: RodoType) => void;
  setRodoCompany: (name: string) => void;

  setTemplate: (id: TemplateId) => void;
  setFontSize: (pt: number) => void;
  setFontFamily: (id: FontFamilyId) => void;
  setPhotoShape: (shape: PhotoShape) => void;
  setPhoto: (dataUrl: string) => void;

  toggleProfile: (show: boolean) => void;
  toggleEducation: (show: boolean) => void;
  toggleEmployment: (show: boolean) => void;
  toggleSkills: (show: boolean) => void;
  toggleLanguages: (show: boolean) => void;
  toggleProjects: (show: boolean) => void;
  toggleCertifications: (show: boolean) => void;
  toggleVolunteer: (show: boolean) => void;
  togglePublications: (show: boolean) => void;
  toggleAwards: (show: boolean) => void;
  toggleConferences: (show: boolean) => void;
  toggleHobbies: (show: boolean) => void;
  toggleReferences: (show: boolean) => void;
  toggleLinks: (show: boolean) => void;
  setContactFieldHidden: (field: ContactField, hidden: boolean) => void;

  setCV: (next: CVData) => void;
  resetToSample: () => void;
  resetToEmpty: () => void;
};

const clampFontSize = (v: number) =>
  Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Math.round(v * 4) / 4));

export const useCVStore = create<State & Actions>()(
  persist(
    (set) => ({
      cv: INITIAL_CV,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      updatePersonal: (patch) =>
        set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, ...patch } } })),

      updateProfile: (text) => set((s) => ({ cv: { ...s.cv, profile: text } })),

      addEducation: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: [
              ...s.cv.education,
              {
                id: `edu-${nanoid(6)}`,
                school: "",
                degree: "",
                location: "",
                startYear: "",
                startMonth: "",
                endYear: "",
                endMonth: "",
                current: false,
              },
            ],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: s.cv.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          cv: { ...s.cv, education: s.cv.education.filter((e) => e.id !== id) },
        })),
      reorderEducation: (ids) =>
        set((s) => {
          const map = new Map(s.cv.education.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as EducationItem[];
          return { cv: { ...s.cv, education: next } };
        }),

      addEmployment: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            employment: [
              ...s.cv.employment,
              {
                id: `emp-${nanoid(6)}`,
                position: "",
                company: "",
                location: "",
                startYear: "",
                startMonth: "",
                endYear: "",
                endMonth: "",
                current: false,
                description: "",
              },
            ],
          },
        })),
      updateEmployment: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            employment: s.cv.employment.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEmployment: (id) =>
        set((s) => ({
          cv: { ...s.cv, employment: s.cv.employment.filter((e) => e.id !== id) },
        })),
      reorderEmployment: (ids) =>
        set((s) => {
          const map = new Map(s.cv.employment.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as EmploymentItem[];
          return { cv: { ...s.cv, employment: next } };
        }),

      setSkills: (group, items) =>
        set((s) => ({ cv: { ...s.cv, skills: { ...s.cv.skills, [group]: items } } })),

      addLanguage: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: [
              ...s.cv.languages,
              { id: `lang-${nanoid(6)}`, name: "", level: "B2" as LanguageLevel },
            ],
          },
        })),
      updateLanguage: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: s.cv.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({
          cv: { ...s.cv, languages: s.cv.languages.filter((l) => l.id !== id) },
        })),
      reorderLanguages: (ids) =>
        set((s) => {
          const map = new Map(s.cv.languages.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as LanguageItem[];
          return { cv: { ...s.cv, languages: next } };
        }),

      addProject: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: [
              ...s.cv.projects,
              { id: `proj-${nanoid(6)}`, name: "", description: "", url: "" },
            ],
          },
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: s.cv.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({
          cv: { ...s.cv, projects: s.cv.projects.filter((p) => p.id !== id) },
        })),
      reorderProjects: (ids) =>
        set((s) => {
          const map = new Map(s.cv.projects.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as ProjectItem[];
          return { cv: { ...s.cv, projects: next } };
        }),

      addCertification: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: [
              ...s.cv.certifications,
              {
                id: `cert-${nanoid(6)}`,
                name: "",
                issuer: "",
                year: "",
                month: "",
                credentialId: "",
                url: "",
              },
            ],
          },
        })),
      updateCertification: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: s.cv.certifications.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          cv: { ...s.cv, certifications: s.cv.certifications.filter((c) => c.id !== id) },
        })),
      reorderCertifications: (ids) =>
        set((s) => {
          const map = new Map(s.cv.certifications.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as CertificationItem[];
          return { cv: { ...s.cv, certifications: next } };
        }),

      addVolunteer: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            volunteer: [
              ...s.cv.volunteer,
              {
                id: `vol-${nanoid(6)}`,
                role: "",
                organization: "",
                location: "",
                startYear: "",
                startMonth: "",
                endYear: "",
                endMonth: "",
                current: false,
                description: "",
              },
            ],
          },
        })),
      updateVolunteer: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            volunteer: s.cv.volunteer.map((v) => (v.id === id ? { ...v, ...patch } : v)),
          },
        })),
      removeVolunteer: (id) =>
        set((s) => ({
          cv: { ...s.cv, volunteer: s.cv.volunteer.filter((v) => v.id !== id) },
        })),
      reorderVolunteer: (ids) =>
        set((s) => {
          const map = new Map(s.cv.volunteer.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as VolunteerItem[];
          return { cv: { ...s.cv, volunteer: next } };
        }),

      addPublication: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            publications: [
              ...s.cv.publications,
              {
                id: `pub-${nanoid(6)}`,
                title: "",
                authors: "",
                venue: "",
                year: "",
                url: "",
                description: "",
              },
            ],
          },
        })),
      updatePublication: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            publications: s.cv.publications.map((p) =>
              p.id === id ? { ...p, ...patch } : p,
            ),
          },
        })),
      removePublication: (id) =>
        set((s) => ({
          cv: { ...s.cv, publications: s.cv.publications.filter((p) => p.id !== id) },
        })),
      reorderPublications: (ids) =>
        set((s) => {
          const map = new Map(s.cv.publications.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as PublicationItem[];
          return { cv: { ...s.cv, publications: next } };
        }),

      addAward: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            awards: [
              ...s.cv.awards,
              { id: `awd-${nanoid(6)}`, title: "", issuer: "", year: "", description: "" },
            ],
          },
        })),
      updateAward: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            awards: s.cv.awards.map((a) => (a.id === id ? { ...a, ...patch } : a)),
          },
        })),
      removeAward: (id) =>
        set((s) => ({
          cv: { ...s.cv, awards: s.cv.awards.filter((a) => a.id !== id) },
        })),
      reorderAwards: (ids) =>
        set((s) => {
          const map = new Map(s.cv.awards.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as AwardItem[];
          return { cv: { ...s.cv, awards: next } };
        }),

      addConference: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            conferences: [
              ...s.cv.conferences,
              {
                id: `conf-${nanoid(6)}`,
                title: "",
                event: "",
                role: "",
                year: "",
                month: "",
                url: "",
                description: "",
              },
            ],
          },
        })),
      updateConference: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            conferences: s.cv.conferences.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        })),
      removeConference: (id) =>
        set((s) => ({
          cv: { ...s.cv, conferences: s.cv.conferences.filter((c) => c.id !== id) },
        })),
      reorderConferences: (ids) =>
        set((s) => {
          const map = new Map(s.cv.conferences.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as ConferenceItem[];
          return { cv: { ...s.cv, conferences: next } };
        }),

      setHobbies: (items) => set((s) => ({ cv: { ...s.cv, hobbies: items } })),

      addReference: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            references: [
              ...s.cv.references,
              {
                id: `ref-${nanoid(6)}`,
                name: "",
                title: "",
                company: "",
                contact: "",
                relation: "",
              },
            ],
          },
        })),
      updateReference: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            references: s.cv.references.map((r) =>
              r.id === id ? { ...r, ...patch } : r,
            ),
          },
        })),
      removeReference: (id) =>
        set((s) => ({
          cv: { ...s.cv, references: s.cv.references.filter((r) => r.id !== id) },
        })),
      reorderReferences: (ids) =>
        set((s) => {
          const map = new Map(s.cv.references.map((e) => [e.id, e]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as ReferenceItem[];
          return { cv: { ...s.cv, references: next } };
        }),

      addCustomSection: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            customSections: [
              ...s.cv.customSections,
              {
                id: `cs-${nanoid(6)}`,
                title: "Nowa sekcja",
                layout: "list" as const,
                items: [],
                tags: [],
                paragraph: "",
              },
            ],
          },
        })),
      updateCustomSection: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            customSections: s.cv.customSections.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        })),
      removeCustomSection: (id) =>
        set((s) => ({
          cv: { ...s.cv, customSections: s.cv.customSections.filter((c) => c.id !== id) },
        })),
      addCustomSectionItem: (sectionId) =>
        set((s) => ({
          cv: {
            ...s.cv,
            customSections: s.cv.customSections.map((c) =>
              c.id === sectionId
                ? {
                    ...c,
                    items: [
                      ...c.items,
                      { id: `csi-${nanoid(6)}`, primary: "", secondary: "", body: "" },
                    ],
                  }
                : c,
            ),
          },
        })),
      updateCustomSectionItem: (sectionId, itemId, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            customSections: s.cv.customSections.map((c) =>
              c.id === sectionId
                ? {
                    ...c,
                    items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
                  }
                : c,
            ),
          },
        })),
      removeCustomSectionItem: (sectionId, itemId) =>
        set((s) => ({
          cv: {
            ...s.cv,
            customSections: s.cv.customSections.map((c) =>
              c.id === sectionId
                ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
                : c,
            ),
          },
        })),

      setRodoType: (type) =>
        set((s) => ({ cv: { ...s.cv, rodo: { ...s.cv.rodo, type } } })),
      setRodoCompany: (companyName) =>
        set((s) => ({ cv: { ...s.cv, rodo: { ...s.cv.rodo, companyName } } })),

      setTemplate: (id) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, templateId: id } },
        })),
      setFontSize: (pt) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, fontSize: clampFontSize(pt) } },
        })),
      setFontFamily: (id) =>
        set((s) => ({ cv: { ...s.cv, settings: { ...s.cv.settings, fontFamily: id } } })),
      setPhotoShape: (shape) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, photoShape: shape } },
        })),
      setPhoto: (dataUrl) =>
        set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, photo: dataUrl } } })),

      toggleProfile: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showProfile: show } },
        })),
      toggleEducation: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showEducation: show } },
        })),
      toggleEmployment: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showEmployment: show } },
        })),
      toggleSkills: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showSkills: show } },
        })),
      toggleLanguages: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showLanguages: show } },
        })),
      toggleProjects: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showProjects: show } },
        })),
      toggleCertifications: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showCertifications: show } },
        })),
      toggleVolunteer: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showVolunteer: show } },
        })),
      togglePublications: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showPublications: show } },
        })),
      toggleAwards: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showAwards: show } },
        })),
      toggleConferences: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showConferences: show } },
        })),
      toggleHobbies: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showHobbies: show } },
        })),
      toggleReferences: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showReferences: show } },
        })),
      toggleLinks: (show) =>
        set((s) => ({
          cv: { ...s.cv, settings: { ...s.cv.settings, showLinks: show } },
        })),
      setContactFieldHidden: (field, hidden) =>
        set((s) => {
          const current = s.cv.settings.hiddenContactFields ?? [];
          const set2 = new Set(current);
          if (hidden) set2.add(field);
          else set2.delete(field);
          return {
            cv: {
              ...s.cv,
              settings: {
                ...s.cv.settings,
                hiddenContactFields: Array.from(set2),
              },
            },
          };
        }),

      setCV: (next) => set({ cv: next }),
      resetToSample: () => set({ cv: SAMPLE_CV }),
      resetToEmpty: () =>
        set((s) => {
          const empty = createEmptyCV();
          // Zachowaj wybór szablonu i ustawienia wyświetlania użytkownika
          return {
            cv: {
              ...empty,
              settings: {
                ...empty.settings,
                templateId: s.cv.settings.templateId,
                fontFamily: s.cv.settings.fontFamily,
                fontSize: s.cv.settings.fontSize,
                photoShape: s.cv.settings.photoShape,
              },
            },
          };
        }),
    }),
    {
      name: "kreator-cv-v10",
      version: 7,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => {
        const state = persisted as { cv?: CVData } | null;
        if (!state?.cv) return state;
        if (version < 2) {
          const settings = state.cv.settings;
          if (settings && !Array.isArray(settings.hiddenContactFields)) {
            settings.hiddenContactFields = [];
          }
        }
        if (version < 3) {
          const settings = state.cv.settings;
          if (settings && !settings.templateId) {
            settings.templateId = "orbit";
          }
          if (Array.isArray(state.cv.education)) {
            state.cv.education = state.cv.education.map((e) => ({
              ...e,
              location: e.location ?? "",
              startMonth: e.startMonth ?? "",
              endMonth: e.endMonth ?? "",
            }));
          }
          if (Array.isArray(state.cv.employment)) {
            state.cv.employment = state.cv.employment.map((e) => ({
              ...e,
              location: e.location ?? "",
              startMonth: e.startMonth ?? "",
              endMonth: e.endMonth ?? "",
            }));
          }
        }
        if (version < 4) {
          const cv = state.cv as CVData & Record<string, unknown>;
          if (!Array.isArray(cv.certifications)) cv.certifications = [];
          if (!Array.isArray(cv.volunteer)) cv.volunteer = [];
          if (!Array.isArray(cv.publications)) cv.publications = [];
          if (!Array.isArray(cv.awards)) cv.awards = [];
          if (!Array.isArray(cv.conferences)) cv.conferences = [];
          if (!Array.isArray(cv.hobbies)) cv.hobbies = [];
          if (!Array.isArray(cv.references)) cv.references = [];
          if (!Array.isArray(cv.customSections)) cv.customSections = [];
          const settings = state.cv.settings as CVData["settings"] & Record<string, unknown>;
          if (settings) {
            settings.showCertifications = settings.showCertifications ?? false;
            settings.showVolunteer = settings.showVolunteer ?? false;
            settings.showPublications = settings.showPublications ?? false;
            settings.showAwards = settings.showAwards ?? false;
            settings.showConferences = settings.showConferences ?? false;
            settings.showHobbies = settings.showHobbies ?? false;
            settings.showReferences = settings.showReferences ?? false;
          }
        }
        if (version < 6) {
          const settings = state.cv.settings as CVData["settings"] & Record<string, unknown>;
          if (settings) {
            settings.showProfile = settings.showProfile ?? true;
            settings.showEducation = settings.showEducation ?? true;
            settings.showEmployment = settings.showEmployment ?? true;
            settings.showSkills = settings.showSkills ?? true;
          }
        }
        if (version < 7) {
          const settings = state.cv.settings as CVData["settings"] & Record<string, unknown>;
          if (settings) {
            settings.showLinks = settings.showLinks ?? true;
          }
        }
        return state;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({ cv: s.cv }),
    }
  )
);
