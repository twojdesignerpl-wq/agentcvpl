import Link from "next/link";
import { Envelope, EnvelopeOpen, Archive, ArrowsCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ view?: "inbox" | "archived" }>;

type ThreadSummary = {
  thread_id: string;
  last_received_at: string;
  last_subject: string;
  last_from_email: string;
  last_from_name: string | null;
  last_preview: string;
  unread_count: number;
  messages_count: number;
  archived: boolean;
  last_direction: "inbound" | "outbound";
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInboxPage({ searchParams }: { searchParams: SearchParams }) {
  const { view = "inbox" } = await searchParams;
  const admin = createSupabaseServiceClient();

  const { data: emails } = await admin
    .from("emails")
    .select(
      "id, direction, thread_id, subject, from_email, from_name, text_body, html_body, read_at, archived_at, received_at",
    )
    .order("received_at", { ascending: false })
    .limit(500);

  const rows = emails ?? [];

  // Grupuj po thread_id → summary
  const threadMap = new Map<string, ThreadSummary>();
  for (const e of rows) {
    const tid = (e.thread_id as string) ?? (e.id as string);
    let t = threadMap.get(tid);
    if (!t) {
      const preview = ((e.text_body as string | null) ?? stripHtml((e.html_body as string | null) ?? ""))
        .trim()
        .slice(0, 140);
      t = {
        thread_id: tid,
        last_received_at: e.received_at as string,
        last_subject: (e.subject as string) ?? "(bez tematu)",
        last_from_email: e.from_email as string,
        last_from_name: (e.from_name as string | null) ?? null,
        last_preview: preview,
        unread_count: 0,
        messages_count: 0,
        archived: Boolean(e.archived_at),
        last_direction: e.direction as "inbound" | "outbound",
      };
      threadMap.set(tid, t);
    }
    t.messages_count += 1;
    if (e.direction === "inbound" && !e.read_at) t.unread_count += 1;
    if (e.archived_at) t.archived = true;
  }

  const threads = Array.from(threadMap.values()).filter((t) =>
    view === "archived" ? t.archived : !t.archived,
  );

  const unreadTotal = threads.reduce((acc, t) => acc + t.unread_count, 0);

  return (
    <div>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label text-[color:var(--saffron)]">Admin</p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em]">
            Poczta <span className="text-[color:var(--ink-muted)]">hej@agentcv.pl</span>
          </h1>
          <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
            Odbiór przez Resend inbound webhook · {unreadTotal} nieprzeczytanych
          </p>
        </div>

        <nav className="flex gap-1 self-start sm:self-end">
          <Link
            href="/admin/poczta?view=inbox"
            className={`mono-label inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] transition-colors ${
              view !== "archived"
                ? "bg-ink text-cream"
                : "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)]"
            }`}
          >
            <Envelope size={12} weight="bold" />
            Skrzynka
          </Link>
          <Link
            href="/admin/poczta?view=archived"
            className={`mono-label inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] transition-colors ${
              view === "archived"
                ? "bg-ink text-cream"
                : "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)]"
            }`}
          >
            <Archive size={12} weight="bold" />
            Archiwum
          </Link>
          <Link
            href="/admin/poczta"
            className="mono-label inline-flex items-center gap-1.5 rounded-full bg-[color:var(--cream-soft)] px-3 py-1.5 text-[0.6rem] text-[color:var(--ink-soft)] hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]"
          >
            <ArrowsCounterClockwise size={12} weight="bold" />
            Odśwież
          </Link>
        </nav>
      </header>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_18%,transparent)] bg-[color:var(--cream-soft)] p-10 text-center">
          <Envelope size={28} className="mx-auto text-[color:var(--ink-muted)]" />
          <p className="mt-3 font-display text-[1rem] font-semibold">
            {view === "archived" ? "Brak zarchiwizowanych wątków" : "Brak wiadomości"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-[color:var(--ink-muted)]">
            Skrzynka <code>hej@agentcv.pl</code> jest pusta. Gdy przyjdzie email, pojawi się tutaj
            natychmiast (po stronie Resend inbound webhook).
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white">
          {threads.map((t) => (
            <li key={t.thread_id}>
              <Link
                href={`/admin/poczta/${t.thread_id}`}
                className="flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-[color:var(--cream-soft)]/50 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
              >
                {/* Avatar initials */}
                <div className="flex items-center gap-3 sm:w-[240px] sm:shrink-0">
                  <span
                    aria-hidden
                    className={`inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                      t.unread_count > 0
                        ? "bg-[color:var(--saffron)] text-[color:var(--cream)]"
                        : "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)]"
                    }`}
                  >
                    {initials(t.last_from_name ?? t.last_from_email)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[14px] ${
                        t.unread_count > 0 ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {t.last_from_name ?? t.last_from_email}
                    </p>
                    <p className="truncate font-mono text-[11.5px] text-[color:var(--ink-muted)]">
                      {t.last_from_email}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p
                      className={`truncate text-[14px] ${
                        t.unread_count > 0 ? "font-semibold" : ""
                      }`}
                    >
                      {t.last_subject}
                    </p>
                    {t.messages_count > 1 ? (
                      <span className="mono-label shrink-0 rounded-full bg-[color:var(--cream-soft)] px-1.5 py-0.5 text-[0.56rem]">
                        {t.messages_count}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-[color:var(--ink-muted)]">
                    {t.last_direction === "outbound" ? "✓ Wysłane: " : ""}
                    {t.last_preview}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  <time className="text-[11.5px] text-[color:var(--ink-muted)]">
                    {formatDate(t.last_received_at)}
                  </time>
                  {t.unread_count > 0 ? (
                    <span
                      aria-label={`${t.unread_count} nieprzeczytanych`}
                      className="inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--saffron)] text-[10px] font-bold text-[color:var(--cream)]"
                    >
                      {t.unread_count}
                    </span>
                  ) : (
                    <EnvelopeOpen size={14} className="text-[color:var(--ink-muted)]" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] ?? "")).toUpperCase();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}
