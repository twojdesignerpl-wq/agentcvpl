import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server Supabase client dla Server Components, Route Handlers, Server Actions.
 * Cookies przekazywane przez next/headers.
 *
 * NIE używa service_role — to klient user-scoped, chroniony przez RLS.
 * Dla operacji admin (service_role) stwórz osobny helper `createSupabaseServiceClient`.
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase nie jest skonfigurowany — ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component render — nie możemy set cookies. Middleware/Route Handler to zrobi.
        }
      },
    },
  });
}

/**
 * Service-role Supabase client — ADMIN, BACKEND ONLY, NIGDY nie eksportuj tego do
 * Client Component lub API które ufa user inputu bez weryfikacji.
 * RLS jest OMIJANY. Używaj tylko do: webhooks, cron jobs, migration scripts.
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY nie jest skonfigurowany — to klucz admin, ustaw TYLKO w Vercel env (nigdy nie prefix NEXT_PUBLIC_)",
    );
  }
  return createServerClient(url, serviceRole, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
