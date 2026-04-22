import { Resend } from "resend";

let cached: Resend | null = null;

/**
 * Server-only Resend client. NIGDY nie importuj w Client Component — używa API key.
 */
export function getResendClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY nie jest skonfigurowany — ustaw w Vercel env (https://resend.com/api-keys)",
    );
  }
  cached = new Resend(key);
  return cached;
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Agent CV - Pracuś AI <hej@agentcv.pl>";
export const EMAIL_REPLY_TO = "hej@agentcv.pl";
export const EMAIL_INBOX = "hej@agentcv.pl";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
