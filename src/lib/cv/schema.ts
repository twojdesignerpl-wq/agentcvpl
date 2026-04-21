import { z } from "zod";

export const languageLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "native"]);
export type LanguageLevel = z.infer<typeof languageLevelSchema>;

export const rodoTypeSchema = z.enum(["none", "standard", "future", "both"]);
export type RodoType = z.infer<typeof rodoTypeSchema>;

export const photoShapeSchema = z.enum(["circle", "square", "none"]);
export type PhotoShape = z.infer<typeof photoShapeSchema>;

export const fontFamilySchema = z.enum([
  "manrope",
  "ibm-plex",
  "geist",
  "outfit",
  "source-sans",
  "work-sans",
  "nunito-sans",
  "lora",
  "merriweather",
  "roboto-slab",
]);
export type FontFamilyId = z.infer<typeof fontFamilySchema>;

const dataImageRegex = /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

export const personalSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  role: z.string().default(""),
  photo: z
    .string()
    .default("")
    .refine(
      (v) => v === "" || dataImageRegex.test(v),
      { message: "Zdjęcie musi być data-URL (base64) albo puste" },
    ),
  address: z.string().default(""),
  email: z.string().default(""),
  website: z.string().default(""),
  phone: z.string().default(""),
});
export type Personal = z.infer<typeof personalSchema>;

export const educationItemSchema = z.object({
  id: z.string(),
  school: z.string().default(""),
  degree: z.string().default(""),
  location: z.string().default(""),
  startYear: z.string().default(""),
  startMonth: z.string().default(""),
  endYear: z.string().default(""),
  endMonth: z.string().default(""),
  current: z.boolean().default(false),
});
export type EducationItem = z.infer<typeof educationItemSchema>;

export const employmentItemSchema = z.object({
  id: z.string(),
  position: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  startYear: z.string().default(""),
  startMonth: z.string().default(""),
  endYear: z.string().default(""),
  endMonth: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
});
export type EmploymentItem = z.infer<typeof employmentItemSchema>;

export const skillsSchema = z.object({
  professional: z.array(z.string()).default([]),
  personal: z.array(z.string()).default([]),
});
export type SkillsGroup = z.infer<typeof skillsSchema>;

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  level: languageLevelSchema.default("B2"),
});
export type LanguageItem = z.infer<typeof languageItemSchema>;

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  description: z.string().default(""),
  url: z.string().default(""),
});
export type ProjectItem = z.infer<typeof projectItemSchema>;

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  issuer: z.string().default(""),
  year: z.string().default(""),
  month: z.string().default(""),
  credentialId: z.string().default(""),
  url: z.string().default(""),
});
export type CertificationItem = z.infer<typeof certificationItemSchema>;

export const volunteerItemSchema = z.object({
  id: z.string(),
  role: z.string().default(""),
  organization: z.string().default(""),
  location: z.string().default(""),
  startYear: z.string().default(""),
  startMonth: z.string().default(""),
  endYear: z.string().default(""),
  endMonth: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
});
export type VolunteerItem = z.infer<typeof volunteerItemSchema>;

export const publicationItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  authors: z.string().default(""),
  venue: z.string().default(""),
  year: z.string().default(""),
  url: z.string().default(""),
  description: z.string().default(""),
});
export type PublicationItem = z.infer<typeof publicationItemSchema>;

export const awardItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  issuer: z.string().default(""),
  year: z.string().default(""),
  description: z.string().default(""),
});
export type AwardItem = z.infer<typeof awardItemSchema>;

export const conferenceItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  event: z.string().default(""),
  role: z.string().default(""),
  year: z.string().default(""),
  month: z.string().default(""),
  url: z.string().default(""),
  description: z.string().default(""),
});
export type ConferenceItem = z.infer<typeof conferenceItemSchema>;

export const referenceItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  title: z.string().default(""),
  company: z.string().default(""),
  contact: z.string().default(""),
  relation: z.string().default(""),
});
export type ReferenceItem = z.infer<typeof referenceItemSchema>;

export const customSectionItemSchema = z.object({
  id: z.string(),
  primary: z.string().default(""),
  secondary: z.string().default(""),
  body: z.string().default(""),
});
export type CustomSectionItem = z.infer<typeof customSectionItemSchema>;

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().default("Własna sekcja"),
  layout: z.enum(["list", "paragraph", "tags"]).default("list"),
  items: z.array(customSectionItemSchema).default([]),
  tags: z.array(z.string()).default([]),
  paragraph: z.string().default(""),
});
export type CustomSection = z.infer<typeof customSectionSchema>;

export const rodoSchema = z.object({
  type: rodoTypeSchema.default("standard"),
  companyName: z.string().default(""),
});
export type Rodo = z.infer<typeof rodoSchema>;

