import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { BRAND } from "@/lib/landing/brand";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania z agentcv.pl — zasady użytkowania kreatora CV z agentem Pracuś.",
  alternates: { canonical: "/regulamin" },
  robots: { index: true, follow: true },
};

const LAST_UPDATE = "21 kwietnia 2026";

export default function TermsPage() {
  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:px-8">
        <header className="mb-12 border-b border-[color:var(--ink)]/10 pb-8">
          <p className="mono-label text-[color:var(--ink-muted)]">Dokument prawny</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
            Regulamin
          </h1>
          <p className="mt-4 font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
            Ostatnia aktualizacja: {LAST_UPDATE}. Obowiązuje od dnia publikacji.
          </p>
        </header>

        <div className="prose-agentcv">
          <section>
            <h2 id="definicje">§1. Definicje</h2>
            <ul>
              <li>
                <strong>Usługodawca</strong> — zespół {BRAND.name} prowadzący serwis pod adresem{" "}
                <strong>{BRAND.domain}</strong>.
              </li>
              <li>
                <strong>Użytkownik</strong> — każda osoba fizyczna korzystająca z serwisu.
              </li>
              <li>
                <strong>Usługa</strong> — bezpłatny kreator CV z asystentem AI Pracuś, udostępniany
                w formie strony internetowej.
              </li>
              <li>
                <strong>Agent Pracuś</strong> — model językowy oparty o Claude firmy Anthropic,
                skonfigurowany do wsparcia użytkownika w pisaniu polskojęzycznego CV.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="rodzaj">§2. Rodzaj i zakres usługi</h2>
            <p>
              {BRAND.name} udostępnia bezpłatnie następujące funkcje:
            </p>
            <ul>
              <li>Edytor CV z podglądem w czasie rzeczywistym,</li>
              <li>5 szablonów wizualnych zoptymalizowanych pod ATS,</li>
              <li>Asystent AI Pracuś (czat i inline generowanie treści pól),</li>
              <li>Import istniejącego CV z pliku PDF,</li>
              <li>Eksport CV do formatu PDF i DOCX,</li>
              <li>Analiza dopasowania CV do ogłoszenia o pracę.</li>
            </ul>
            <p>
              Usługa nie wymaga rejestracji konta. Dane CV zapisywane są w pamięci przeglądarki
              Użytkownika (<code>localStorage</code>) i nie są przechowywane na serwerach
              Usługodawcy.
            </p>
          </section>

          <section>
            <h2 id="wymagania">§3. Wymagania techniczne</h2>
            <ul>
              <li>Aktualna przeglądarka z obsługą JavaScript i localStorage (Chrome, Firefox,
                Safari, Edge — wersje z ostatnich 24 miesięcy),</li>
              <li>Połączenie z Internetem (zalecane min. 1 Mbps),</li>
              <li>Do generowania PDF/DOCX — co najmniej 200 MB wolnej pamięci operacyjnej.</li>
            </ul>
          </section>

          <section>
            <h2 id="zakres-geo">§4. Zakres językowy i geograficzny</h2>
            <p>
              Usługa jest przeznaczona <strong>wyłącznie</strong> dla użytkowników tworzących CV w
              języku polskim, dla polskiego rynku pracy. Agent Pracuś odmawia tłumaczenia CV na
              języki obce oraz dostosowywania dokumentu do rynków zagranicznych.
            </p>
          </section>

          <section>
            <h2 id="odpowiedzialnosc">§5. Odpowiedzialność</h2>
            <ul>
              <li>
                <strong>Treść CV tworzy Użytkownik.</strong> Usługodawca nie odpowiada za
                prawdziwość, kompletność ani skutki użycia treści wpisanych do CV. Agent Pracuś
                wspomaga proces, ale nie weryfikuje faktów i nie wymyśla danych — zgodność z
                prawdą leży po stronie Użytkownika.
              </li>
              <li>
                <strong>Dostawca AI.</strong> Funkcje AI działają na bazie modeli firmy Anthropic
                PBC. Usługodawca nie ponosi odpowiedzialności za przerwy w dostępności modeli
                wywołane przez dostawcę ani za odpowiedzi modelu odbiegające od oczekiwań.
              </li>
              <li>
                <strong>Utrata danych.</strong> Dane CV przechowywane w localStorage mogą zostać
                utracone przy wyczyszczeniu przeglądarki, wylogowaniu z konta systemowego lub
                awarii. Użytkownik jest odpowiedzialny za bieżący eksport (PDF/DOCX) swoich
                dokumentów.
              </li>
              <li>
                <strong>Przerwy techniczne.</strong> Usługodawca dokłada starań o ciągłość
                działania, ale zastrzega prawo do okresowych prac technicznych bez uprzedzenia.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="uzytkownik">§6. Obowiązki Użytkownika</h2>
            <p>Użytkownik zobowiązuje się do:</p>
            <ul>
              <li>
                Używania Usługi wyłącznie w celu zgodnym z jej przeznaczeniem (tworzenie własnego
                CV na polski rynek pracy).
              </li>
              <li>
                Nie przesyłania treści bezprawnych, obraźliwych, naruszających prawa osób
                trzecich (w szczególności: kopiowanie cudzego CV, podszywanie się pod inną osobę,
                fałszowanie kwalifikacji).
              </li>
              <li>
                Nie podejmowania prób obejścia zabezpieczeń technicznych (limity zapytań,
                weryfikacja pochodzenia, walidacja wejść).
              </li>
              <li>
                Nie używania Usługi jako fasady do masowego pobierania lub odsprzedaży usług AI
                (abuse, scraping, resell).
              </li>
            </ul>
          </section>

          <section>
            <h2 id="reklamacje">§7. Reklamacje</h2>
            <p>
              Reklamacje dotyczące działania Usługi należy kierować na adres:{" "}
              <a href={`mailto:${BRAND.email}`} className="underline">
                {BRAND.email}
              </a>
              . Reklamacje rozpatrywane są w terminie do 30 dni od dnia zgłoszenia. Odpowiedź
              zostanie udzielona w formie elektronicznej.
            </p>
          </section>

          <section>
            <h2 id="zmiany">§8. Zmiany regulaminu</h2>
            <p>
              Usługodawca zastrzega prawo do wprowadzenia zmian w niniejszym regulaminie. O
              istotnych zmianach Użytkownicy zostaną poinformowani w aplikacji lub przez
              newsletter (jeśli są zapisani). Dalsze korzystanie z Usługi po ogłoszeniu zmian
              oznacza ich akceptację.
            </p>
          </section>

          <section>
            <h2 id="koncowe">§9. Postanowienia końcowe</h2>
            <ul>
              <li>
                W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności Kodeks
                cywilny oraz ustawę o świadczeniu usług drogą elektroniczną.
              </li>
              <li>
                Spory wynikające z korzystania z Usługi rozstrzyga sąd właściwy miejscowo dla
                siedziby Usługodawcy.
              </li>
              <li>
                Konsumenci mają dodatkowe prawa wynikające z ustawy o prawach konsumenta oraz
                mogą korzystać z platformy ODR (Online Dispute Resolution) Unii Europejskiej:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </li>
            </ul>
          </section>
        </div>

        <footer className="mt-16 border-t border-[color:var(--ink)]/10 pt-8 text-center">
          <p className="mono-label text-[color:var(--ink-muted)]">
            Zobacz też:{" "}
            <Link href="/polityka-prywatnosci" className="underline">
              Polityka prywatności
            </Link>
            {" "}·{" "}
            <Link href="/" className="underline">
              Strona główna
            </Link>
          </p>
        </footer>
      </article>
    </main>
    </MarketingShell>
  );
}
