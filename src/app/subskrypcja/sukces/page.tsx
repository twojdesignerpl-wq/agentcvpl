import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";

export const metadata: Metadata = {
  title: "Subskrypcja aktywowana | agentcv",
  robots: { index: false, follow: false },
};

export default function SukcesPage() {
  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
          <span
            aria-hidden
            className="inline-flex size-16 items-center justify-center rounded-full bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
          >
            <CheckCircle size={32} weight="fill" />
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight">
            Subskrypcja aktywna
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
            Dzięki — Pracuś AI działa w pełni. Potwierdzenie poszło na Twój e-mail. Plan aktualizuje się
            w ciągu chwili (webhook Stripe → Supabase).
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/kreator"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-cream hover:opacity-95"
            >
              Otwórz kreator
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/konto"
              className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-6 py-3 text-[14px] font-semibold text-ink hover:border-ink"
            >
              Moje konto
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
