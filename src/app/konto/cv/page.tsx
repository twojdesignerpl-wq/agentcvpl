import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, FileText } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { CvRow } from "@/app/actions/cv";
import { CvCard } from "./cv-card";

export const metadata: Metadata = {
  title: "Historia CV | agentcv",
  description: "Wszystkie Twoje wersje CV w jednym miejscu. Otwórz, pobierz, usuń.",
  robots: { index: false, follow: false },
};

export default async function KontoCvPage() {
  if (!isSupabaseConfigured()) {
    redirect("/zaloguj");
  }
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/zaloguj?next=/konto/cv");

  const { data, error } = await supabase
    .from("cvs")
    .select("id, data, effective_font_size, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  const rows = (data ?? []) as CvRow[];

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-4xl px-6 pt-28 pb-24 sm:px-8">
          <Link
            href="/konto"
            className="mono-label mb-6 inline-flex items-center gap-1.5 text-[0.62rem] text-[color:var(--ink-muted)] hover:text-ink"
          >
            <ArrowLeft size={12} weight="bold" />
            Wróć do konta
          </Link>

          <header className="mb-10 flex flex-col gap-3">
            <p className="mono-label text-[color:var(--saffron)]">Historia CV</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              Twoje zapisane CV
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
              Zapisujesz CV na koncie z poziomu kreatora przyciskiem <strong>Zapisz na koncie</strong>.
              Możesz wrócić do dowolnej wersji i kontynuować edycję.
            </p>
          </header>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              Nie udało się wczytać listy CV: {error.message}
            </div>
          ) : null}

          {rows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_18%,transparent)] bg-[color:var(--cream-soft)] p-10 text-center">
              <span
                aria-hidden
                className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-white text-[color:var(--ink-muted)]"
              >
                <FileText size={22} />
              </span>
              <p className="mt-4 font-display text-[1.125rem] font-semibold tracking-tight">
                Jeszcze nic nie zapisałeś
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[color:var(--ink-soft)]">
                Otwórz kreator, stwórz CV i naciśnij <strong>Zapisz na koncie</strong> w toolbarze.
              </p>
              <Link
                href="/kreator"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-cream hover:opacity-95"
              >
                <Plus size={14} weight="bold" />
                Otwórz kreator
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {rows.map((row) => (
                <CvCard key={row.id} row={row} />
              ))}
            </div>
          )}
        </div>
      </main>
    </MarketingShell>
  );
}
