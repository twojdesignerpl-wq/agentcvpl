/**
 * Seniority profiles — poziomy kariery w polskich realiach.
 *
 * Używane przez agent do dopasowania słownictwa i oczekiwań.
 */

import type { CVData } from "@/lib/cv/schema";

export type SeniorityLevel =
  | "student"
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "staff"
  | "principal";

export interface SeniorityProfile {
  level: SeniorityLevel;
  label: string;
  yearsMin: number;
  yearsMax: number;
  verbsTone: string;
  scope: string;
  /** Frazy które sygnalizują ten poziom w tytułach stanowisk. */
  titleSignals: string[];
  /** Czego recruiter oczekuje na tym poziomie (krótkie bullety). */
  expectedAchievements: string[];
  /** Jak agent powinien formułować propozycje dla tego poziomu. */
  promptHint: string;
}

export const SENIORITY_PROFILES: Record<SeniorityLevel, SeniorityProfile> = {
  student: {
    level: "student",
    label: "Student / Staż",
    yearsMin: 0,
    yearsMax: 0,
    verbsTone: "wspomagałem, uczestniczyłem, wdrożyłem",
    scope: "projekty uczelniane, pierwsze staże",
    titleSignals: ["student", "stażysta", "stażystka", "praktykant"],
    expectedAchievements: [
      "Projekty uczelniane z namacalnym efektem (appka, analiza, publikacja)",
      "Krótkie staże w firmach branżowych",
      "Kursy/certyfikaty pokazujące inicjatywę (Google, AWS, Coursera)",
      "Działalność studencka, koła naukowe, wolontariat",
    ],
    promptHint:
      "Użytkownik jest studentem — edukacja na wierzchu, projekty uczelniane w CV, język dopasowany do braku doświadczenia zawodowego.",
  },

  intern: {
    level: "intern",
    label: "Stażysta / Praktykant",
    yearsMin: 0,
    yearsMax: 1,
    verbsTone: "uczestniczyłem, wspomagałem, realizowałem, uczyłem się",
    scope: "wsparcie zespołu w rutynowych zadaniach",
    titleSignals: ["intern", "junior assistant", "asystent"],
    expectedAchievements: [
      "Konkretne zadania zrealizowane w ramach stażu",
      "Narzędzia poznane i używane",
      "Feedback od mentora / supervisor-a",
    ],
    promptHint: "Użytkownik jest na stażu — nie wymagaj leadership/strategii.",
  },

  junior: {
    level: "junior",
    label: "Junior (0-2 lat)",
    yearsMin: 0,
    yearsMax: 2,
    verbsTone: "zrealizowałem, wdrożyłem, opracowałem, poprawiłem",
    scope: "pojedyncze zadania w ramach zespołu",
    titleSignals: ["junior", "młodszy", "trainee"],
    expectedAchievements: [
      "Pierwsze samodzielne wdrożenia / projekty",
      "Narzędzia branżowe na poziomie operacyjnym",
      "Szybka nauka i asymilacja w zespole",
      "Certyfikaty junior-level",
    ],
    promptHint:
      "Junior — opisy stanowisk 2-3 bullety, focus na narzędzia + pierwsze osiągnięcia. Nie używaj 'architektowałem', 'zdefiniowałem strategię'.",
  },

  mid: {
    level: "mid",
    label: "Mid / Specjalista (2-5 lat)",
    yearsMin: 2,
    yearsMax: 5,
    verbsTone: "zaimplementowałem, zoptymalizowałem, koordynowałem, wdrożyłem",
    scope: "własne projekty, współpraca w zespole",
    titleSignals: ["specjalista", "specjalistka", "specialist", "mid"],
    expectedAchievements: [
      "Prowadzenie projektów średniej wielkości end-to-end",
      "Mentoring juniorów (opcjonalnie)",
      "Mierzalne efekty biznesowe (%, PLN, czas)",
      "Ekspertyza w narzędziach / procesach",
    ],
    promptHint:
      "Mid — opisy 3-4 bullety, pokaż metryki, narzędzia+metody, można wspomnieć mentoring jeśli miał.",
  },

  senior: {
    level: "senior",
    label: "Senior (5-10 lat)",
    yearsMin: 5,
    yearsMax: 10,
    verbsTone: "prowadziłem, zaprojektowałem, zarządzałem, architektowałem",
    scope: "projekty zespołowe, mentoring, decyzje techniczne/produktowe",
    titleSignals: ["senior", "starszy", "lead"],
    expectedAchievements: [
      "Mentoring zespołu / juniorów",
      "Decyzje architektoniczne / strategiczne",
      "Inicjatywy międzyzespołowe",
      "Mierzalny impact biznesowy (skala firmy, nie projektu)",
      "Reprezentowanie zespołu na zewnątrz (konferencje, klienci)",
    ],
    promptHint:
      "Senior — impact-first. 'Zaprojektowałem i wdrożyłem X, co przyniosło Y' nie 'Pracowałem nad X'. Mentoring, roadmap, hiring często widoczne.",
  },

  lead: {
    level: "lead",
    label: "Lead / Team Lead",
    yearsMin: 7,
    yearsMax: 12,
    verbsTone: "prowadziłem, kierowałem, kształtowałem, ustanowiłem",
    scope: "zespół 3-10 osób, roadmapy, hiring",
    titleSignals: ["lead", "team lead", "kierownik zespołu", "tech lead"],
    expectedAchievements: [
      "Zarządzanie zespołem (wielkość, struktura)",
      "Roadmap długoterminowy",
      "Hiring (rozmowy rekrutacyjne, scaling team)",
      "Stakeholder management",
      "Koordynacja z innymi zespołami",
    ],
    promptHint:
      "Lead — mówimy o ZARZĄDZANIU. Wielkość zespołu, scope odpowiedzialności, wpływ organizacyjny.",
  },

  staff: {
    level: "staff",
    label: "Staff / Staff Engineer",
    yearsMin: 10,
    yearsMax: 15,
    verbsTone: "architektowałem, zdefiniowałem, ustanowiłem standardy, kształtowałem",
    scope: "cross-team inicjatywy, technologia całego działu, decyzje strategiczne",
    titleSignals: ["staff", "staff engineer", "staff designer"],
    expectedAchievements: [
      "Inicjatywy wieloobiektowe (multi-team)",
      "Standardy i best practices dla organizacji",
      "Mentoring senior-ów i lead-ów",
      "Techniczna/produktowa strategia działu",
    ],
    promptHint:
      "Staff — poziom IC senior bez formalnego zarządzania. Wpływ techniczny/strategiczny na całą org.",
  },

  principal: {
    level: "principal",
    label: "Principal / Director",
    yearsMin: 12,
    yearsMax: 99,
    verbsTone: "zdefiniowałem strategię, kierowałem, przekształciłem, ustanowiłem",
    scope: "strategia firmy / działu, transformacje, executive",
    titleSignals: ["principal", "director", "head of", "dyrektor"],
    expectedAchievements: [
      "Strategiczne decyzje z wpływem na firmę",
      "Transformacje organizacyjne",
      "Zarządzanie P&L",
      "Reprezentowanie firmy (board, klienci enterprise, media)",
    ],
    promptHint:
      "Principal/Director — strategia, transformacje, skala całej firmy/działu.",
  },
};

