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

const LAST_UPDATE = "25 kwietnia 2026";

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
                <strong>Konto</strong> — indywidualny profil Użytkownika utworzony w serwisie
                wymagany do dostępu do kreatora CV (<code>/kreator</code>) i pobierania CV.
              </li>
              <li>
                <strong>Usługa</strong> — kreator CV z asystentem AI Pracuś, udostępniany w
                formie strony internetowej, w wariantach Free oraz odpłatnych (Pro, Unlimited,
                Pro Pack — patrz §7).
              </li>
              <li>
                <strong>Plan</strong> — pakiet uprawnień (limity pobrań, dostęp do AI) wybrany
                przez Użytkownika. Plany są opisane w §7 oraz na stronie{" "}
                <Link href="/#cennik" className="underline">cennika</Link>.
              </li>
              <li>
                <strong>Agent Pracuś</strong> — model językowy oparty o Claude firmy Anthropic,
                skonfigurowany do wsparcia użytkownika w pisaniu polskojęzycznego CV.
              </li>
              <li>
                <strong>Treści cyfrowe</strong> — pliki CV w formatach PDF i DOCX wygenerowane
                przez Usługę i pobierane przez Użytkownika (treści cyfrowe niezapisane na
                materialnym nośniku w rozumieniu art. 38 pkt 13 ustawy z 30 maja 2014 r. o
                prawach konsumenta).
              </li>
            </ul>
          </section>

          <section>
            <h2 id="rodzaj">§2. Rodzaj i zakres usługi</h2>
            <p>
              {BRAND.name} udostępnia następujące funkcje (zakres dostępu zależy od wybranego
              Planu — patrz §7):
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
              Korzystanie z kreatora wymaga założenia Konta (e-mail + hasło lub logowanie OAuth).
              Dane edytowanego CV zapisywane są w pamięci przeglądarki Użytkownika
              (<code>localStorage</code>) oraz, opcjonalnie, w bazie Usługodawcy w celu
              synchronizacji między urządzeniami.
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
            <h2 id="platnosci">§7. Płatności, plany i prawo odstąpienia</h2>
            <p>
              <strong>Plany.</strong> Usługa dostępna jest w czterech wariantach:
            </p>
            <ul>
              <li>
                <strong>Free</strong> — 1 pobranie CV miesięcznie, bez dostępu do AI Pracuś
                (bezpłatnie).
              </li>
              <li>
                <strong>Pro</strong> — 19&nbsp;zł / miesiąc (subskrypcja) — 10 pobrań / mies.,
                pełny dostęp do AI Pracuś, dopasowanie do ogłoszenia.
              </li>
              <li>
                <strong>Unlimited</strong> — 39&nbsp;zł / miesiąc (subskrypcja) — bez limitu
                pobrań, priorytetowe AI, wczesny dostęp.
              </li>
              <li>
                <strong>Pro Pack</strong> — 19&nbsp;zł jednorazowo (płatność jednokrotna) —
                10 kredytów na pobranie CV + pełne AI. Kredyty nie wygasają.
              </li>
            </ul>
            <p>
              <strong>Operator płatności.</strong> Płatności obsługuje Stripe Payments Europe
              Ltd. (Irlandia). Rozliczenia w PLN. Faktury wystawia operator.
            </p>
            <p>
              <strong>Odnawianie subskrypcji.</strong> Plany Pro i Unlimited odnawiają się
              automatycznie co miesiąc do momentu rezygnacji. Rezygnacja możliwa w dowolnej
              chwili z poziomu portalu Stripe — usługa działa do końca opłaconego okresu.
            </p>
            <p>
              <strong>Prawo odstąpienia od umowy.</strong> Konsumentowi przysługuje co do zasady
              prawo do odstąpienia od umowy zawartej na odległość w terminie 14 dni bez podania
              przyczyny (art. 27 ustawy z 30 maja 2014 r. o prawach konsumenta).
            </p>
            <p>
              <strong>Wyjątek dla treści cyfrowych — art. 38 pkt 13 u.p.k.</strong> Zgodnie z
              art. 38 pkt 13 ustawy o prawach konsumenta, prawo odstąpienia <em>nie przysługuje</em>{" "}
              w odniesieniu do umów o dostarczanie treści cyfrowych niezapisanych na materialnym
              nośniku, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta
              przed upływem terminu odstąpienia i po poinformowaniu go przez Usługodawcę o
              utracie prawa do odstąpienia.
            </p>
            <p>
              W trakcie procesu zakupu (w bramce Stripe) Konsument zostaje poproszony o złożenie
              następującego oświadczenia:
            </p>
            <blockquote>
              &bdquo;Akceptuję Regulamin oraz wyrażam zgodę na rozpoczęcie spełniania świadczenia
              (dostarczenie treści cyfrowych — generowanie i pobieranie CV) przed upływem
              14-dniowego terminu odstąpienia. Po pierwszym pobraniu CV traci się prawo
              odstąpienia od umowy zgodnie z art. 38 pkt 13 ustawy z dnia 30 maja 2014 r. o
              prawach konsumenta.&rdquo;
            </blockquote>
            <p>
              <strong>Skutek złożenia oświadczenia.</strong> Po pierwszym pobraniu CV (PDF lub
              DOCX) Konsument traci prawo do odstąpienia od umowy zarówno w przypadku planów
              subskrypcyjnych (Pro/Unlimited), jak i jednorazowego Pro Pack. W szczególnych
              przypadkach (np. brak pobrania w okresie subskrypcji) Usługodawca może rozpatrzyć
              indywidualne zwroty na podstawie wniosku skierowanego na adres{" "}
              <a href={`mailto:${BRAND.email}`} className="underline">{BRAND.email}</a>.
            </p>
            <p>
              <strong>Przerwa w dostępie do płatnej Usługi.</strong> W razie nieuregulowanej
              płatności (odrzucona karta, wygasająca subskrypcja) plan Użytkownika zostaje
              automatycznie obniżony do Free. Wcześniej wygenerowane i pobrane CV pozostają u
              Użytkownika.
            </p>
          </section>

          <section>
            <h2 id="reklamacje">§8. Reklamacje</h2>
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
            <h2 id="zmiany">§9. Zmiany regulaminu</h2>
            <p>
              Usługodawca zastrzega prawo do wprowadzenia zmian w niniejszym regulaminie. O
              istotnych zmianach Użytkownicy zostaną poinformowani w aplikacji lub przez
              newsletter (jeśli są zapisani). Dalsze korzystanie z Usługi po ogłoszeniu zmian
              oznacza ich akceptację.
            </p>
          </section>

          <section>
            <h2 id="koncowe">§10. Postanowienia końcowe</h2>
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
