import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client — Client Components, hooki, form handlery.
 * Klient ANON KEY (publiczny, chroniony przez RLS w Postgres).
 *
 * PKCE flow wymuszony jawnie — tokeny trafiają jako `?code=` do naszego
 * `/auth/callback` gdzie serwer wymienia je na sesję i zapisuje w HTTP cookies.
 * Implicit flow (`#access_token=`) byłby niewidoczny dla SSR → pętla logowania.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase nie jest skonfigurowany — ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY w Vercel/env.local",
    );
  }
  return createBrowserClient(url, anon, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
