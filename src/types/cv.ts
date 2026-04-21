export type SectionId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "projects";

export type TemplateId = "kontrast" | "coda" | "avant";

export type RodoClause = "none" | "standard" | "future" | "both";

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  projects: Project[];
  rodoClause: RodoClause;
  rodoCompanyName: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  linkedIn: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: BulletPoint[];
}

export interface BulletPoint {
  id: string;
  text: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export type LanguageLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "native";

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}
