import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";

export const metadata: Metadata = {
  title: "Płatność anulowana | agentcv",
  robots: { index: false, follow: false },
};

export default function AnulowanePage() {
  return (
    <MarketingShell>
      <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
        <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
          <span
            aria-hidden
            className="inline-flex size-16 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] text-[color:var(--ink-muted)]"
          >
            <XCircle size={32} weight="regular" />
          </span>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight">
            Płatność anulowana
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
            Nie rozpoczęliśmy subskrypcji. Nic Ci nie obciążyliśmy. Wróć, kiedy będziesz gotowy — Twoje
            dane i CV zostają nienaruszone.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/subskrypcja"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-cream hover:opacity-95"
            >
              <ArrowLeft size={14} weight="bold" />
              Wróć do planów
            </Link>
            <Link
              href="/kreator"
              className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-6 py-3 text-[14px] font-semibold text-ink hover:border-ink"
            >
              Otwórz kreator (Free)
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
