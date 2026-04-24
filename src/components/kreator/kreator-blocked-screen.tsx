import Link from "next/link";
import { PLAN_OFFERS, type PlanOfferKey } from "@/components/plans/offers";
import { PlanCard } from "@/components/plans/plan-card";
import type { PlanId } from "@/lib/plans/quotas";
import { cn } from "@/lib/utils";

type Props = {
  plan: PlanId;
  used: number;
  limit: number;
  reason: "plan_limit" | "no_access";
  stripeReady: boolean;
};

function pickOffers(plan: PlanId): PlanOfferKey[] {
  // Pro wyczerpał miesięczny limit — pack dla Pro nie pomoże, sugerujemy tylko Unlimited.
  if (plan === "pro") return ["unlimited"];
  // Free (i edge-case "no_access") — pełny wybór.
  return ["pack", "pro", "unlimited"];
}

function buildHeadline(plan: PlanId, used: number, limit: number) {
  if (plan === "pro") {
    return {
      title: `Wykorzystałeś ${used}/${limit} pobrań tego miesiąca`,
      subtitle:
        "Miesięczny limit planu Pro resetuje się pierwszego dnia każdego miesiąca. Potrzebujesz więcej już teraz? Przejdź na Unlimited.",
    };
  }
  return {
    title: "Wykorzystałeś swoje darmowe pobranie",
    subtitle:
      "Twoje CV jest bezpieczne — zapisaliśmy wszystko i wróci tutaj zaraz po zakupie. Wybierz plan lub jednorazowy pakiet, aby kontynuować.",
  };
}

export function KreatorBlockedScreen({ plan, used, limit, reason, stripeReady }: Props) {
  const offerKeys = pickOffers(plan);
  const { title, subtitle } = buildHeadline(plan, used, limit);
  const gridCols =
    offerKeys.length === 1
      ? "md:grid-cols-1 md:max-w-md md:mx-auto"
      : "md:grid-cols-3";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--cream)] text-[color:var(--ink)]">
      {/* Ambient gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--saffron) 22%, transparent), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--jade) 16%, transparent), transparent 40%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="mono-label text-[0.62rem] text-[color:var(--ink-muted)] transition-colors hover:text-ink"
          >
            agentcv
          </Link>
          <nav className="flex items-center gap-5 text-[13px]">
            <Link href="/konto" className="text-[color:var(--ink-muted)] transition-colors hover:text-ink">
              Konto
            </Link>
            <Link
              href="/subskrypcja"
              className="inline-flex items-center gap-1.5 text-[color:var(--ink-muted)] transition-colors hover:text-ink"
            >
              Pełne porównanie
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14">
          <div className="mb-10 max-w-3xl">
            <p className="mono-label text-[color:var(--saffron)]">
              {reason === "no_access" ? "Plan Free bez dostępu" : "Limit osiągnięty"}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl font-body text-[1.05rem] leading-relaxed text-[color:var(--ink-soft)] sm:text-[1.15rem]">
              {subtitle}
            </p>
          </div>

          {!stripeReady ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] leading-snug text-amber-900">
              Płatności jeszcze nie skonfigurowane na tym środowisku. Szczegóły w{" "}
              <Link href="/subskrypcja" className="underline">
                /subskrypcja
              </Link>
              .
            </div>
          ) : null}

          <div className={cn("grid items-stretch gap-6", gridCols)}>
            {offerKeys.map((key) => (
              <PlanCard key={key} offer={PLAN_OFFERS[key]} stripeReady={stripeReady} />
            ))}
          </div>

          <footer className="mt-12 flex flex-col items-center gap-2 text-center">
            <p className="text-[12.5px] text-[color:var(--ink-muted)]">
              Płatność bezpiecznie przez Stripe. PLN · BLIK · karty · Przelewy24. Fakturę VAT
              wystawiamy automatycznie po podaniu NIP.
            </p>
            <p className="text-[12px] text-[color:var(--ink-muted)]">
              <Link href="/kontakt" className="underline hover:text-ink">
                Napisz do nas
              </Link>
              {" · "}
              <Link href="/subskrypcja" className="underline hover:text-ink">
                Pełne porównanie
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
