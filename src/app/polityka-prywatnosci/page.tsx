import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/landing/_shared/marketing-shell";
import { BRAND } from "@/lib/landing/brand";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności agentcv.pl — jakie dane zbieramy, jak je przetwarzamy, Twoje prawa z RODO.",
  alternates: { canonical: "/polityka-prywatnosci" },
  robots: { index: true, follow: true },
};

const LAST_UPDATE = "21 kwietnia 2026";

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell>
    <main className="min-h-[100dvh] bg-[color:var(--cream)] text-[color:var(--ink)]">
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:px-8">
        <header className="mb-12 border-b border-[color:var(--ink)]/10 pb-8">
          <p className="mono-label text-[color:var(--ink-muted)]">Dokument prawny</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
            Polityka prywatności
          </h1>
          <p className="mt-4 font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
            Ostatnia aktualizacja: {LAST_UPDATE}. Obowiązuje od dnia publikacji.
          </p>
        </header>

        <div className="prose-agentcv">
          <section>
            <h2 id="administrator">§1. Administrator danych</h2>
            <p>
              Administratorem Twoich danych osobowych jest zespół {BRAND.name} działający pod domeną{" "}
              <strong>{BRAND.domain}</strong>. Kontakt:{" "}
              <a href={`mailto:${BRAND.email}`} className="underline">
                {BRAND.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 id="zakres">§2. Jakie dane przetwarzamy</h2>
            <p>
              {BRAND.name} to kreator CV z kontem użytkownika (Supabase) i asystentem AI Pracuś.
              Pierwsze pobranie CV jest darmowe. Twoje dane CV zapisują się przede wszystkim
              w przeglądarce, a po zalogowaniu opcjonalnie synchronizujemy je z Twoim kontem:
            </p>
            <ul>
              <li>
                <strong>Dane CV (imię, nazwisko, email, telefon, adres, doświadczenie zawodowe,
                wykształcenie, umiejętności)</strong> — przechowywane <em>wyłącznie lokalnie</em>{" "}
                w pamięci Twojej przeglądarki (<code>localStorage</code>). Nigdy nie trafiają na
                nasze serwery w postaci trwałej.
              </li>
              <li>
                <strong>Treść wiadomości do agenta Pracuś i treść do poprawy/wygenerowania</strong>{" "}
                — przesyłana w czasie rzeczywistym do dostawcy modelu AI (Anthropic, USA) tylko
                na czas obsługi zapytania.
              </li>
              <li>
                <strong>Plik PDF wysłany do importu</strong> — parsowany server-side, tekst
                przekazywany do modelu AI, wynik zwracany klientowi. Ani plik, ani tekst nie są
                przechowywane po zakończeniu zapytania.
              </li>
              <li>
                <strong>Anonimowe metryki technical</strong> (Vercel Analytics, Speed Insights) —
                bez identyfikatorów osobowych, bez cookies śledzących.
              </li>
              <li>
                <strong>Email (opcjonalnie, przy zapisie do newslettera)</strong> — wyłącznie na
                podstawie Twojej wyraźnej zgody.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="rodo">§3. Podstawa prawna i cele</h2>
            <p>Przetwarzamy dane na podstawie Rozporządzenia UE 2016/679 (RODO):</p>
            <ul>
              <li>
                <strong>art. 6 ust. 1 lit. a RODO</strong> (zgoda) — dotyczy zapisu do newslettera
                i wysyłania treści CV do modelu AI Anthropic w celu wygenerowania propozycji.
              </li>
              <li>
                <strong>art. 6 ust. 1 lit. f RODO</strong> (uzasadniony interes administratora) —
                dotyczy anonimowych metryk technicznych (Vercel Analytics, Speed Insights) oraz
                zabezpieczeń przed nadużyciami (rate limiting po adresie IP w krótkim oknie
                czasowym).
              </li>
            </ul>
            <p>
              Cele: udostępnienie funkcji kreatora CV, obsługa agenta AI, ochrona przed atakami,
              komunikacja z użytkownikiem (gdy zapisze się do newslettera).
            </p>
          </section>

          <section>
            <h2 id="odbiorcy">§4. Komu przekazujemy dane</h2>
            <p>
              Twoje dane przetwarzają następujący procesorzy danych:
            </p>
            <ul>
              <li>
                <strong>Anthropic PBC</strong> (USA) — dostawca modeli językowych Claude. Treści
                wysłane do agenta są przesyłane do API Anthropic. Polityka Anthropic:{" "}
                <a
                  href="https://www.anthropic.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  anthropic.com/legal/privacy
                </a>
                . Anthropic deklaruje 30-dniową retencję danych API w celu zabezpieczeń.
              </li>
              <li>
                <strong>Vercel Inc.</strong> (USA) — hosting aplikacji, edge network, Analytics,
                Speed Insights. Polityka:{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
                .
              </li>
            </ul>
            <p>
              Przekazywanie danych poza EOG odbywa się na podstawie standardowych klauzul
              umownych (SCC) oraz decyzji o adekwatności Komisji Europejskiej tam, gdzie ma
              zastosowanie.
            </p>
          </section>

          <section>
            <h2 id="retencja">§5. Jak długo przechowujemy dane</h2>
            <ul>
              <li>
                <strong>Dane CV w localStorage</strong> — tak długo, jak ich tam nie wyczyścisz.
                Możesz je skasować w każdej chwili przez ustawienia przeglądarki lub opcję
                &bdquo;Wyczyść CV&rdquo; w kreatorze.
              </li>
              <li>
                <strong>Żądania do API</strong> — nie są trwale logowane po naszej stronie.
                Retencja po stronie Anthropic i Vercel — zgodnie z ich politykami.
              </li>
              <li>
                <strong>Email z newslettera</strong> — do momentu wypisania się (link w każdej
                wiadomości).
              </li>
            </ul>
          </section>

          <section>
            <h2 id="prawa">§6. Twoje prawa</h2>
            <p>W dowolnym momencie przysługuje Ci prawo do:</p>
            <ul>
              <li>dostępu do swoich danych i otrzymania ich kopii,</li>
              <li>sprostowania danych,</li>
              <li>
                usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;) — w przypadku CV
                wystarczy wyczyszczenie <code>localStorage</code>; w przypadku newslettera —
                kontakt na podany wyżej adres,
              </li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych (eksport CV do PDF/DOCX w kreatorze realizuje to prawo),</li>
              <li>sprzeciwu wobec przetwarzania (w tym profilowania — którego nie stosujemy),</li>
              <li>
                wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl), jeśli
                uznasz że Twoje dane są przetwarzane nieprawidłowo.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="cookies">§7. Pliki cookies i localStorage</h2>
            <p>
              {BRAND.name} nie używa cookies marketingowych ani śledzących. Używamy:
            </p>
            <ul>
              <li>
                <code>localStorage</code> (klucz <code>kreator-cv-v10</code>) — Twoje dane CV w
                przeglądarce,
              </li>
              <li>
                cookies techniczne Vercel (np. na potrzeby CDN i A/B testów wewnętrznych
                platformy) — bez identyfikacji osobowej.
              </li>
            </ul>
            <p>
              Możesz wyłączyć localStorage w ustawieniach przeglądarki, ale kreator wtedy nie
              zadziała poprawnie.
            </p>
          </section>

          <section>
            <h2 id="bezpieczenstwo">§8. Bezpieczeństwo</h2>
            <p>
              Aplikacja komunikuje się przez HTTPS (HSTS preload), stosuje Content Security Policy,
              same-origin check na endpointach, rate limiting oraz sanityzację danych wejściowych.
              Nie przechowujemy haseł (brak rejestracji), nie zbieramy PESEL, daty urodzenia ani
              innych danych wrażliwych.
            </p>
          </section>

          <section>
            <h2 id="zmiany">§9. Zmiany polityki</h2>
            <p>
              Możemy aktualizować treść tego dokumentu. Data ostatniej zmiany jest widoczna na
              górze strony. Istotne zmiany zakomunikujemy w aplikacji lub przez newsletter (jeśli
              jesteś zapisany).
            </p>
          </section>

          <section>
            <h2 id="kontakt">§10. Kontakt</h2>
            <p>
              Pytania o prywatność, żądania związane z Twoimi prawami — pisz na{" "}
              <a href={`mailto:${BRAND.email}`} className="underline">
                {BRAND.email}
              </a>
              . Odpowiadamy w ciągu 30 dni zgodnie z art. 12 RODO.
            </p>
          </section>
        </div>

        <footer className="mt-16 border-t border-[color:var(--ink)]/10 pt-8 text-center">
          <p className="mono-label text-[color:var(--ink-muted)]">
            Zobacz też:{" "}
            <Link href="/regulamin" className="underline">
              Regulamin
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
