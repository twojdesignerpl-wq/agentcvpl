import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PaperPlaneTilt, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { ComposeForm } from "@/components/admin/inbox/compose-form";
import { HtmlSandbox } from "@/components/admin/inbox/html-sandbox";
import { ThreadActions } from "@/components/admin/inbox/thread-actions";
import { markThreadRead } from "../actions";

type Params = Promise<{ id: string }>;

type EmailRow = {
  id: string;
  direction: "inbound" | "outbound";
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  text_body: string | null;
  html_body: string | null;
  message_id: string | null;
  in_reply_to: string | null;
  received_at: string;
  read_at: string | null;
  archived_at: string | null;
  attachments: unknown;
};

export const dynamic = "force-dynamic";

export default async function AdminThreadPage({ params }: { params: Params }) {
  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const admin = createSupabaseServiceClient();
  const { data: emails } = await admin
    .from("emails")
    .select(
      "id, direction, from_email, from_name, to_email, subject, text_body, html_body, message_id, in_reply_to, received_at, read_at, archived_at, attachments",
    )
    .eq("thread_id", id)
    .order("received_at", { ascending: true });

  const messages = (emails ?? []) as EmailRow[];
  if (messages.length === 0) notFound();

  // Mark read (fire & forget — server action z revalidate)
  const hasUnread = messages.some((m) => m.direction === "inbound" && !m.read_at);
  if (hasUnread) {
    await markThreadRead(id).catch(() => {});
  }

  const last = messages[messages.length - 1];
  const lastInbound = [...messages].reverse().find((m) => m.direction === "inbound") ?? last;
  const isArchived = messages.some((m) => m.archived_at);
  const baseSubject = (last.subject ?? "").replace(/^Re:\s*/i, "");
  const replySubject = `Re: ${baseSubject || "(bez tematu)"}`;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/poczta"
        className="mono-label mb-6 inline-flex items-center gap-1 text-[0.6rem] text-[color:var(--ink-muted)] hover:text-ink"
      >
        <ArrowLeft size={12} weight="bold" />
        Powrót do skrzynki
      </Link>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
            {last.subject ?? "(bez tematu)"}
          </h1>
          <p className="mt-2 text-[13px] text-[color:var(--ink-muted)]">
            {messages.length} {messages.length === 1 ? "wiadomość" : "wiadomości"}
          </p>
        </div>
        <ThreadActions threadId={id} isArchived={isArchived} hasUnread={false} />
      </header>

      <div className="space-y-4">
        {messages.map((m) => (
          <MessageCard key={m.id} message={m} />
        ))}
      </div>

      <div className="mt-8">
        <ComposeForm
          threadId={id}
          to={lastInbound.from_email}
          defaultSubject={replySubject}
          inReplyTo={lastInbound.message_id}
        />
      </div>
    </div>
  );
}

function MessageCard({ message }: { message: EmailRow }) {
  const isInbound = message.direction === "inbound";
  const name = message.from_name ?? message.from_email;
  const attachments = Array.isArray(message.attachments)
    ? (message.attachments as Array<{ filename?: string; size?: number; url?: string; content_type?: string }>)
    : [];

  return (
    <article
      className={`rounded-2xl border p-5 sm:p-6 ${
        isInbound
          ? "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white"
          : "border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/5"
      }`}
    >
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={`inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold ${
              isInbound
                ? "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)]"
                : "bg-[color:var(--saffron)] text-[color:var(--cream)]"
            }`}
          >
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold">{name}</p>
            <p className="truncate font-mono text-[11.5px] text-[color:var(--ink-muted)]">
              {isInbound ? message.from_email : `do: ${message.to_email}`}
            </p>
            {!isInbound ? (
              <p className="mono-label mt-0.5 text-[0.56rem] text-[color:var(--saffron)]">
                <PaperPlaneTilt size={10} weight="bold" className="mr-1 inline-block" />
                Wysłane przez admin
              </p>
            ) : null}
          </div>
        </div>
        <time className="text-[12px] text-[color:var(--ink-muted)]">
          {new Date(message.received_at).toLocaleString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </header>

      {message.html_body ? (
        <HtmlSandbox html={message.html_body} />
      ) : (
        <pre className="whitespace-pre-wrap break-words rounded-xl bg-[color:var(--cream-soft)]/50 p-4 font-mono text-[13px] leading-relaxed text-[color:var(--ink-soft)]">
          {message.text_body ?? "(brak treści)"}
        </pre>
      )}

      {attachments.length > 0 ? (
        <div className="mt-4 border-t border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] pt-3">
          <p className="mono-label mb-2 text-[0.56rem] text-[color:var(--ink-muted)]">Załączniki</p>
          <ul className="flex flex-wrap gap-2">
            {attachments.map((a, i) => (
              <li key={i}>
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12.5px] hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]"
                  >
                    <DownloadSimple size={12} weight="bold" />
                    {a.filename ?? "załącznik"}
                    {a.size ? <span className="text-[color:var(--ink-muted)]">({formatBytes(a.size)})</span> : null}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12.5px] text-[color:var(--ink-muted)]">
                    {a.filename ?? "załącznik"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function initials(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  const parts = t.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] ?? "")).toUpperCase();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
