import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureAdminRole, isAdminUser } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/nav";

export const metadata: Metadata = {
  title: "Panel admina | agentcv",
  description: "Zarządzanie kontami i planami użytkowników.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/zaloguj");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/zaloguj?next=/admin");

  if (!isAdminUser(data.user)) {
    return <AdminForbidden email={data.user.email ?? ""} />;
  }

  try {
    await ensureAdminRole(data.user);
  } catch (err) {
    console.error("[admin:ensureRole]", err);
  }

  return (
    <div className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <AdminNav email={data.user.email ?? ""} />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">{children}</div>
    </div>
  );
}

function AdminForbidden({ email }: { email: string }) {
  return (
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-xl px-6 pt-28 pb-24 sm:px-8">
        <Link
          href="/konto"
          className="mono-label mb-6 inline-flex items-center gap-1.5 text-[0.62rem] text-[color:var(--ink-muted)] hover:text-ink"
        >
          <ArrowLeft size={12} weight="bold" />
          Wróć do konta
        </Link>
        <h1 className="font-display text-[2rem] font-bold tracking-tight">Brak dostępu</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
          Panel admina jest zastrzeżony. Zalogowany e-mail <code className="rounded bg-[color:var(--cream-soft)] px-1.5 py-0.5 text-[13px]">{email}</code>{" "}
          nie jest na liście administratorów.
        </p>
      </div>
    </main>
  );
}
