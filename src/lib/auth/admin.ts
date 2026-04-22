import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { requireUser, type GuardResult } from "@/lib/auth/guard";

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email ?? "").toLowerCase();
  if (email && getAdminEmails().has(email)) return true;
  const role = (user.app_metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function requireAdmin(): Promise<GuardResult> {
  const g = await requireUser();
  if (!g.ok) return g;
  if (!isAdminUser(g.user)) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Brak uprawnień administratora.", code: "forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      ),
    };
  }
  await ensureAdminRole(g.user).catch((err) => {
    console.error("[admin:ensureRole]", err);
  });
  return g;
}

/**
 * Idempotent seed: ustawia app_metadata.role='admin' + wstawia do public.admins.
 * Wywoływane przy pierwszym wejściu admina do /admin.
 */
export async function ensureAdminRole(user: User): Promise<void> {
  const role = (user.app_metadata as { role?: string } | null)?.role;
  const admin = createSupabaseServiceClient();
  const updates: Record<string, unknown> = {};
  if (role !== "admin") {
    updates.app_metadata = { ...(user.app_metadata ?? {}), role: "admin" };
  }
  if (Object.keys(updates).length > 0) {
    const { error } = await admin.auth.admin.updateUserById(user.id, updates);
    if (error) throw error;
  }
  const { error: upsertErr } = await admin
    .from("admins")
    .upsert(
      { user_id: user.id, email: user.email ?? "", granted_by: user.id },
      { onConflict: "user_id" },
    );
  if (upsertErr) throw upsertErr;
}
