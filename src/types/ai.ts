import type { CVData } from "@/lib/cv/schema";

export type AIAction = "generate" | "improve" | "job-match" | "chat";

export interface AIContext {
  action: AIAction;
  field?: string;
  fieldLabel?: string;
  currentText?: string;
  position?: string;
  industry?: string;
  cvData?: CVData;
  jobListing?: string;
  /** Stan auto-fit — agent może proponować skrócenie jeśli true. */
  overflowed?: boolean;
}
