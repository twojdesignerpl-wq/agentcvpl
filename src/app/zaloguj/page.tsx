import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LoginButtons } from "@/components/auth/login-buttons";
import { ForgotPasswordLink } from "@/components/auth/forgot-password-link";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Zaloguj się | agentcv",
  description:
    "Zaloguj się do agentcv.pl — kreator CV z asystentem Pracuś AI. Google, Facebook lub e-mail. Pierwsze CV za darmo.",
  robots: { index: false, follow: true },
};

// Auth state zależy od cookies — sprawdzamy na każdym renderze, nigdy nie cache'ujemy.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function ZalogujPage({ searchParams }: { searchParams: SearchParams }) {
  const { next, error } = await searchParams;

  // Jeśli user już zalogowany — redirect na "next" (albo /konto), nie pokazuj formy.
  // Chroni przed pętlą gdy user wraca z OAuth z już ustawioną sesją.
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/konto";
      redirect(safeNext);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-between px-6 pb-10 pt-6 sm:px-8">
        <Link
          href="/"
          className="mono-label inline-flex items-center gap-1.5 self-start text-[0.62rem] text-[color:var(--ink-muted)] transition-colors hover:text-ink"
        >
          <ArrowLeft size={12} weight="bold" />
          Powrót
        </Link>

        <section className="flex flex-col gap-6 py-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <PracusBrandImage variant="icon" size={72} priority className="h-16 w-16 rounded-2xl" />
            <div>
              <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.02em]">
                Zaloguj się do <span className="text-[color:var(--saffron)]">agentcv</span>
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-soft)]">
                Twoje CV pozostanie zapisane — synchronizujemy je z Twoim kontem.
              </p>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] leading-snug text-rose-800"
            >
              Nie udało się zalogować: {decodeURIComponent(error)}
            </div>
          ) : null}

          <LoginButtons redirectTo={next && next.startsWith("/") ? next : "/konto"} />

          <div className="text-center">
            <ForgotPasswordLink />
          </div>
        </section>

        <footer className="flex flex-col gap-2 text-center">
          <p className="text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
            Logując się akceptujesz{" "}
            <Link href="/regulamin" className="underline decoration-[color:var(--saffron)]/50 hover:decoration-[color:var(--saffron)]">
              regulamin
            </Link>{" "}
            i{" "}
            <Link
              href="/polityka-prywatnosci"
              className="underline decoration-[color:var(--saffron)]/50 hover:decoration-[color:var(--saffron)]"
            >
              politykę prywatności
            </Link>
            .
          </p>
          <p className="mono-label text-[0.54rem] text-[color:var(--ink-muted)]">
            Pierwsze pobranie CV masz za darmo po zalogowaniu.
          </p>
        </footer>
      </div>
    </main>
  );
}
