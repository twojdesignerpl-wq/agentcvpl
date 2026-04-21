"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type UserState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
};

/**
 * Reactive user state — subscrybuje Supabase auth state changes.
 * Zwraca `{ user, loading, configured }`. `configured: false` gdy env vars brak
 * (dev bez Supabase) — komponent może gracefully fallback na anon flow.
 */
export function useUser(): UserState {
  const configured = isSupabaseConfigured();
  // Lazy init — startujemy z loading=true tylko jeśli Supabase skonfigurowany
  // (inaczej od razu false bez ryzyka setState-in-effect).
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => configured);

  useEffect(() => {
    if (!configured) return;

    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [configured]);

  return { user, loading, configured };
}
