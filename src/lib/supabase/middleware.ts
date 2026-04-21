import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refresh sesji Supabase w Next.js 16 proxy. Wywołaj na początku proxy przed
 * innymi decyzjami — zapewni że `supabase.auth.getUser()` w Server Components
 * zobaczy aktualną sesję.
 *
 * Pattern z @supabase/ssr docs — mutuje cookies w request + response.
 * Jeśli Supabase nie jest skonfigurowany (brak env) → passthrough.
 */
export async function updateSupabaseSession(
  request: NextRequest,
): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  if (!url || !anon) {
    return response;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Wywołanie getUser() powoduje refresh tokenu jeśli wygasa w ciągu 60s.
  // NIE polegaj na getSession() — nie weryfikuje JWT.
  await supabase.auth.getUser();

  return response;
}