/**
 * Oblicza ile lat pracy user ma (z dat employment).
 */
function calculateYearsExperience(cv: CVData): number {
  if (cv.employment.length === 0) return 0;

  const now = new Date();
  let totalMonths = 0;

  for (const e of cv.employment) {
    const startY = parseInt(e.startYear, 10);
    const startM = parseInt(e.startMonth || "1", 10);
    if (!Number.isFinite(startY)) continue;

    const endY = e.current ? now.getFullYear() : parseInt(e.endYear, 10);
    const endM = e.current ? now.getMonth() + 1 : parseInt(e.endMonth || "12", 10);

    if (!Number.isFinite(endY)) continue;

    const months = (endY - startY) * 12 + (endM - startM);
    if (months > 0) totalMonths += months;
  }

  return Math.round((totalMonths / 12) * 10) / 10; // 1 decimal
}

/**
 * Inferuje poziom seniority z dat employment + tytułów stanowisk.
 */
export function inferSeniority(cv: CVData): SeniorityLevel {
  const years = calculateYearsExperience(cv);

  // Sprawdź title signals — mają priorytet nad latami
  const titlesLower = cv.employment.map((e) => e.position.toLowerCase()).join(" ");
  const roleLower = (cv.personal.role || "").toLowerCase();
  const allTitles = titlesLower + " " + roleLower;

  // Od najwyższego do najniższego
  const levels: SeniorityLevel[] = [
    "principal",
    "staff",
    "lead",
    "senior",
    "mid",
    "junior",
    "intern",
    "student",
  ];

  for (const level of levels) {
    const signals = SENIORITY_PROFILES[level].titleSignals;
    for (const signal of signals) {
      if (allTitles.includes(signal.toLowerCase())) return level;
    }
  }

  // Fallback: po latach
  if (years < 0.5) return "student";
  if (years < 1) return "intern";
  if (years < 2) return "junior";
  if (years < 5) return "mid";
  if (years < 10) return "senior";
  if (years < 15) return "lead";
  return "staff";
}

/**
 * Zwraca wytyczne dla agent-a dopasowane do poziomu kariery użytkownika.
 * Do wstrzyknięcia w system prompt jako kontekst "jak pisać dla tego seniority".
 */
export function getCareerStageGuidance(cv: CVData): string {
  const level = inferSeniority(cv);
  const profile = SENIORITY_PROFILES[level];
  if (!profile) return "";

  const expected = profile.expectedAchievements.map((e) => `- ${e}`).join("\n");

  return [
    "",
    "<career_stage>",
    `Poziom kariery: ${profile.label} (${level})`,
    `Oczekiwany zakres odpowiedzialności: ${profile.scope}`,
    `Ton czasowników dla tego poziomu: ${profile.verbsTone}`,
    `Czego recruiter oczekuje na tym poziomie:`,
    expected,
    `Wskazówka: ${profile.promptHint}`,
    "</career_stage>",
  ].join("\n");
}
