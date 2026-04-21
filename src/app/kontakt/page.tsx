import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, EnvelopeSimple, Question, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/poradniki/breadcrumb";
import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { BRAND } from "@/lib/landing/brand";
import { breadcrumbSchema, contactPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Kontakt — napisz do nas | agentcv",
  description:
    "Masz pytanie o kreator CV lub asystenta Pracuś AI? Napisz na hej@agentcv.pl — odpisujemy w ciągu 24h, po polsku.",
  keywords: ["kontakt agentcv", "pomoc agentcv", "napisz do nas agentcv", "wsparcie kreator CV"],
  alternates: { canonical: "/kontakt" },
  openGraph: {
    type: "website",
    title: "Kontakt — agentcv",
    description: "Napisz do nas. Odpisujemy w ciągu 24h, po polsku.",
    url: "/kontakt",
    siteName: "agentcv",
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", title: "Kontakt — agentcv" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const schema = [
    contactPageSchema({
      name: "Kontakt agentcv",
      description: "Skontaktuj się z zespołem agentcv poprzez e-mail.",
      slug: "/kontakt",
      email: BRAND.email,
    }),
    breadcrumbSchema([
      { name: "Strona główna", url: "/" },
      { name: "Kontakt", url: "/kontakt" },
    ]),
  ];

  const channels = [
    {
      icon: EnvelopeSimple,
      title: "E-mail",
      text: BRAND.email,
      href: `mailto:${BRAND.email}`,
      caption: "Odpisujemy w ciągu doby, w dni robocze",
    },
    {
      icon: Question,
      title: "FAQ",
      text: "Sprawdź częste pytania",
      href: "/#faq",
      caption: "10 odpowiedzi na najczęstsze pytania o agentcv",
    },
    {
      icon: ShieldCheck,
      title: "RODO / Prywatność",
      text: "Polityka prywatności",
      href: "/polityka-prywatnosci",
      caption: "Usunięcie konta, dostęp do danych, zgody",
    },
  ];

  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:px-8">
        <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Kontakt" }]} />

        <header className="mt-8 mb-12 border-b border-[color:var(--ink)]/10 pb-10">
          <p className="mono-label text-[color:var(--saffron)]">Pomoc · Kontakt</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            Napisz do nas
          </h1>
          <p className="mt-6 max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
            Pytanie o kreator, asystenta Pracuś AI, fakturę VAT, albo chcesz podzielić się feedbackiem? Jesteśmy po polsku. Odpisujemy w ciągu doby.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {channels.map(({ icon: Icon, title, text, href, caption }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-6 transition-all hover:border-[color:var(--ink)]/30 hover:shadow-[0_24px_48px_-28px_rgba(10,14,26,0.2)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream)] text-[color:var(--ink)] transition-colors group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--cream)]">
                <Icon size={20} weight="duotone" />
              </span>
              <div>
                <h2 className="font-display text-[1.15rem] font-semibold text-[color:var(--ink)]">
                  {title}
                </h2>
                <p className="mt-1 font-body text-[0.95rem] text-[color:var(--ink)]">{text}</p>
                <p className="mt-2 font-body text-[0.85rem] text-[color:var(--ink-muted)]">{caption}</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-8">
          <h2 className="font-display text-[1.45rem] font-semibold tracking-tight text-[color:var(--ink)]">
            Szukasz konkretnego rozwiązania?
          </h2>
          <ul className="mt-5 space-y-3 font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
            <li>
              <strong className="text-[color:var(--ink)]">Usunięcie konta i CV</strong> — ustawienia konta w
              kreatorze, „Usuń konto&rdquo;. Zero pisania do supportu.
            </li>
            <li>
              <strong className="text-[color:var(--ink)]">Faktura VAT (plan Unlimited)</strong> — faktury generujemy automatycznie po płatności. Pobierzesz je z panelu konta.
            </li>
            <li>
              <strong className="text-[color:var(--ink)]">Współpraca / partnerstwo</strong> — pisz na{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="font-semibold text-[color:var(--ink)] underline decoration-[color:var(--saffron)]/60 underline-offset-4"
              >
                {BRAND.email}
              </a>{" "}
              z tematem „Partner&rdquo;.
            </li>
            <li>
              <strong className="text-[color:var(--ink)]">Bug / błąd w kreatorze</strong> — opisz krok po
              kroku, załącz screenshot jeśli się da.
            </li>
          </ul>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)] p-10 text-[color:var(--cream)] sm:p-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
                Chcesz zobaczyć kreator w akcji?
              </h2>
              <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--cream)]/75">
                Pierwsze CV za darmo, bez karty. Logowanie Google albo Facebook — bez kolejnego hasła.
              </p>
            </div>
            <MagneticButton
              href="/kreator?utm_source=kontakt&utm_medium=closing&utm_campaign=kontakt"
              variant="saffron"
              size="lg"
            >
              Otwórz kreator
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </div>
        </section>
      </div>

      <Script id="kontakt-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
    </main>
    </MarketingShell>
  );
}
