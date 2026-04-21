import type { CVData } from "@/lib/cv/schema";

/**
 * Analiza tonu istniejących tekstów użytkownika (profil + opisy stanowisk).
 * Heurystyki lokalne — zero tokenów AI. Agent kalibruje swoje propozycje
 * do wykrytego stylu.
 */

export interface ToneProfile {
  /** Formalność: 0 = bardzo casual, 100 = formalna korpo-mowa. */
  formality: number;
  /** Średnia długość zdań (znaków). */
  avgSentenceLength: number;
  /** Ile zdań łącznie w analizowanym tekście. */
  sentenceCount: number;
  /** Czy używa często listy punktowanej (bullet-ów) w opisach. */
  prefersBullets: boolean;
  /** Zauważalne cechy: np. dużo liczb, dużo anglicyzmów. */
  traits: string[];
  /** Krótki opis dla agenta (do system promptu). */
  description: string;
}

const FORMAL_WORDS = [
  "niniejszym",
  "stosownie",
  "zgodnie z",
  "w zakresie",
  "w ramach",
  "w zakresie powierzonych",
  "realizowanie",
  "odpowiedzialność za",
  "w imieniu",
  "niniejszy",
];

const CASUAL_WORDS = [
  "fajny",
  "fajnie",
  "super",
  "turbo",
  "ogar",
  "ogarniałem",
  "po prostu",
  "w zasadzie",
  "powiem szczerze",
  "spoko",
];

const ANGLICISMS = [
  "deliverables",
  "stakeholder",
  "endpoint",
  "sprint",
  "standup",
  "review",
  "deadline",
  "feedback",
  "pipeline",
  "roadmap",
  "workflow",
  "milestone",
];

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const w of words) {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = lower.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

function hasBullets(text: string): boolean {
  const lines = text.split("\n");
  const bulletLines = lines.filter((l) => /^\s*[-•*]\s/.test(l)).length;
  return bulletLines >= 2;
}

export function analyzeTone(cv: CVData): ToneProfile | null {
  const samples = [cv.profile, ...cv.employment.map((e) => e.description)]
    .map((s) => s.trim())
    .filter((s) => s.length >= 40);

  if (samples.length === 0) return null;

  const combined = samples.join("\n");
  const sentences = splitSentences(combined);
  if (sentences.length === 0) return null;

  const avgLen = sentences.reduce((a, s) => a + s.length, 0) / sentences.length;

  const formalHits = countMatches(combined, FORMAL_WORDS);
  const casualHits = countMatches(combined, CASUAL_WORDS);
  const anglicismHits = countMatches(combined, ANGLICISMS);

  // Formality 0-100: baza 50, przesuwa się wg hits
  let formality = 50 + formalHits * 5 - casualHits * 8;
  if (avgLen > 140) formality += 10;
  if (avgLen < 60) formality -= 5;
  formality = Math.max(0, Math.min(100, formality));

  const prefersBullets = samples.some((s) => hasBullets(s));

  const traits: string[] = [];
  if (anglicismHits >= 3) traits.push("używa branżowych anglicyzmów");
  if (/\d+\s*(%|pln|osób|mln|tys|szt)/i.test(combined)) traits.push("pokazuje liczby/metryki");
  if (formality >= 70) traits.push("język formalny");
  else if (formality <= 30) traits.push("język luźny");
  else traits.push("ton neutralny");
  if (prefersBullets) traits.push("woli listę punktowaną");
  if (avgLen > 140) traits.push("długie zdania");
  else if (avgLen < 80) traits.push("krótkie zdania");

  const tonalityLabel =
    formality >= 70 ? "formalny" : formality <= 30 ? "luźny" : "neutralny";
  const description = `Ton użytkownika: ${tonalityLabel}. Średnia długość zdania: ${Math.round(avgLen)} zn. ${traits.join(", ")}. Kalibruj swoje propozycje do tego stylu — zachowaj spójność.`;

  return {
    formality,
    avgSentenceLength: avgLen,
    sentenceCount: sentences.length,
    prefersBullets,
    traits,
    description,
  };
}
