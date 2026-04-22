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

function verifySignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend:inbound] RESEND_INBOUND_WEBHOOK_SECRET missing");
    return false;
  }
  // Resend uses Svix — headers: svix-id, svix-timestamp, svix-signature
  const svixId = headers.get("svix-id");
  const svixTs = headers.get("svix-timestamp");
  const svixSig = headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig) return false;

  // Whitelist format `whsec_xxx` → strip prefix before HMAC
  const key = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret, "utf8");

  const signed = `${svixId}.${svixTs}.${rawBody}`;
  const expected = crypto.createHmac("sha256", key).update(signed).digest("base64");

  // svix-signature = "v1,base64sig v1,base64sig2" (space-separated)
  const signatures = svixSig.split(" ").map((s) => s.replace(/^v\d+,/, ""));
  return signatures.some((sig) => {
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
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

const inboundSchema = z.object({
  type: z.string(),
  created_at: z.string().optional(),
  data: z
    .object({
      email_id: z.string().optional(),
      from: z.union([
        z.string(),
        z.object({ email: z.string(), name: z.string().optional() }).passthrough(),
      ]),
      to: z.array(z.union([z.string(), z.object({ email: z.string() }).passthrough()])).optional(),
      subject: z.string().optional(),
      html: z.string().optional(),
      text: z.string().optional(),
      message_id: z.string().optional(),
      in_reply_to: z.string().optional(),
      references: z.array(z.string()).optional(),
      headers: z.record(z.string(), z.unknown()).optional(),
      attachments: z.array(attachmentSchema).optional(),
    })
    .passthrough(),
});

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
  if (!verifySignature(rawBody, request.headers)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
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
    text_body: d.text,
    html_body: d.html,
    raw_headers: d.headers ?? null,
    attachments: d.attachments ?? null,
  });

  if (insertErr) {
    console.error("[resend:inbound] insert failed:", insertErr);
    // Zwróć 500 żeby Resend retry'ował — lepsza obsługa niż stracić email
    return NextResponse.json({ error: "persist failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, thread_id: threadId });
}