export const contactFieldSchema = z.enum(["address", "email", "website", "phone"]);
export type ContactField = z.infer<typeof contactFieldSchema>;

export const templateIdSchema = z.enum(["orbit", "atlas", "terra", "cobalt", "lumen"]);
export type TemplateId = z.infer<typeof templateIdSchema>;

export const settingsSchema = z.object({
  templateId: templateIdSchema.default("orbit"),
  fontFamily: fontFamilySchema.default("manrope"),
  fontSize: z.number().min(8).max(14).default(10),
  photoShape: photoShapeSchema.default("circle"),
  // Sekcje podstawowe (default: TRUE — domyślnie widoczne, można wyłączyć)
  showProfile: z.boolean().default(true),
  showEducation: z.boolean().default(true),
  showEmployment: z.boolean().default(true),
  showSkills: z.boolean().default(true),
  // Sekcje opcjonalne (default: FALSE — domyślnie ukryte, można włączyć)
  showLanguages: z.boolean().default(false),
  showProjects: z.boolean().default(false),
  showCertifications: z.boolean().default(false),
  showVolunteer: z.boolean().default(false),
  showPublications: z.boolean().default(false),
  showAwards: z.boolean().default(false),
  showConferences: z.boolean().default(false),
  showHobbies: z.boolean().default(false),
  showReferences: z.boolean().default(false),
  // Sekcje template-specific (default: true gdy szablon ich używa)
  showLinks: z.boolean().default(true),
  hiddenContactFields: z.array(contactFieldSchema).default([]),
});
export type CVSettings = z.infer<typeof settingsSchema>;

export const cvDataSchema = z.object({
  personal: personalSchema,
  profile: z.string().default(""),
  education: z.array(educationItemSchema).default([]),
  skills: skillsSchema,
  employment: z.array(employmentItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  volunteer: z.array(volunteerItemSchema).default([]),
  publications: z.array(publicationItemSchema).default([]),
  awards: z.array(awardItemSchema).default([]),
  conferences: z.array(conferenceItemSchema).default([]),
  hobbies: z.array(z.string()).default([]),
  references: z.array(referenceItemSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  rodo: rodoSchema,
  settings: settingsSchema,
});
export type CVData = z.infer<typeof cvDataSchema>;

export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  A1: "A1 — Początkujący",
  A2: "A2 — Podstawowy",
  B1: "B1 — Średnio zaawansowany",
  B2: "B2 — Zaawansowany",
  C1: "C1 — Biegły",
  C2: "C2 — Profesjonalny",
  native: "Ojczysty",
};

export const FONT_FAMILY_STACKS: Record<FontFamilyId, string> = {
  manrope: `"Manrope", "Helvetica Neue", Arial, sans-serif`,
  "ibm-plex": `"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif`,
  geist: `"Geist", "Helvetica Neue", Arial, sans-serif`,
  outfit: `"Outfit", "Helvetica Neue", Arial, sans-serif`,
  "source-sans": `"Source Sans 3", "Helvetica Neue", Arial, sans-serif`,
  "work-sans": `"Work Sans", "Helvetica Neue", Arial, sans-serif`,
  "nunito-sans": `"Nunito Sans", "Helvetica Neue", Arial, sans-serif`,
  lora: `"Lora", "Georgia", "Times New Roman", serif`,
  merriweather: `"Merriweather", "Georgia", "Times New Roman", serif`,
  "roboto-slab": `"Roboto Slab", "Georgia", "Times New Roman", serif`,
};

export const FONT_FAMILY_LABELS: Record<FontFamilyId, string> = {
  manrope: "Manrope",
  "ibm-plex": "IBM Plex Sans",
  geist: "Geist",
  outfit: "Outfit",
  "source-sans": "Source Sans 3",
  "work-sans": "Work Sans",
  "nunito-sans": "Nunito Sans",
  lora: "Lora (serif)",
  merriweather: "Merriweather (serif)",
  "roboto-slab": "Roboto Slab",
};

export const MONTH_LABELS: Array<{ value: string; label: string }> = [
  { value: "01", label: "Styczeń" },
  { value: "02", label: "Luty" },
  { value: "03", label: "Marzec" },
  { value: "04", label: "Kwiecień" },
  { value: "05", label: "Maj" },
  { value: "06", label: "Czerwiec" },
  { value: "07", label: "Lipiec" },
  { value: "08", label: "Sierpień" },
  { value: "09", label: "Wrzesień" },
  { value: "10", label: "Październik" },
  { value: "11", label: "Listopad" },
  { value: "12", label: "Grudzień" },
];

export const FONT_SIZE_MIN = 8;
export const FONT_SIZE_MAX = 14;
export const FONT_SIZE_STEP = 0.25;
export const FONT_SIZE_DEFAULT = 10;
