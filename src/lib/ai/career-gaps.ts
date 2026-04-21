/**
 * Career gap patterns — wykrywanie przerw w karierze + templates.
 *
 * Polska specyfika: urlop macierzyński/rodzicielski, zasiłek, zmiana branży,
 * powrót po bezrobociu, służba, wolontariat.
 */

import type { CVData } from "@/lib/cv/schema";

export type GapType =
  | "maternity" // macierzyński / rodzicielski
  | "sabbatical" // świadoma przerwa
  | "health" // zdrowotna
  | "career-pivot" // zmiana branży
  | "unemployment" // bezrobocie / aktywne szukanie
  | "military" // służba wojskowa / zastępcza
  | "education" // nauka w pełnym wymiarze
  | "caregiving" // opieka nad bliskim
  | "relocation" // przeprowadzka
  | "unknown";

export interface CareerGap {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  durationMonths: number;
  /** Między którymi stanowiskami (id). */
  afterEmploymentId?: string;
  beforeEmploymentId?: string;
}

export interface GapTemplate {
  type: GapType;
  label: string;
  explanation: string;
  /** Sugerowana fraza do dodania w CV (jako custom section lub w profil). */
  suggestedPhrasing: string[];
  /** Co powiedzieć w rozmowie, nie w CV. */
  interviewGuidance: string;
}

export const GAP_TEMPLATES: Record<GapType, GapTemplate> = {
  maternity: {
    type: "maternity",
    label: "Urlop macierzyński / rodzicielski",
    explanation:
      "W Polsce pełny urlop macierzyński + rodzicielski to łącznie do 52 tygodni. Przerwa w CV związana z narodzinami dziecka jest standardowa i nie wymaga tłumaczenia — ale dobrze wspomnieć co robiłaś/robiłeś w tym czasie (kursy, wolontariat, projekty).",
    suggestedPhrasing: [
      "W okresie urlopu macierzyńskiego ukończyłam kurs [X] i rozwinęłam się w [Y].",
      "Podczas urlopu rodzicielskiego prowadziłam freelance w [obszar] — [klient, projekt].",
      "Przerwa rodzicielska [daty]. W trakcie: certyfikat [X], kurs online [Y].",
    ],
    interviewGuidance:
      "Nie musisz się tłumaczyć z urlopu. Jeśli recruiter pyta — zwięźle: 'byłam na urlopie rodzicielskim, w trakcie ukończyłam X, teraz wracam z pełnym zaangażowaniem'. Przepisy chronią przed dyskryminacją.",
  },

  sabbatical: {
    type: "sabbatical",
    label: "Świadoma przerwa (sabbatical)",
    explanation:
      "Celowa przerwa w karierze — podróże, projekt osobisty, edukacja. Rośnie w popularności, nie jest już postrzegana negatywnie.",
    suggestedPhrasing: [
      "Świadoma przerwa zawodowa [daty] — podróże/rozwój osobisty, w trakcie [konkretny projekt].",
      "Rok przerwy na projekt [X]: [co osiągnąłeś, jakie umiejętności rozwinąłeś].",
    ],
    interviewGuidance:
      "Bądź konkretny o efektach — nie 'znalazłem siebie', tylko 'napisałem książkę / ukończyłem kurs Stanford / odbyłem wolontariat w X'.",
  },

  health: {
    type: "health",
    label: "Przerwa zdrowotna",
    explanation:
      "Dyplomatycznie: nie musisz podawać szczegółów. Kluczowe — 'obecnie w pełnej dyspozycji'.",
    suggestedPhrasing: [
      "Przerwa zdrowotna [daty]. Obecnie w pełnej dyspozycji do pełnoetatowej pracy.",
      "W okresie [daty] skupiłem się na kwestiach zdrowotnych; obecnie wracam do pełnej aktywności zawodowej.",
    ],
    interviewGuidance:
      "Recruiter nie ma prawa pytać o zdrowie. Możesz mówić ogólnie: 'teraz jestem w pełni gotowy'. Nie wchodź w szczegóły medyczne.",
  },

  "career-pivot": {
    type: "career-pivot",
    label: "Zmiana branży (career pivot)",
    explanation:
      "Przeskok między branżami. Pokaż co łączy nową i starą, nie zrywaj narracji.",
    suggestedPhrasing: [
      "Świadoma zmiana branży z [X] na [Y]. Wykorzystuję [kompetencje transferowalne: komunikacja, analiza, zarządzanie projektami] w nowym kontekście.",
      "Przekwalifikowanie w [Y] — ukończyłem kurs [X], projekt portfolio [link], pierwsza komercyjna praca: [nazwa].",
    ],
    interviewGuidance:
      "Recruiter będzie pytać DLACZEGO. Miej spójną narrację — nie 'stara branża mnie wypaliła' tylko 'zafascynowała mnie Y, zacząłem uczyć się przed zmianą, teraz mam konkretne projekty'.",
  },

  unemployment: {
    type: "unemployment",
    label: "Okres bez pracy / aktywnego szukania",
    explanation:
      "Długie bezrobocie może niepokoić recruitera. Pokaż aktywność: kursy, projekty, wolontariat, freelance.",
    suggestedPhrasing: [
      "Aktywnie szukam pracy w [branża]. W okresie przerwy ukończyłem [X], rozwijam projekt [Y].",
      "Między stanowiskami — koncentracja na rozwoju: kurs [X], certyfikat [Y], projekt pet-project [Z].",
    ],
    interviewGuidance:
      "Nie mów 'nie mogłem znaleźć pracy'. Pokaż agency: 'świadomie szukałem właściwej roli, w międzyczasie rozwijałem X'.",
  },

  military: {
    type: "military",
    label: "Służba wojskowa / zawodowa",
    explanation:
      "W Polsce obecnie brak powszechnego poboru, ale ochotnicza (NATO, wojsko zawodowe, WOT) rośnie. Pokaż co dała.",
    suggestedPhrasing: [
      "Służba wojskowa / WOT [daty]. Zdobyte umiejętności: dyscyplina, praca w strukturze, [X].",
      "Wojsko Obrony Terytorialnej — [pozycja]. Certyfikaty: [X], [Y].",
    ],
    interviewGuidance:
      "Podkreśl umiejętności transferowalne: logistyka, leadership, praca w kryzysie, odporność na stres.",
  },

  education: {
    type: "education",
    label: "Pełnoetatowa nauka",
    explanation:
      "Studia stacjonarne, szkoła doktorska, bootcamp. Jeśli masz — CV pokazuje to w sekcji Edukacja, nie jako gap.",
    suggestedPhrasing: [
      "W okresie [daty] ukończyłem [program]. Projekt dyplomowy: [X].",
      "Studia / bootcamp [X] w pełnym wymiarze — kluczowe kompetencje: [Y, Z].",
    ],
    interviewGuidance:
      "Edukacja to atut, nie przerwa. Pokaż konkret — 'napisałem pracę o X', 'bootcamp z Y, projekt portfolio Z'.",
  },

  caregiving: {
    type: "caregiving",
    label: "Opieka nad bliskim",
    explanation: "Uczciwe, szanowane. Dyplomatycznie, bez szczegółów medycznych.",
    suggestedPhrasing: [
      "Rodzinne zobowiązania wymagały mojej obecności [daty]. Obecnie w pełnej dyspozycji.",
      "Opieka nad członkiem rodziny [daty]. Równolegle utrzymywałem kontakt z branżą [kursy/lektura].",
    ],
    interviewGuidance:
      "Jeśli pytają — jedno zdanie: 'opiekowałem się rodziną, teraz wracam do pracy zawodowej'. Nie wchodź w detale.",
  },

  relocation: {
    type: "relocation",
    label: "Przeprowadzka / relokacja",
    explanation:
      "Przeprowadzka (szczególnie zagraniczna) może wymagać przerwy na adaptację / legalizację.",
    suggestedPhrasing: [
      "Przeprowadzka z [miasto A] do [miasto B] — [daty]. Adaptacja + nauka języka [X].",
    ],
    interviewGuidance:
      "Pokaż że decyzja przeprowadzki była świadoma i stabilna — nie wygląda na 'uciekanie'.",
  },

  unknown: {
    type: "unknown",
    label: "Nieokreślona przerwa",
    explanation: "Brak info o typie — agent musi zapytać użytkownika.",
    suggestedPhrasing: [
      "[Zapytaj użytkownika co robił w tej przerwie i jak chciałby to pokazać.]",
    ],
    interviewGuidance: "Zapytaj użytkownika zanim zaproponujesz template.",
  },
};

