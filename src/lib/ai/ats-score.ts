/**
 * ATS scoring heurystyka — pure function, zero tokenów.
 *
 * Sprawdza 4 wymiary jakości CV pod ATS:
 * 1. completeness — % wypełnionych sekcji wg settings.showXxx
 * 2. keywordDensity — match z atsKeywords branży (inferIndustry)
 * 3. length — pokrycie vs overflow
 * 4. readability — heurystyka na opisach employment
 */

import type { CVData } from "@/lib/cv/schema";
import { INDUSTRY_PROFILES } from "./knowledge-base";
import { inferIndustry } from "./infer-industry";

export type AtsFlagLevel = "info" | "warn" | "error";

export interface AtsFlag {
  level: AtsFlagLevel;
  message: string;
  /** Opcjonalny kod do programatycznego użycia (filtrowania, linkowania do rozmowy). */
  code?: string;
}

export interface AtsScoreComponents {
  completeness: number;
  keywordDensity: number;
  length: number;
  readability: number;
}

export interface AtsScoreResult {
  overall: number;
  components: AtsScoreComponents;
  flags: AtsFlag[];
  industry: string | undefined;
  /** Lista słów kluczowych z branży, które UŻYTKOWNIK MA w CV. */
  matchedKeywords: string[];
  /** Lista słów kluczowych z branży, które UŻYTKOWNIK NIE MA. */
  missingKeywords: string[];
}

// ────────────────────────────────────────────────────────────────────────────
// Completeness
// ────────────────────────────────────────────────────────────────────────────

function scoreCompleteness(cv: CVData): number {
  const s = cv.settings;
  // Waga sekcji: podstawowe ważniejsze
  const checks: Array<{ weight: number; done: boolean; visible: boolean }> = [
    // Personal — 2 wagi
    { weight: 2, done: Boolean(cv.personal.firstName && cv.personal.lastName), visible: true },
    { weight: 2, done: Boolean(cv.personal.email), visible: true },
    { weight: 1, done: Boolean(cv.personal.phone), visible: true },
    { weight: 1, done: Boolean(cv.personal.role), visible: true },

    // Profil (gdy widoczny)
    {
      weight: 3,
      done: cv.profile.trim().length >= 80,
      visible: s.showProfile,
    },

    // Employment (gdy widoczny)
    {
      weight: 4,
      done: cv.employment.length >= 1 && cv.employment.every((e) => e.position && e.company),
      visible: s.showEmployment,
    },
    {
      weight: 3,
      done: cv.employment.some((e) => e.description.trim().length >= 40),
      visible: s.showEmployment,
    },

    // Education
    {
      weight: 2,
      done: cv.education.length >= 1 && cv.education.every((e) => e.school),
      visible: s.showEducation,
    },

    // Skills
    {
      weight: 3,
      done: cv.skills.professional.length >= 4,
      visible: s.showSkills,
    },

    // Opcjonalne (wg visibility)
    { weight: 1, done: cv.languages.length >= 1, visible: s.showLanguages },
    { weight: 1, done: cv.certifications.length >= 1, visible: s.showCertifications },
    { weight: 1, done: cv.projects.length >= 1, visible: s.showProjects },

    // RODO
    { weight: 2, done: cv.rodo.type !== "none", visible: true },
  ];

  const relevant = checks.filter((c) => c.visible);
  const totalWeight = relevant.reduce((a, c) => a + c.weight, 0);
  const earned = relevant
    .filter((c) => c.done)
    .reduce((a, c) => a + c.weight, 0);

  if (totalWeight === 0) return 0;
  return Math.round((earned / totalWeight) * 100);
}

// ────────────────────────────────────────────────────────────────────────────
// Keyword density
// ────────────────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function scoreKeywordDensity(
  cv: CVData,
  industryId: string | undefined,
): { score: number; matched: string[]; missing: string[] } {
  if (!industryId || !INDUSTRY_PROFILES[industryId]) {
    return { score: 50, matched: [], missing: [] };
  }
  const keywords = INDUSTRY_PROFILES[industryId].atsKeywords;

  const haystack = normalize(
    [
      cv.profile,
      ...cv.employment.map((e) => `${e.position} ${e.company} ${e.description}`),
      ...cv.skills.professional,
      ...cv.skills.personal,
      ...cv.certifications.map((c) => c.name),
      ...cv.projects.map((p) => `${p.name} ${p.description}`),
      cv.personal.role,
    ]
      .filter(Boolean)
      .join(" "),
  );

  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of keywords) {
    const normalized = normalize(kw);
    if (haystack.includes(normalized)) matched.push(kw);
    else missing.push(kw);
  }

  const ratio = keywords.length > 0 ? matched.length / keywords.length : 0;
  return { score: Math.round(ratio * 100), matched, missing };
}

// ────────────────────────────────────────────────────────────────────────────
// Length (overflow / underflow)
// ────────────────────────────────────────────────────────────────────────────

function scoreLength(cv: CVData, overflowed?: boolean): number {
  if (overflowed === true) return 40;

  // Za krótkie CV (niedopowiedziane)
  const totalDesc = cv.employment.reduce((a, e) => a + e.description.length, 0);
  const profileLen = cv.profile.length;
  const total = totalDesc + profileLen;

  if (total === 0) return 0;
  if (total < 300) return 40;
  if (total < 600) return 70;
  if (total < 2500) return 100;
  if (total < 3500) return 80;
  return 60;
}

// ────────────────────────────────────────────────────────────────────────────
// Readability — heurystyka na opisach
// ────────────────────────────────────────────────────────────────────────────

