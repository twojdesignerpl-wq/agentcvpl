import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { UserTable, type AdminUserRow } from "@/components/admin/user-table";
import { getUserPlan } from "@/lib/plans/quotas";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 1000;

export default async function AdminUsersPage() {
  const admin = createSupabaseServiceClient();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: PAGE_SIZE });

  const rows: AdminUserRow[] = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "—",
    plan: getUserPlan(u),
    role: ((u.app_metadata as { role?: string } | null)?.role === "admin" ? "admin" : "user") as
      | "admin"
      | "user",
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at ?? null,
  }));

  return (
    <div>
      <header className="mb-8">
        <p className="mono-label text-[color:var(--saffron)]">Admin</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em]">
          Użytkownicy
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--ink-soft)]">
          Łącznie <strong>{rows.length}</strong> kont. Kliknij wiersz aby zmienić plan.
        </p>
      </header>

      <UserTable users={rows} />
    </div>
  );
}
