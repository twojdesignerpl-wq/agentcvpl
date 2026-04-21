import type { CVData as LegacyCVData } from "./cv";
import type { CVData } from "@/lib/cv/schema";

export type AIAction = "generate" | "improve" | "job-match" | "chat";

export interface AIContext {
  action: AIAction;
  field?: string;
  fieldLabel?: string;
  currentText?: string;
  position?: string;
  industry?: string;
  /**
   * cvData może być w dwóch shape'ach:
   * - nowy (dla action="chat" z buildChatCVContext) — z `@/lib/cv/schema`
   * - legacy (dla generate/improve/job-match w prompts.ts#buildCVContext) — z `./cv`
   *
   * Prompt builders zachowują backward-compat (generate/improve/job-match nadal czytają legacy shape,
   * którego używa AI inline button). Dla "chat" przekazujemy nowy shape.
   */
  cvData?: CVData | LegacyCVData;
  jobListing?: string;
  /** Stan auto-fit — agent może proponować skrócenie jeśli true. */
  overflowed?: boolean;
}
