import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RecoverForm } from "./recover-form";

export const metadata: Metadata = {
  title: "Ustaw nowe hasło | agentcv",
  description: "Ustaw nowe hasło po resetcie.",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return (
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-between px-6 pb-10 pt-6 sm:px-8">
        <Link
          href="/"
          className="mono-label inline-flex items-center gap-1.5 self-start text-[0.62rem] text-[color:var(--ink-muted)] transition-colors hover:text-ink"
        >
          <ArrowLeft size={12} weight="bold" />
          Powrót
        </Link>

        <section className="flex flex-col gap-6 py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-display text-[clamp(1.75rem,5vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.02em]">
              Ustaw <span className="text-[color:var(--saffron)]">nowe hasło</span>
            </h1>
            <p className="max-w-sm text-[14px] leading-relaxed text-[color:var(--ink-soft)]">
              Wpisz nowe hasło — min. 8 znaków. Po zapisaniu zalogujesz się automatycznie.
            </p>
          </div>
          <RecoverForm />
        </section>

        <footer className="text-center text-[12px] text-[color:var(--ink-muted)]">
          Problem z resetem?{" "}
          <Link href="/zaloguj" className="underline hover:text-ink">
            Wróć do logowania
          </Link>
        </footer>
      </div>
    </main>
  );
}
