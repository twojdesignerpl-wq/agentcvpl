import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminGrantsPage() {
  const admin = createSupabaseServiceClient();
  const { data } = await admin
    .from("plan_grants")
    .select("id, user_id, email, from_plan, to_plan, source, reason, granted_at")
    .order("granted_at", { ascending: false })
    .limit(200);

  const grants = data ?? [];

  return (
    <div>
      <header className="mb-8">
        <p className="mono-label text-[color:var(--saffron)]">Admin</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em]">
          Historia zmian planów
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
          Audit log wszystkich zmian subskrypcji — ręcznych (admin), automatycznych (Stripe) i systemowych.
        </p>
      </header>

      {grants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_18%,transparent)] bg-[color:var(--cream-soft)] p-10 text-center text-[color:var(--ink-muted)]">
          Brak wpisów w audit logu.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white">
          <table className="w-full text-left text-[13.5px]">
            <thead className="bg-[color:var(--cream-soft)] text-[color:var(--ink-muted)]">
              <tr>
                <th className="mono-label px-4 py-3 text-[0.56rem]">Data</th>
                <th className="mono-label px-4 py-3 text-[0.56rem]">E-mail</th>
                <th className="mono-label px-4 py-3 text-[0.56rem]">Zmiana</th>
                <th className="mono-label px-4 py-3 text-[0.56rem]">Źródło</th>
                <th className="mono-label hidden px-4 py-3 text-[0.56rem] lg:table-cell">Powód</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]">
              {grants.map((g) => (
                <tr key={g.id} className="hover:bg-[color:var(--cream-soft)]/50">
                  <td className="whitespace-nowrap px-4 py-3 text-[12px] text-[color:var(--ink-muted)]">
                    {new Date(g.granted_at).toLocaleString("pl-PL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="max-w-[240px] truncate px-4 py-3 font-medium">
                    <Link href={`/admin/users/${g.user_id}`} className="hover:text-[color:var(--saffron)]">
                      {g.email}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="text-[color:var(--ink-muted)]">{g.from_plan ?? "—"}</span>
                    <span className="mx-1.5 text-[color:var(--ink-muted)]">→</span>
                    <strong>{g.to_plan}</strong>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mono-label inline-flex rounded-full px-2 py-0.5 text-[0.56rem] font-semibold ${
                        g.source === "stripe"
                          ? "bg-[color:var(--jade)]/20 text-[color:var(--jade)]"
                          : g.source === "admin"
                            ? "bg-[color:var(--saffron)]/25 text-ink"
                            : "bg-[color:var(--ink)]/10 text-[color:var(--ink-soft)]"
                      }`}
                    >
                      {g.source}
                    </span>
                  </td>
                  <td className="hidden max-w-[400px] truncate px-4 py-3 text-[12.5px] text-[color:var(--ink-soft)] lg:table-cell">
                    {g.reason ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
