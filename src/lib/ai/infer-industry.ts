/**
 * Industry inference — heurystyka bez AI.
 *
 * Mecz CVData.employment (position + company) + skills po słowach kluczowych
 * z INDUSTRY_PROFILES. Zwraca top-scoring IndustryId lub undefined (agent pyta).
 */

import type { CVData } from "@/lib/cv/schema";
import { INDUSTRY_PROFILES } from "./knowledge-base";

export type IndustryId = keyof typeof INDUSTRY_PROFILES;

const MIN_SCORE = 2; // mniej = "nie wiem, zapytaj"

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function tokenize(s: string): Set<string> {
  return new Set(
    normalize(s)
      .split(/\s+/)
      .filter((w) => w.length >= 3),
  );
}

function scoreIndustry(haystackTokens: Set<string>, keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    const normalized = normalize(kw);
    // Multi-word keyword match: all tokens present
    const kwTokens = normalized.split(/\s+/).filter((w) => w.length >= 3);
    if (kwTokens.length === 0) continue;
    const allPresent = kwTokens.every((t) => haystackTokens.has(t));
    if (allPresent) score += kwTokens.length; // waga proporcjonalna do specyficzności
  }
  return score;
}

export function inferIndustry(cv: CVData): IndustryId | undefined {
  const sources: string[] = [
    cv.personal.role,
    ...cv.employment.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...cv.skills.professional,
    ...cv.projects.map((p) => `${p.name} ${p.description}`),
    ...cv.certifications.map((c) => `${c.name} ${c.issuer}`),
  ];
  const haystack = sources.filter(Boolean).join(" ");
  if (!haystack.trim()) return undefined;

  const tokens = tokenize(haystack);

  const scores: Array<{ id: string; score: number }> = [];
  for (const [id, profile] of Object.entries(INDUSTRY_PROFILES)) {
    const keywords = [
      ...profile.topRoles,
      ...profile.coreSkills,
      ...profile.atsKeywords,
    ];
    const score = scoreIndustry(tokens, keywords);
    scores.push({ id, score });
  }

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (!top || top.score < MIN_SCORE) return undefined;
  return top.id as IndustryId;
}

/**
 * Zwraca top-3 branże z score (dla debugging / displayu "branży prawdopodobne").
 */
export function rankIndustries(cv: CVData): Array<{ id: IndustryId; score: number }> {
  const sources: string[] = [
    cv.personal.role,
    ...cv.employment.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...cv.skills.professional,
  ];
  const tokens = tokenize(sources.filter(Boolean).join(" "));

  return Object.entries(INDUSTRY_PROFILES)
    .map(([id, profile]) => ({
      id: id as IndustryId,
      score: scoreIndustry(tokens, [
        ...profile.topRoles,
        ...profile.coreSkills,
        ...profile.atsKeywords,
      ]),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
