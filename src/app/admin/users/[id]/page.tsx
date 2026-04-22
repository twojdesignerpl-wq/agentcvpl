import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getUserPlan, PLAN_QUOTAS } from "@/lib/plans/quotas";
import { PlanGrantForm } from "@/components/admin/plan-grant-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ id: string }>;

function firstOfMonthIso(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function AdminUserDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const admin = createSupabaseServiceClient();

  const { data: userData, error } = await admin.auth.admin.getUserById(id);
  if (error || !userData.user) notFound();

  const user = userData.user;
  const plan = getUserPlan(user);
  const quota = PLAN_QUOTAS[plan];
  const role = (user.app_metadata as { role?: string } | null)?.role ?? "user";
  const stripeCustomerId = (user.app_metadata as { stripe_customer_id?: string } | null)
    ?.stripe_customer_id;

  const since = firstOfMonthIso();
  const [downloadsRes, aiChatRes, aiCvRes, cvCountRes, grantsRes, packsRes] = await Promise.all([
    admin
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .in("action", ["pdf", "docx"])
      .gte("created_at", since),
    admin
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("action", "ai_chat")
      .gte("created_at", since),
    admin
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("action", "ai_cv")
      .gte("created_at", since),
    admin.from("cvs").select("id", { count: "exact", head: true }).eq("user_id", id),
    admin
      .from("plan_grants")
      .select("id, from_plan, to_plan, reason, source, granted_at")
      .eq("user_id", id)
      .order("granted_at", { ascending: false })
      .limit(10),
    admin
      .from("plan_credits")
      .select("id, kind, credits_remaining, credits_granted, granted_at, stripe_session_id, active")
      .eq("user_id", id)
      .order("granted_at", { ascending: false })
      .limit(20),
  ]);

  const downloads = downloadsRes.count ?? 0;
  const aiChat = aiChatRes.count ?? 0;
  const aiCv = aiCvRes.count ?? 0;
  const cvCount = cvCountRes.count ?? 0;
  const grants = grantsRes.data ?? [];
  const packs = packsRes.data ?? [];
  const activePackCredits = packs
    .filter((p) => p.active && (p.credits_remaining as number) > 0)
    .reduce((sum, p) => sum + (p.credits_remaining as number), 0);

  const downloadLimit = Number.isFinite(quota.downloadsPerMonth)
    ? quota.downloadsPerMonth
    : "∞";

  return (
    <div>
      <Link
        href="/admin/users"
        className="mono-label mb-6 inline-flex items-center gap-1 text-[0.6rem] text-[color:var(--ink-muted)] hover:text-ink"
      >
        <ArrowLeft size={12} weight="bold" />
        Wszyscy użytkownicy
      </Link>

      <header className="mb-8">
        <p className="mono-label text-[color:var(--saffron)]">Użytkownik</p>
        <h1 className="mt-2 break-all font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em]">
          {user.email}
        </h1>
        <p className="mt-2 font-mono text-[12px] text-[color:var(--ink-muted)]">{user.id}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-[1.125rem] font-bold tracking-tight">Dane konta</h2>
            <dl className="grid gap-3 text-[14px]">
              <Row label="Plan">
                <span className="mono-label inline-flex rounded-full bg-[color:var(--saffron)]/25 px-2.5 py-0.5 text-[0.58rem] font-semibold">
                  {plan}
                </span>
              </Row>
              <Row label="Rola">{role}</Row>
              <Row label="Utworzone">
                {new Date(user.created_at).toLocaleString("pl-PL")}
              </Row>
              <Row label="Ostatni login">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("pl-PL") : "—"}
              </Row>
              <Row label="Stripe customer">
                {stripeCustomerId ? (
                  <code className="rounded bg-[color:var(--cream-soft)] px-1.5 py-0.5 text-[12px]">
                    {stripeCustomerId}
                  </code>
                ) : (
                  <span className="text-[color:var(--ink-muted)]">brak</span>
                )}
              </Row>
              <Row label="Zapisanych CV">{cvCount}</Row>
              <Row label="Pro Pack credits">
                {activePackCredits > 0 ? (
                  <span className="mono-label inline-flex rounded-full bg-[color:var(--saffron)]/25 px-2 py-0.5 text-[0.58rem] font-semibold">
                    {activePackCredits} aktywnych
                  </span>
                ) : (
                  <span className="text-[color:var(--ink-muted)]">brak</span>
                )}
              </Row>
            </dl>
          </section>

          {packs.length > 0 ? (
            <section className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
              <h2 className="mb-4 font-display text-[1.125rem] font-bold tracking-tight">
                Historia Pro Pack
              </h2>
              <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]">
                {packs.map((p) => (
                  <li key={p.id as string} className="flex flex-col gap-1 py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-medium">
                        {p.credits_remaining}/{p.credits_granted}{" "}
                        <span className="text-[color:var(--ink-muted)]">kredytów</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`mono-label rounded-full px-2 py-0.5 text-[0.56rem] ${
                            p.active
                              ? "bg-[color:var(--jade)]/20 text-[color:var(--jade)]"
                              : "bg-[color:var(--ink)]/10 text-[color:var(--ink-muted)]"
                          }`}
                        >
                          {p.active ? "aktywny" : "nieaktywny"}
                        </span>
                        <time className="text-[11px] text-[color:var(--ink-muted)]">
                          {new Date(p.granted_at as string).toLocaleDateString("pl-PL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                    {p.stripe_session_id ? (
                      <p className="font-mono text-[11px] text-[color:var(--ink-muted)]">
                        {(p.stripe_session_id as string).slice(0, 36)}…
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-[1.125rem] font-bold tracking-tight">
              Użycie w tym miesiącu
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <UsageCell label="Pobrania" used={downloads} limit={downloadLimit} />
              <UsageCell
                label="AI chat (dzień)"
                used={aiChat}
                limit={Number.isFinite(quota.aiChatRequestsPerDay) ? quota.aiChatRequestsPerDay : "∞"}
              />
              <UsageCell
                label="AI inline (dzień)"
                used={aiCv}
                limit={Number.isFinite(quota.aiCvRequestsPerDay) ? quota.aiCvRequestsPerDay : "∞"}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-[1.125rem] font-bold tracking-tight">
              Historia zmian planu
            </h2>
            {grants.length === 0 ? (
              <p className="text-[13px] text-[color:var(--ink-muted)]">Brak wpisów.</p>
            ) : (
              <ul className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]">
                {grants.map((g) => (
                  <li key={g.id} className="flex flex-col gap-1 py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-medium">
                        {g.from_plan ?? "—"} → <strong className="text-ink">{g.to_plan}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="mono-label rounded-full bg-[color:var(--cream-soft)] px-2 py-0.5 text-[0.56rem]">
                          {g.source}
                        </span>
                        <time className="text-[11px] text-[color:var(--ink-muted)]">
                          {new Date(g.granted_at).toLocaleDateString("pl-PL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                    {g.reason ? (
                      <p className="text-[12.5px] leading-relaxed text-[color:var(--ink-soft)]">
                        {g.reason}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <PlanGrantForm userId={user.id} userEmail={user.email ?? ""} currentPlan={plan} />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[color:var(--ink-muted)]">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function UsageCell({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | string;
}) {
  const ratio = typeof limit === "number" && limit > 0 ? Math.min(used / limit, 1) : 0;
  const warn = ratio >= 0.8;
  return (
    <div className="rounded-xl bg-[color:var(--cream-soft)] p-4">
      <p className="mono-label mb-1 text-[0.56rem] text-[color:var(--ink-muted)]">{label}</p>
      <p className="font-display text-[1.5rem] font-bold leading-none">
        {used}
        <span className="ml-1 text-[13px] font-normal text-[color:var(--ink-muted)]">/ {limit}</span>
      </p>
      {typeof limit === "number" ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full ${warn ? "bg-[color:var(--rust,#B84A2E)]" : "bg-[color:var(--saffron)]"}`}
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
