import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isStripeConfigured } from "@/lib/stripe/plans";
import { PLAN_OFFERS, PLAN_OFFERS_ORDER } from "@/components/plans/offers";
import { PlanCard } from "@/components/plans/plan-card";

export const metadata: Metadata = {
  title: "Subskrypcja | agentcv",
  description: "Wybierz plan — Pro Pack jednorazowo, Pro miesięcznie albo Unlimited. Pełen Pracuś AI, historia CV, priority.",
  robots: { index: false, follow: true },
};

export default async function SubskrypcjaPage() {
  if (!isSupabaseConfigured()) {
    return (
      <MarketingShell>
        <main className="mx-auto min-h-[100dvh] max-w-xl px-6 pt-28 pb-24">
          <h1 className="font-display text-[2rem] font-bold tracking-tight">
            Subskrypcje niedostępne
          </h1>
          <p className="mt-3 text-[15px] text-[color:var(--ink-soft)]">
            Logowanie jeszcze nie skonfigurowane. Zobacz{" "}
            <Link href="/#cennik" className="underline">
              cennik
            </Link>
            .
          </p>
        </main>
      </MarketingShell>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/zaloguj?next=/subskrypcja");

  const currentPlan =
    ((data.user.app_metadata as { plan?: string } | null)?.plan as string | undefined) ?? "free";
  const stripeReady = isStripeConfigured();

  // Map current subscription plan → "isCurrent" dla karty.
  // Pack jako one-time nigdy nie jest "current" (kupiony = wygasa gdy credits=0).
  const isCurrent = (key: string): boolean => {
    if (key === "pro" && currentPlan === "pro") return true;
    if (key === "unlimited" && currentPlan === "unlimited") return true;
    return false;
  };

  return (
    <MarketingShell>
      <main className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 8%, color-mix(in oklab, var(--saffron) 18%, transparent), transparent 45%), radial-gradient(circle at 88% 75%, color-mix(in oklab, var(--jade) 14%, transparent), transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 sm:px-8">
          <Link
            href="/konto"
            className="mono-label mb-6 inline-flex items-center gap-1.5 text-[0.62rem] text-[color:var(--ink-muted)] transition-colors hover:text-ink"
          >
            <ArrowLeft size={12} weight="bold" />
            Wróć do konta
          </Link>

          <header className="mb-14 max-w-2xl">
            <p className="mono-label text-[color:var(--saffron)]">Subskrypcja</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              Wybierz plan, który <span className="editorial-underline">pracuje</span> z Tobą
            </h1>
            <p className="mt-5 font-body text-[1.05rem] leading-relaxed text-[color:var(--ink-soft)]">
              Twój aktualny plan:{" "}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.12em]">
                {currentPlan}
              </span>
              . Anulujesz w każdej chwili z poziomu Stripe Customer Portal.
            </p>
          </header>

          {!stripeReady ? (
            <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[13px] leading-snug text-amber-900">
              Płatności w trybie scaffolding. Dodaj <code>STRIPE_SECRET_KEY</code>,{" "}
              <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>, <code>STRIPE_WEBHOOK_SECRET</code>,{" "}
              <code>STRIPE_PRICE_PRO</code>, <code>STRIPE_PRICE_UNLIMITED</code>,{" "}
              <code>STRIPE_PRICE_PRO_PACK</code> w Vercel env, potem redeploy.
            </div>
          ) : null}

          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {PLAN_OFFERS_ORDER.map((key) => (
              <PlanCard
                key={key}
                offer={PLAN_OFFERS[key]}
                stripeReady={stripeReady}
                isCurrent={isCurrent(key)}
              />
            ))}
          </div>

          <p className="mt-10 text-center text-[12px] text-[color:var(--ink-muted)]">
            Płatność bezpiecznie przez Stripe. Obsługujemy karty PL, BLIK, Przelewy24 (wg regionu).
            Fakturę VAT wystawiamy automatycznie po podaniu NIP.
          </p>
        </div>
      </main>
    </MarketingShell>
  );
}
