import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isStripeConfigured } from "@/lib/stripe/plans";
import { canDownload } from "@/lib/plans/usage";
import { KreatorShell } from "./kreator-shell";
import { KreatorBlockedScreen } from "./kreator-blocked-screen";

/**
 * Server Component otaczający edytor CV.
 * Sprawdza quotę pobrań (canDownload) PRZED renderowaniem Shell.
 * Jeśli Free wykorzystał 1/1 pobrań (albo Pro 10/10, albo Pack 0 credits) —
 * zamiast edytora pokazujemy blok-screen z 3 CTA (Pro Pack / Pro / Unlimited).
 *
 * Auth gate jest wyżej w layout.tsx (redirect /zaloguj gdy brak user). Tu wiemy,
 * że user jest zalogowany (gdy Supabase skonfigurowany).
 */
export async function KreatorGated() {
  // Dev mode bez Supabase — passthrough (brak auth/plan system).
  if (!isSupabaseConfigured()) {
    return <KreatorShell />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  // Layout.tsx powinien już był zrobić redirect, ale double-check dla bezpieczeństwa.
  if (!data.user) {
    return <KreatorShell />;
  }

  const check = await canDownload(data.user);

  if (!check.ok) {
    return (
      <KreatorBlockedScreen
        plan={check.plan}
        used={check.used}
        limit={check.limit}
        reason={check.reason}
        stripeReady={isStripeConfigured()}
      />
    );
  }

  return <KreatorShell />;
}