/**
 * Wykrywa przerwy między stanowiskami dłuższe niż `minGapMonths`.
 * Domyślnie: 4+ miesiące (akceptujemy krótkie przerwy jako zmianę pracy).
 */
export function detectGaps(cv: CVData, minGapMonths = 4): CareerGap[] {
  if (cv.employment.length < 2) return [];

  // Sortuj chronologicznie: najwcześniejszy start najpierw
  const sorted = [...cv.employment]
    .filter((e) => e.startYear && Number.isFinite(parseInt(e.startYear, 10)))
    .sort((a, b) => {
      const aY = parseInt(a.startYear, 10);
      const bY = parseInt(b.startYear, 10);
      if (aY !== bY) return aY - bY;
      const aM = parseInt(a.startMonth || "1", 10);
      const bM = parseInt(b.startMonth || "1", 10);
      return aM - bM;
    });

  const gaps: CareerGap[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const prev = sorted[i];
    const next = sorted[i + 1];

    if (prev.current) continue; // Obecne stanowisko — brak końca

    const prevEndY = parseInt(prev.endYear, 10);
    const prevEndM = parseInt(prev.endMonth || "12", 10);
    const nextStartY = parseInt(next.startYear, 10);
    const nextStartM = parseInt(next.startMonth || "1", 10);

    if (!Number.isFinite(prevEndY) || !Number.isFinite(nextStartY)) continue;

    const gapMonths = (nextStartY - prevEndY) * 12 + (nextStartM - prevEndM);

    if (gapMonths >= minGapMonths) {
      gaps.push({
        startYear: prevEndY,
        startMonth: prevEndM,
        endYear: nextStartY,
        endMonth: nextStartM,
        durationMonths: gapMonths,
        afterEmploymentId: prev.id,
        beforeEmploymentId: next.id,
      });
    }
  }

  return gaps;
}

export function formatGapDuration(months: number): string {
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} lata ${rest} mies.` : `${years} lat`;
}
