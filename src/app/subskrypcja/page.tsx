import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { STRIPE_PLANS, isStripeConfigured } from "@/lib/stripe/plans";
import { pricingPlans } from "@/lib/landing/content";
import { CheckoutButton } from "./checkout-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subskrypcja | agentcv",
  description: "Wybierz plan — Pro albo Unlimited. Pełen Pracuś AI, historia CV, priority.",
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

  const plans = pricingPlans.filter((p) => p.id !== "free");

  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto max-w-5xl px-6 pt-28 pb-24 sm:px-8">
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
              <code>STRIPE_PRICE_PRO</code>, <code>STRIPE_PRICE_UNLIMITED</code> w Vercel env,
              potem redeploy.
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => {
              const stripePlan = STRIPE_PLANS[plan.id as "pro" | "unlimited"];
              const isCurrent = currentPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "flex flex-col gap-5 rounded-3xl border p-7 transition-colors",
                    plan.popular
                      ? "border-[color:var(--ink)] bg-[color:var(--cream-soft)] shadow-[0_24px_64px_-28px_rgba(10,14,26,0.28)]"
                      : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white",
                    isCurrent && "ring-2 ring-[color:var(--saffron)]/60",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-[1.75rem] font-bold tracking-tight">
                      {plan.name}
                    </h2>
                    {plan.highlight ? (
                      <span className="mono-label rounded-full bg-[color:var(--saffron)]/25 px-2.5 py-0.5 text-[0.58rem] text-ink">
                        {plan.highlight}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[2.5rem] font-bold leading-none tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-[13px] text-[color:var(--ink-muted)]">
                      {plan.cadence}
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-[color:var(--ink-soft)]">
                    {plan.tagline}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px]">
                        <CheckCircle
                          size={16}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-[color:var(--jade)]"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    {isCurrent ? (
                      <span className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--jade)]/40 bg-[color:var(--jade)]/10 px-4 py-3 text-[14px] font-semibold text-[color:var(--jade)]">
                        Twój aktualny plan
                      </span>
                    ) : (
                      <CheckoutButton
                        plan={plan.id as "pro" | "unlimited"}
                        disabled={!stripeReady || !stripePlan.priceId}
                        label={plan.cta}
                      />
                    )}
                  </div>
                </div>
              );
            })}
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