const WEAK_PHRASES = [
  "odpowiedzialny za",
  "brałem udział",
  "praca zespołowa",
  "dobra komunikacja",
  "elastyczność",
  "zaangażowany",
  "zmotywowany",
  "kreatywny",
  "samodzielny",
  "umiejętność pracy pod presją",
  "zarządzanie czasem",
  "znajomość komputera",
];

function scoreReadability(cv: CVData): number {
  const descs = cv.employment
    .map((e) => e.description)
    .filter((d) => d.trim().length > 0);
  if (descs.length === 0) return 50;

  let score = 100;

  // Weak phrases penalty
  const joined = descs.join(" ").toLowerCase();
  for (const phrase of WEAK_PHRASES) {
    if (joined.includes(phrase)) score -= 8;
  }

  // Lack of numbers/metrics
  const hasAnyMetric = descs.some((d) =>
    /\d+\s*(%|pln|osób|mln|tys|szt|godz|min|h)|\d+x/i.test(d),
  );
  if (!hasAnyMetric) score -= 25;

  // Long sentences penalty (rozwlekłe opisy)
  const avgLenPerItem =
    descs.reduce((a, d) => a + d.length, 0) / descs.length;
  if (avgLenPerItem > 600) score -= 10;

  return Math.max(0, Math.min(100, score));
}

// ────────────────────────────────────────────────────────────────────────────
// Flags
// ────────────────────────────────────────────────────────────────────────────

function buildFlags(
  cv: CVData,
  overflowed: boolean | undefined,
  components: AtsScoreComponents,
): AtsFlag[] {
  const flags: AtsFlag[] = [];

  if (overflowed) {
    flags.push({
      level: "error",
      code: "overflow",
      message: "CV nie mieści się na 1 stronę A4 — skróć najdłuższe opisy stanowisk.",
    });
  }

  if (cv.rodo.type === "none") {
    flags.push({
      level: "error",
      code: "no-rodo",
      message:
        "Brak klauzuli RODO. W polskim CV wymagana — wiele systemów ATS odrzuca CV bez niej.",
    });
  }

  if (!cv.personal.email) {
    flags.push({
      level: "error",
      code: "no-email",
      message: "Brak adresu email w danych kontaktowych.",
    });
  }

  if (!cv.personal.phone) {
    flags.push({
      level: "warn",
      code: "no-phone",
      message: "Brak numeru telefonu — recruiter może nie zadzwonić.",
    });
  }

  if (!cv.profile.trim() && cv.settings.showProfile) {
    flags.push({
      level: "warn",
      code: "empty-profile",
      message: "Sekcja 'Profil' jest włączona, ale pusta. Dodaj 3-4 zdania podsumowania.",
    });
  }

  if (
    cv.employment.some((e) => !e.description.trim() && (e.position || e.company))
  ) {
    flags.push({
      level: "warn",
      code: "empty-emp-desc",
      message: "Są stanowiska bez opisu. Dopisz 3-4 bullety z mierzalnymi efektami.",
    });
  }

  if (cv.skills.professional.length < 4 && cv.settings.showSkills) {
    flags.push({
      level: "warn",
      code: "few-skills",
      message:
        "Mało umiejętności zawodowych (< 4). Dodaj konkretne narzędzia/systemy po nazwie.",
    });
  }

  if (components.readability < 60) {
    flags.push({
      level: "warn",
      code: "weak-language",
      message:
        "Opisy stanowisk zawierają słabe frazy ('odpowiedzialny za', 'praca zespołowa') lub brakuje liczb. Popraw bullety.",
    });
  }

  if (components.keywordDensity < 40 && components.keywordDensity > 0) {
    flags.push({
      level: "warn",
      code: "low-keywords",
      message:
        "Słowa kluczowe ATS dla Twojej branży występują w CV w mniej niż 40%. Sprawdź branżę i uzupełnij.",
    });
  }

  if (!cv.personal.firstName || !cv.personal.lastName) {
    flags.push({
      level: "error",
      code: "no-name",
      message: "Brak imienia lub nazwiska w danych osobowych.",
    });
  }

  return flags;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

export function calculateAtsScore(
  cv: CVData,
  opts?: { overflowed?: boolean; industry?: string },
): AtsScoreResult {
  const industry = opts?.industry ?? inferIndustry(cv);

  const completeness = scoreCompleteness(cv);
  const { score: keywordDensity, matched, missing } = scoreKeywordDensity(cv, industry);
  const length = scoreLength(cv, opts?.overflowed);
  const readability = scoreReadability(cv);

  const components: AtsScoreComponents = {
    completeness,
    keywordDensity,
    length,
    readability,
  };

  // Ważona suma: completeness 35%, keywords 25%, readability 25%, length 15%
  const overall = Math.round(
    completeness * 0.35 + keywordDensity * 0.25 + readability * 0.25 + length * 0.15,
  );

  const flags = buildFlags(cv, opts?.overflowed, components);

  return {
    overall,
    components,
    flags,
    industry,
    matchedKeywords: matched,
    missingKeywords: missing,
  };
}

/**
 * Krótki opis poziomu score — do UI.
 */
export function scoreLevelLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Doskonałe", color: "var(--jade)" };
  if (score >= 70) return { label: "Dobre", color: "var(--saffron)" };
  if (score >= 50) return { label: "Średnie", color: "var(--saffron-soft)" };
  return { label: "Wymaga pracy", color: "var(--rust)" };
}
