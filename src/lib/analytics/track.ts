"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type TrackEvent =
  | "cv_exported"
  | "ai_called"
  | "login_success"
  | "checkout_started"
  | "cv_saved_cloud"
  | "newsletter_signup";

type AllowedValue = string | number | boolean | null;

/**
 * Cienki wrapper na @vercel/analytics `track`. Używaj dla custom eventów CRO.
 * Event nazwy są typed (union TrackEvent) — nie pozwalamy na typo.
 *
 * Przykład:
 * ```ts
 * track("cv_exported", { format: "pdf", template: "orbit" });
 * ```
 */
export function track(
  event: TrackEvent,
  properties?: Record<string, AllowedValue>,
): void {
  try {
    vercelTrack(event, properties);
  } catch {
    // Analytics failure must never break UX.
  }
}
