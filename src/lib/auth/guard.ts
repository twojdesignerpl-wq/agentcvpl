import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export type GuardResult =
  | { ok: true; user: User }
  | { ok: false; response: Response };

/**
 * Guard dla API routes wymagających zalogowanego użytkownika.
 * Zwraca albo `{ ok: true, user }` albo `{ ok: false, response: 401 }`.
 *
 * Użycie w route handler:
 *
 * ```ts
 * const guard = await requireUser();
 * if (!guard.ok) return guard.response;
 * const { user } = guard;
 * ```
 */
export async function requireUser(): Promise<GuardResult> {
  if (!isSupabaseConfigured()) {
    // Dev bez Supabase — endpoint działa jak przed auth gate (anon dozwolony).
    // Produkcyjnie Supabase MUSI być skonfigurowany, więc nie uderzy tego branchu.
    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          error: "Logowanie nie jest skonfigurowane na serwerze.",
          code: "auth_not_configured",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      ),
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          error: "Zaloguj się, aby skorzystać z tej funkcji.",
          code: "unauthenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'Bearer realm="agentcv"',
          },
        },
      ),
    };
  }

  return { ok: true, user: data.user };
}
