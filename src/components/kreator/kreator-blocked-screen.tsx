import Link from "next/link";
import { CheckCircle, Sparkle, Crown, Package } from "@phosphor-icons/react/dist/ssr";
import { CheckoutButton } from "@/app/subskrypcja/checkout-button";
import type { PlanId } from "@/lib/plans/quotas";
import { cn } from "@/lib/utils";

type Props = {
  plan: PlanId;
  used: number;
  limit: number;
  reason: "plan_limit" | "no_access";
  stripeReady: boolean;
};

type OfferKey = "pack" | "pro" | "unlimited";

type Offer = {
  key: OfferKey;
  label: string;
  price: string;
  cadence: string;
  badge: string;
  icon: typeof Package;
  tagline: string;
  features: string[];
  ctaPlan: "pro" | "unlimited";
  ctaMode: "sub" | "pack";
  ctaLabel: string;
  highlight: boolean;
};

const OFFERS: Record<OfferKey, Offer> = {
  pack: {
    key: "pack",
    label: "Pro Pack",
    price: "19 zł",
    cadence: "jednorazowo",
    badge: "Najszybciej",
    icon: Package,
    tagline: "Kupujesz raz, używasz kiedy chcesz. Kredyty nie wygasają.",
    features: [
      "10 pobrań PDF / DOCX",
      "Pełny Pracuś AI (chat + inline)",
      "Dopasowanie do ogłoszenia",
      "Bez odnowień i subskrypcji",
    ],
    ctaPlan: "pro",
    ctaMode: "pack",
    ctaLabel: "Kup Pro Pack",
    highlight: true,
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: "19 zł",
    cadence: "miesięcznie",
    badge: "Dla szukających",
    icon: Sparkle,
    tagline: "Odnawia się co miesiąc. 10 pobrań, pełny AI, dopasowanie ATS.",
    features: [
      "10 pobrań co miesiąc",
      "Pełny Pracuś AI + live ATS score",
      "Dopasowanie do ogłoszenia",
      "Anulujesz kiedy chcesz",
    ],
    ctaPlan: "pro",
    ctaMode: "sub",
    ctaLabel: "Przejdź na Pro",
    highlight: false,
  },
  unlimited: {
    key: "unlimited",
    label: "Unlimited",
    price: "39 zł",
    cadence: "miesięcznie",
    badge: "Bez limitu",
    icon: Crown,
    tagline: "Nieograniczone pobrania, priority AI, wsparcie premium.",
    features: [
      "Pobrania bez limitu",
      "Priority Pracuś AI",
      "Wczesny dostęp do nowych funkcji",
      "Dedykowane wsparcie",
    ],
    ctaPlan: "unlimited",
    ctaMode: "sub",
    ctaLabel: "Przejdź na Unlimited",
    highlight: false,
  },
};

function pickOffers(plan: PlanId): OfferKey[] {
  if (plan === "pro") {
    // Pro wyczerpał miesięczny limit — pack dla Pro nie pomoże (Pro już ma ~10/mc).
    // Jedyna sensowna ścieżka: Unlimited.
    return ["unlimited"];
  }
  // Free (i edge-case "no_access" dla download) — pełen wybór.
  return ["pack", "pro", "unlimited"];
}

function buildHeadline(plan: PlanId, used: number, limit: number): { title: string; subtitle: string } {
  if (plan === "pro") {
    return {
      title: `Wykorzystałeś ${used}/${limit} pobrań tego miesiąca`,
      subtitle:
        "Miesięczny limit planu Pro resetuje się pierwszego dnia każdego miesiąca. Potrzebujesz więcej już teraz? Przejdź na Unlimited.",
    };
  }
  // Free (domyślnie)
  return {
    title: "Wykorzystałeś swoje darmowe pobranie",
    subtitle:
      "Twoje CV jest bezpieczne — zapisaliśmy wszystko i wróci tutaj zaraz po zakupie. Wybierz plan lub jednorazowy pakiet, aby kontynuować.",
  };
}

