import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isStripeConfigured } from "@/lib/stripe/plans";
import { canDownload } from "@/lib/plans/usage";
import { getEffectivePlan } from "@/lib/plans/quotas";
import { PlanProvider } from "@/lib/plan/plan-context";
import { KreatorShell } from "./kreator-shell";
import { KreatorBlockedScreen } from "./kreator-blocked-screen";

/**
 * Server Component otaczający edytor CV.
 * 1) Sprawdza quotę pobrań (canDownload) — jeśli wyczerpana → KreatorBlockedScreen.
 * 2) Dostarcza plan z serwera przez PlanProvider — client components (panel Pracuś,
 *    mobile tab AI, etc.) czytają hasAI zamiast z niewiarygodnego Zustand store.
 *
 * Auth gate jest wyżej w layout.tsx (redirect /zaloguj gdy brak user).
 */
export async function KreatorGated() {
  // Dev mode bez Supabase — passthrough z domyślnym Free.
  if (!isSupabaseConfigured()) {
    return (
      <PlanProvider plan="free" source="free">
        <KreatorShell />
      </PlanProvider>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    // Layout powinien zrobić redirect — fallback na pusty shell.
    return (
      <PlanProvider plan="free" source="free">
        <KreatorShell />
      </PlanProvider>
    );
  }

  const effective = await getEffectivePlan(data.user);
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

  return (
    <PlanProvider plan={effective.tier} source={effective.source}>
      <KreatorShell />
    </PlanProvider>
  );
}
