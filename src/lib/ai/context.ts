import type { AIContext } from "@/types/ai";
import type { CVData } from "@/lib/cv/schema";
import { inferIndustry } from "./infer-industry";

function inferPosition(cv: CVData): string | undefined {
  const role = cv.personal.role?.trim();
  if (role) return role.slice(0, 200);
  const current = cv.employment.find((e) => e.current) ?? cv.employment[0];
  const position = current?.position?.trim();
  return position ? position.slice(0, 200) : undefined;
}

export interface BuildAIContextOpts {
  overflowed?: boolean;
  jobListing?: string;
}

/**
 * Buduje AIContext dla requestu /api/chat (action="chat").
 * Serializacja CVData do text-promptu dzieje się po stronie serwera w
 * `buildChatCVContext`. Tu pakujemy dane "as-is" + meta.
 */
export function buildAIContext(cv: CVData, opts?: BuildAIContextOpts): AIContext {
  return {
    action: "chat",
    position: inferPosition(cv),
    industry: inferIndustry(cv),
    cvData: cv,
    overflowed: opts?.overflowed,
    jobListing: opts?.jobListing,
  };
}