export function KreatorBlockedScreen({ plan, used, limit, reason, stripeReady }: Props) {
  const offers = pickOffers(plan);
  const { title, subtitle } = buildHeadline(plan, used, limit);
  const gridCols = offers.length === 1 ? "md:grid-cols-1 md:max-w-md md:mx-auto" : "md:grid-cols-3";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--saffron) 18%, transparent), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--jade) 14%, transparent), transparent 40%)",
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

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label text-[color:var(--saffron)]">
              {reason === "no_access" ? "Plan Free bez dostępu" : "Limit osiągnięty"}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.02] tracking-[-0.025em]">
              {title}
            </h1>
            <p className="mt-6 font-body text-[1.05rem] leading-relaxed text-[color:var(--ink-soft)] sm:text-[1.15rem]">
              {subtitle}
            </p>
          </div>

          {!stripeReady ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] leading-snug text-amber-900">
              Płatności jeszcze nie skonfigurowane na tym środowisku. Dodaj Stripe env vars i
              zredeployuj — szczegóły w{" "}
              <Link href="/subskrypcja" className="underline">
                /subskrypcja
              </Link>
              .
            </div>
          ) : null}

          <div className={cn("grid gap-5", gridCols)}>
            {offers.map((key) => {
              const offer = OFFERS[key];
              const Icon = offer.icon;
              return (
                <article
                  key={offer.key}
                  className={cn(
                    "flex flex-col gap-4 rounded-3xl border p-6 transition-colors",
                    offer.highlight
                      ? "border-[color:var(--ink)] bg-[color:var(--cream-soft)] shadow-[0_24px_64px_-28px_rgba(10,14,26,0.32)]"
                      : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white",
                  )}
                >
                  <header className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-2xl",
                        offer.highlight
                          ? "bg-[color:var(--saffron)]/25 text-ink"
                          : "bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] text-[color:var(--ink-soft)]",
                      )}
                    >
                      <Icon size={18} weight="fill" />
                    </span>
                    <span
                      className={cn(
                        "mono-label rounded-full px-2.5 py-0.5 text-[0.56rem]",
                        offer.highlight
                          ? "bg-[color:var(--saffron)]/25 text-ink"
                          : "bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] text-[color:var(--ink-muted)]",
                      )}
                    >
                      {offer.badge}
                    </span>
                  </header>

                  <div>
                    <h2 className="font-display text-[1.5rem] font-bold tracking-tight">
                      {offer.label}
                    </h2>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-[2rem] font-bold leading-none tracking-tight">
                        {offer.price}
                      </span>
                      <span className="text-[12.5px] text-[color:var(--ink-muted)]">
                        {offer.cadence}
                      </span>
                    </div>
                  </div>

                  <p className="text-[13.5px] leading-relaxed text-[color:var(--ink-soft)]">
                    {offer.tagline}
                  </p>

                  <ul className="flex flex-1 flex-col gap-2">
                    {offer.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px]">
                        <CheckCircle
                          size={14}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-[color:var(--jade)]"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <CheckoutButton
                      plan={offer.ctaPlan}
                      mode={offer.ctaMode}
                      label={offer.ctaLabel}
                      variant={offer.highlight ? "primary" : "ghost"}
                      disabled={!stripeReady}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <footer className="mt-10 flex flex-col items-center gap-2 text-center">
            <p className="text-[12.5px] text-[color:var(--ink-muted)]">
              Płatność bezpiecznie przez Stripe. PLN · BLIK · karty · Przelewy24. Fakturę VAT
              wystawiamy automatycznie po podaniu NIP.
            </p>
            <p className="text-[12px] text-[color:var(--ink-muted)]">
              Masz pytania?{" "}
              <Link href="/kontakt" className="underline hover:text-ink">
                Napisz do nas
              </Link>
              {" · "}
              <Link href="/subskrypcja" className="underline hover:text-ink">
                Zobacz pełne porównanie
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
