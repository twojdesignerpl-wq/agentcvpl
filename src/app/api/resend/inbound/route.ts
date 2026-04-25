import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Resend inbound webhook (email.received). Svix-compatible signature verification.
 *
 * Setup:
 *   1. Resend Dashboard → Webhooks → Add endpoint
 *   2. URL: https://agentcv.pl/api/resend/inbound
 *   3. Event: email.received (+ opcjonalnie email.delivered, email.bounced, ...)
 *   4. Signing secret → env RESEND_INBOUND_WEBHOOK_SECRET
 */

type SigCheck =
  | { ok: true }
  | { ok: false; reason: "secret_missing" | "headers_missing" | "signature_mismatch"; detail?: string };

function verifySignature(rawBody: string, headers: Headers): SigCheck {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend:inbound] RESEND_INBOUND_WEBHOOK_SECRET missing");
    return { ok: false, reason: "secret_missing" };
  }
  // Resend uses Svix — headers: svix-id, svix-timestamp, svix-signature
  const svixId = headers.get("svix-id");
  const svixTs = headers.get("svix-timestamp");
  const svixSig = headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig) {
    const missing = [
      !svixId && "svix-id",
      !svixTs && "svix-timestamp",
      !svixSig && "svix-signature",
    ]
      .filter(Boolean)
      .join(",");
    return { ok: false, reason: "headers_missing", detail: missing };
  }

  // Whitelist format `whsec_xxx` → strip prefix before HMAC
  const key = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret, "utf8");

  const signed = `${svixId}.${svixTs}.${rawBody}`;
  const expected = crypto.createHmac("sha256", key).update(signed).digest("base64");

  // svix-signature = "v1,base64sig v1,base64sig2" (space-separated)
  const signatures = svixSig.split(" ").map((s) => s.replace(/^v\d+,/, ""));
  const matched = signatures.some((sig) => {
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
  if (matched) return { ok: true };
  return {
    ok: false,
    reason: "signature_mismatch",
    detail: `expected_prefix=${expected.slice(0, 6)}... got_count=${signatures.length}`,
  };
}

const attachmentSchema = z
  .object({
    filename: z.string().optional(),
    content_type: z.string().optional(),
    content_id: z.string().optional(),
    size: z.number().optional(),
    url: z.string().url().optional(),
  })
  .passthrough();

// Resend Inbound payload format ewoluuje — używamy passthrough + tolerancyjnego
// dostępu do pól (różne wersje API używały różnych nazw: html / body_html / bodyHtml).
const inboundSchema = z.object({
  type: z.string(),
  created_at: z.string().optional(),
  data: z
    .object({
      email_id: z.string().optional(),
      from: z
        .union([
          z.string(),
          z.object({ email: z.string(), name: z.string().optional() }).passthrough(),
        ])
        .optional(),
      to: z
        .array(z.union([z.string(), z.object({ email: z.string() }).passthrough()]))
        .optional(),
      subject: z.string().optional(),
      message_id: z.string().optional(),
      in_reply_to: z.string().optional(),
      references: z.array(z.string()).optional(),
      attachments: z.array(attachmentSchema).optional(),
    })
    .passthrough(),
});

/**
 * Wyciąga string body z payloadu Resend pod różnymi możliwymi nazwami pól.
 * Resend Inbound API zmieniał format — zapewniamy backward/forward compat.
 */
function pickBody(d: Record<string, unknown>, type: "html" | "text"): string | null {
  const candidates =
    type === "html"
      ? ["html", "body_html", "bodyHtml", "html_body", "htmlBody"]
      : ["text", "body_text", "bodyText", "text_body", "textBody", "plain", "plainText"];
  for (const key of candidates) {
    const value = d[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  // Czasami body jest zagnieżdżone: {body: {html, text}} lub {content: {...}}
  for (const containerKey of ["body", "content", "message"]) {
    const container = d[containerKey];
    if (container && typeof container === "object") {
      const nested = (container as Record<string, unknown>)[type];
      if (typeof nested === "string" && nested.length > 0) return nested;
    }
  }
  return null;
}

function parseAddress(value: unknown): { email: string; name: string | null } {
  if (typeof value === "string") {
    const m = value.match(/^\s*(?:"?([^"<]+?)"?\s*)?<?([^>\s]+@[^>\s]+)>?\s*$/);
    return { email: (m?.[2] ?? value).trim(), name: m?.[1]?.trim() ?? null };
  }
  if (value && typeof value === "object") {
    const obj = value as { email?: string; name?: string };
    return { email: obj.email ?? "", name: obj.name ?? null };
  }
  return { email: "", name: null };
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const sigCheck = verifySignature(rawBody, request.headers);
  if (!sigCheck.ok) {
    // Diagnostyczne body — widoczne w Resend Dashboard → Webhooks → Logs.
    // Pomaga rozróżnić błędne ustawienie secret vs missing webhook config.
    console.error("[resend:inbound] auth fail:", sigCheck.reason, sigCheck.detail);
    return NextResponse.json(
      { error: "invalid signature", reason: sigCheck.reason, detail: sigCheck.detail },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = inboundSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", details: parsed.error.flatten() }, {
      status: 400,
    });
  }

  // Tylko email.received interesuje nas (pozostałe eventy Resend ignorujemy)
  if (parsed.data.type !== "email.received") {
    return NextResponse.json({ received: true, ignored: parsed.data.type });
  }

  const d = parsed.data.data;
  const admin = createSupabaseServiceClient();

  // Threading: match by in_reply_to → thread_id
  let threadId: string | null = null;
  if (d.in_reply_to) {
    const { data: prev } = await admin
      .from("emails")
      .select("thread_id")
      .eq("message_id", d.in_reply_to)
      .maybeSingle();
    threadId = (prev?.thread_id as string | null) ?? null;
  }
  if (!threadId) threadId = crypto.randomUUID();

  const fromAddr = parseAddress(d.from);
  const toList = (d.to ?? []).map(parseAddress);
  const primaryTo = toList[0]?.email ?? "hej@agentcv.pl";

  // Tolerancyjny extract body — Resend zmieniał nazwy pól (html/body_html/...)
  const dRecord = d as unknown as Record<string, unknown>;
  const textBody = pickBody(dRecord, "text");
  const htmlBody = pickBody(dRecord, "html");

  if (!textBody && !htmlBody) {
    console.warn(
      "[resend:inbound] payload bez html/text body — keys:",
      Object.keys(dRecord).join(","),
    );
  }

  const { error: insertErr } = await admin.from("emails").insert({
    direction: "inbound",
    resend_inbound_id: d.email_id,
    thread_id: threadId,
    in_reply_to: d.in_reply_to,
    message_id: d.message_id,
    from_email: fromAddr.email,
    from_name: fromAddr.name,
    to_email: primaryTo,
    subject: d.subject ?? "(bez tematu)",
    text_body: textBody,
    html_body: htmlBody,
    // Zapisujemy cały data payload (nie tylko headers) — diagnoza brakujących pól
    // przy przyszłych zmianach formatu Resend Inbound API.
    raw_headers: d as unknown as Record<string, unknown>,
    attachments: d.attachments ?? null,
  });

  if (insertErr) {
    console.error("[resend:inbound] insert failed:", insertErr);
    // Zwróć 500 żeby Resend retry'ował — lepsza obsługa niż stracić email
    return NextResponse.json({ error: "persist failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, thread_id: threadId });
}
