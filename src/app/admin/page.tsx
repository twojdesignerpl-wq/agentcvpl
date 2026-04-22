import Link from "next/link";
import { ArrowRight, UsersThree, Receipt, ListChecks, Envelope } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const admin = createSupabaseServiceClient();

  const [usersRes, grantsRes, unreadRes, dispatchesRes] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1 }),
    admin.from("plan_grants").select("id", { count: "exact", head: true }),
    admin.from("emails").select("id", { count: "exact", head: true }).eq("direction", "inbound").is("read_at", null),
    admin.from("email_dispatches").select("id", { count: "exact", head: true }),
  ]);

  const totalUsers = (usersRes.data as { total?: number } | null)?.total ?? usersRes.data?.users?.length ?? 0;
  const grantsCount = grantsRes.count ?? 0;
  const unreadCount = unreadRes.count ?? 0;
  const dispatchesCount = dispatchesRes.count ?? 0;

  const recentGrants = await admin
    .from("plan_grants")
    .select("id, email, from_plan, to_plan, source, granted_at, reason")
    .order("granted_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <header className="mb-10">
        <p className="mono-label text-[color:var(--saffron)]">Admin</p>
        <h1 className="mt-2 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em]">
          Dashboard
        </h1>
        <p className="mt-3 text-[15px] text-[color:var(--ink-soft)]">
          Panel zarządzania agentcv.pl — użytkownicy, plany, historia, skrzynka hej@agentcv.pl
        </p>
      </header>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersThree} label="Użytkownicy" value={totalUsers} href="/admin/users" />
        <StatCard icon={ListChecks} label="Zmiany planów" value={grantsCount} href="/admin/grants" />
        <StatCard icon={Envelope} label="Nieprzeczytane" value={unreadCount} href="/admin/poczta" highlight={unreadCount > 0} />
        <StatCard icon={Receipt} label="Wysłane emaile" value={dispatchesCount} />
      </section>

      <section className="rounded-3xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-[1.25rem] font-bold tracking-tight">
            Ostatnie zmiany planów
          </h2>
          <Link
            href="/admin/grants"
            className="mono-label inline-flex items-center gap-1 text-[0.6rem] text-[color:var(--ink-muted)] hover:text-ink"
          >
            Pokaż wszystkie
            <ArrowRight size={10} weight="bold" />
          </Link>
        </div>

        {recentGrants.data && recentGrants.data.length > 0 ? (
          <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]">
            {recentGrants.data.map((g) => (
              <li key={g.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="truncate text-[14px] font-medium">{g.email}</span>
                <span className="text-[13px] text-[color:var(--ink-muted)]">
                  {g.from_plan ?? "—"} → <strong className="text-ink">{g.to_plan}</strong>
                </span>
                <span className="mono-label ml-auto shrink-0 rounded-full bg-[color:var(--cream)] px-2 py-0.5 text-[0.58rem] text-[color:var(--ink-muted)]">
                  {g.source}
                </span>
                <time className="shrink-0 text-[11px] text-[color:var(--ink-muted)]">
                  {new Date(g.granted_at).toLocaleString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-[14px] text-[color:var(--ink-muted)]">
            Jeszcze żadnych zmian planów.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" }>;
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        highlight
          ? "border-[color:var(--saffron)]/60 bg-[color:var(--saffron)]/10"
          : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white hover:border-[color:var(--ink)]"
      }`}
    >
      <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-[color:var(--cream-soft)] text-[color:var(--ink)]">
        <Icon size={18} weight="bold" />
      </div>
      <p className="mono-label mb-1 text-[0.58rem] text-[color:var(--ink-muted)]">{label}</p>
      <p className="font-display text-[1.75rem] font-bold tracking-tight">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
