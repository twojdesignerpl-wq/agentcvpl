import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = {
  title: "Moje konto | agentcv",
  description: "Zarządzaj swoim kontem w agentcv — plan, zapisane CV, ustawienia.",
  robots: { index: false, follow: false },
};

export default async function KontoPage() {
  if (!isSupabaseConfigured()) {
    return <ConfigurationMissing />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/zaloguj?next=/konto");

  const user = data.user;
  const email = user.email ?? "—";
  const plan = ((user.app_metadata as { plan?: string } | null)?.plan as string | undefined) ?? "free";
  const createdAt = user.created_at ? new Date(user.created_at) : null;

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-24 sm:px-8 lg:px-12">
          <header className="mb-10 flex flex-col gap-3">
            <p className="mono-label text-[color:var(--saffron)]">Moje konto</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              Cześć, {email.split("@")[0]}
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
              Twoje CV jest zapisywane lokalnie. W tej wersji konto służy do logowania — pełna
              synchronizacja CV z chmurą i Stripe dojdą wkrótce.
            </p>
          </header>

          <section className="mb-10 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-6">
            <h2 className="mono-label mb-4 text-[0.64rem] text-[color:var(--ink-muted)]">Dane konta</h2>
            <dl className="grid gap-3 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[color:var(--ink-muted)]">E-mail</dt>
                <dd className="truncate font-medium text-ink">{email}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[color:var(--ink-muted)]">Plan</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                    <span className="size-1.5 rounded-full bg-[color:var(--saffron)]" aria-hidden />
                    {plan}
                  </span>
                </dd>
              </div>
              {createdAt ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[color:var(--ink-muted)]">Konto utworzone</dt>
                  <dd className="font-medium text-ink">
                    {createdAt.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="mb-10 grid gap-3 md:grid-cols-3">
            <Link
              href="/kreator"
              className="group flex items-center justify-between rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 transition-colors hover:border-[color:var(--ink)]"
            >
              <div>
                <p className="mono-label mb-1 text-[0.56rem] text-[color:var(--ink-muted)]">Kreator</p>
                <p className="font-display text-[16px] font-semibold tracking-tight text-ink">
                  Otwórz moje CV
                </p>
                <p className="mt-1 text-[12px] text-[color:var(--ink-muted)]">
                  Kontynuuj edycję w tym samym miejscu
                </p>
              </div>
              <ArrowRight size={16} weight="bold" className="text-[color:var(--ink-muted)] transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/konto/cv"
              className="group flex items-center justify-between rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 transition-colors hover:border-[color:var(--ink)]"
            >
              <div>
                <p className="mono-label mb-1 text-[0.56rem] text-[color:var(--ink-muted)]">Historia</p>
                <p className="font-display text-[16px] font-semibold tracking-tight text-ink">
                  Historia CV
                </p>
                <p className="mt-1 text-[12px] text-[color:var(--ink-muted)]">
                  Zapisane wersje, ostatnia edycja
                </p>
              </div>
              <ArrowRight size={16} weight="bold" className="text-[color:var(--ink-muted)] transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/subskrypcja"
              className="group flex items-center justify-between rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 transition-colors hover:border-[color:var(--ink)]"
            >
              <div>
                <p className="mono-label mb-1 text-[0.56rem] text-[color:var(--ink-muted)]">Plan</p>
                <p className="font-display text-[16px] font-semibold tracking-tight text-ink">
                  Przejdź na Pro
                </p>
                <p className="mt-1 text-[12px] text-[color:var(--ink-muted)]">
                  Pracuś AI + bez limitu pobrań
                </p>
              </div>
              <ArrowRight size={16} weight="bold" className="text-[color:var(--ink-muted)] transition-transform group-hover:translate-x-1" />
            </Link>
          </section>

          <SignOutButton />
        </div>
      </main>
    </MarketingShell>
  );
}

function ConfigurationMissing() {
  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-2xl px-6 pt-28 pb-24 sm:px-8">
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight">
            Konto niedostępne
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
            Logowanie nie jest skonfigurowane. Dodaj zmienne <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            i <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> w ustawieniach Vercel i redeploy projekt.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/kreator"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-cream hover:opacity-90"
            >
              Otwórz kreator
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link href="/" className="text-[14px] text-[color:var(--ink-muted)] hover:text-ink">
              Wróć na stronę główną
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
