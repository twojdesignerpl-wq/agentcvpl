"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { EMAIL_FROM, EMAIL_REPLY_TO, getResendClient, isResendConfigured } from "@/lib/email/resend";

const replySchema = z.object({
  threadId: z.string().uuid(),
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(50_000),
  inReplyTo: z.string().optional(),
});

export type ReplyResult = { ok: true; id: string | null } | { ok: false; error: string };

export async function sendReply(input: unknown): Promise<ReplyResult> {
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Nieprawidłowe dane" };
  const g = await requireAdmin();
  if (!g.ok) return { ok: false, error: "forbidden" };
  if (!isResendConfigured()) return { ok: false, error: "Resend nie skonfigurowany" };

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: parsed.data.to,
      replyTo: EMAIL_REPLY_TO,
      subject: parsed.data.subject,
      text: parsed.data.body,
      headers: parsed.data.inReplyTo ? { "In-Reply-To": parsed.data.inReplyTo } : undefined,
    });
    if (error || !data) return { ok: false, error: error?.message ?? "send_failed" };

    const admin = createSupabaseServiceClient();
    await admin.from("emails").insert({
      direction: "outbound",
      resend_email_id: data.id,
      thread_id: parsed.data.threadId,
      in_reply_to: parsed.data.inReplyTo,
      from_email: EMAIL_REPLY_TO,
      from_name: "Agent CV - Pracuś AI",
      to_email: parsed.data.to,
      subject: parsed.data.subject,
      text_body: parsed.data.body,
      sent_by: g.user.id,
    });

    revalidatePath(`/admin/poczta/${parsed.data.threadId}`);
    revalidatePath("/admin/poczta");
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function markThreadRead(threadId: string): Promise<void> {
  const g = await requireAdmin();
  if (!g.ok) return;
  const admin = createSupabaseServiceClient();
  await admin
    .from("emails")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("direction", "inbound")
    .is("read_at", null);
  revalidatePath("/admin/poczta");
  revalidatePath(`/admin/poczta/${threadId}`);
}

export async function archiveThread(threadId: string): Promise<void> {
  const g = await requireAdmin();
  if (!g.ok) return;
  const admin = createSupabaseServiceClient();
  await admin
    .from("emails")
    .update({ archived_at: new Date().toISOString() })
    .eq("thread_id", threadId);
  revalidatePath("/admin/poczta");
}

export async function unarchiveThread(threadId: string): Promise<void> {
  const g = await requireAdmin();
  if (!g.ok) return;
  const admin = createSupabaseServiceClient();
  await admin.from("emails").update({ archived_at: null }).eq("thread_id", threadId);
  revalidatePath("/admin/poczta");
}
