export type IconName =
  | "Sparkle"
  | "Target"
  | "FileText"
  | "HandPointing"
  | "DownloadSimple"
  | "Cards"
  | "ShieldCheck"
  | "ClockCounterClockwise"
  | "Brain"
  | "MagicWand"
  | "Graph"
  | "Confetti";

export type BentoSize = "lg" | "tall" | "wide" | "sq";

export type BentoFeature = {
  id: string;
  size: BentoSize;
  eyebrow: string;
  title: string;
  body: string;
  icon: IconName;
  visual?: "diff" | "score" | "swap" | "export" | "inline" | "sources" | "templates" | "shield" | "history";
};

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
  caption: string;
};

export type TemplateItem = {
  id: "atlas" | "cobalt" | "orbit" | "terra" | "lumen";
  name: string;
  subtitle: string;
  tag: string;
  description: string;
  audience: string;
  colorSchemeId: "blue" | "teal" | "slate" | "orange" | "green" | "red" | "purple";
};

export type StatItem = {
  value: string;
  unit?: string;
  label: string;
  detail: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  featured?: boolean;
  /** URL to a real photo avatar (circle crop). If absent, initials are shown. */
  photoUrl?: string;
  /** Responsive grid span for the asymmetric layout. `sm` = 2 cols, `md` = 3 cols, `lg` = 4 cols on a 6-col grid. */
  span?: "sm" | "md" | "lg";
};

export type BrandIconKey =
  // Polish brands
  | "allegro"
  | "lidl"
  | "zabka"
  | "dhl"
  | "ikea"
  | "lot"
  | "cdprojekt"
  | "livechat"
  // Global brands with a real simple-icons SVG
  | "google"
  | "intel"
  | "samsung"
  | "sap"
  | "siemens"
  | "volkswagen"
  | "lufthansa"
  | "spotify"
  | "netflix"
  | "meta"
  | "bmw"
  | "toyota";

export type BrandMark = {
  name: string;
  color: string;
  iconKey: BrandIconKey;
};

export type IndustryCategory = {
  label: string;
  icon:
    | "Truck"
    | "ShoppingCart"
    | "Factory"
    | "ForkKnife"
    | "Wrench"
    | "Heart"
    | "Van"
    | "Code"
    | "Megaphone"
    | "Folder"
    | "Hammer"
    | "FirstAid";
};

export type PricingPlan = {
  id: "free" | "pro" | "unlimited";
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  popular?: boolean;
  features: string[];
  highlight?: string;
  /** Wariant podobizny Pracusia wyświetlany w karcie planu */
  pracusVariant: "ikona-1" | "ikona-2" | "podobizna";
  /** Opcjonalny wariant jednorazowy (Pro Pack w V2) */
  oneTime?: {
    price: string;
    cadence: string;
    label: string;
    note: string;
    href: string;
    cta: string;
  };
};

export type FaqItem = {
  q: string;
  a: string;
};

export const hero = {
  eyebrow: "Agent Pracuś online",
  headlineLines: ["Twój agent pisze", "CV, które dostaje", "rozmowy."],
  headlineHighlight: "rozmowy",
  lead:
    "Pracuś czyta ogłoszenia, układa słowa, dobiera szablon i eksportuje PDF. Ty dostajesz CV, na które recruiter odpowiada. Po polsku, pod ATS, zgodnie z RODO.",
  primaryCta: "Stwórz CV za darmo",
  ghostCta: "Zobacz jak działa",
  stats: [
    { label: "czas tworzenia", value: "~5 min" },
    { label: "szablony ATS", value: "5" },
    { label: "polskie branże", value: "26" },
    { label: "RODO-friendly", value: "✓" },
  ],
} as const;

/**
 * All marquee brand marks — every entry points to a real SVG icon from
 * `react-icons/si` (simple-icons, CC0 license). No stylized fallbacks.
 */
export const brandWordmarks: BrandMark[] = [
  // Polish employers + homegrown brands
  { name: "Allegro", color: "#FF5A00", iconKey: "allegro" },
  { name: "Lidl", color: "#0050AA", iconKey: "lidl" },
  { name: "Żabka", color: "#0A8537", iconKey: "zabka" },
  { name: "DHL", color: "#D40511", iconKey: "dhl" },
  { name: "IKEA", color: "#0051BA", iconKey: "ikea" },
  { name: "LOT", color: "#002A5C", iconKey: "lot" },
  { name: "CD Projekt", color: "#D42027", iconKey: "cdprojekt" },
  { name: "LiveChat", color: "#FF5100", iconKey: "livechat" },
  // Major global employers relevant to Polish job market
  { name: "Google", color: "#4285F4", iconKey: "google" },
  { name: "Intel", color: "#0071C5", iconKey: "intel" },
  { name: "Samsung", color: "#1428A0", iconKey: "samsung" },
  { name: "SAP", color: "#0FAAFF", iconKey: "sap" },
  { name: "Siemens", color: "#009999", iconKey: "siemens" },
  { name: "Volkswagen", color: "#151F5D", iconKey: "volkswagen" },
  { name: "Lufthansa", color: "#05164D", iconKey: "lufthansa" },
  { name: "Spotify", color: "#1DB954", iconKey: "spotify" },
  { name: "Netflix", color: "#E50914", iconKey: "netflix" },
  { name: "Meta", color: "#0866FF", iconKey: "meta" },
  { name: "BMW", color: "#1C69D4", iconKey: "bmw" },
  { name: "Toyota", color: "#EB0A1E", iconKey: "toyota" },
];

export const professionTokens = [
  "Magazynier",
  "Kasjer",
  "Spawacz",
  "Mechanik",
  "Kierowca C+E",
  "Operator CNC",
  "Elektryk",
  "Hydraulik",
  "Sprzedawca",
  "Fryzjer",
  "Kucharz",
  "Kelner",
  "Recepcjonistka",
  "Opiekun medyczny",
  "Kurier",
  "Pracownik produkcji",
  "Monter",
  "Tokarz",
  "Senior Developer",
  "Product Manager",
  "UX Designer",
  "HR Business Partner",
  "Księgowa",
  "Marketing Lead",
];

export const industryCategories: IndustryCategory[] = [
  { label: "Logistyka", icon: "Truck" },
  { label: "Handel", icon: "ShoppingCart" },
  { label: "Produkcja", icon: "Factory" },
  { label: "Gastronomia", icon: "ForkKnife" },
  { label: "Budowlanka", icon: "Hammer" },
  { label: "Opieka", icon: "FirstAid" },
  { label: "Transport", icon: "Van" },
  { label: "IT & Tech", icon: "Code" },
  { label: "Marketing", icon: "Megaphone" },
  { label: "Administracja", icon: "Folder" },
];

export const bentoFeatures: BentoFeature[] = [
  {
    id: "match",
    size: "lg",
    eyebrow: "01 / Dopasowanie",
    title: "Czyta ogłoszenie i wskazuje braki",
    body: "Wklej link z Pracuj, LinkedIn czy OLX. Agent pokazuje, czego brakuje i co przeformułować.",
    icon: "Target",
    visual: "diff",
  },
  {
    id: "ats",
    size: "tall",
    eyebrow: "02 / ATS na żywo",
    title: "Score 0–100, liczy się na Twoich oczach",
    body: "Cztery wymiary, każda edycja aktualizuje liczbę.",
    icon: "Brain",
    visual: "score",
  },
  {
    id: "proposals",
    size: "sq",
    eyebrow: "03 / Asystent",
    title: "Zastosuj albo Odrzuć",
    body: "Decydujesz Ty. Zawsze.",
    icon: "HandPointing",
    visual: "swap",
  },
  {
    id: "export",
    size: "sq",
    eyebrow: "04 / Eksport",
    title: "PDF + DOCX",
    body: "PDF do rekrutera, DOCX pod portale.",
    icon: "DownloadSimple",
    visual: "export",
  },
  {
    id: "editor",
    size: "wide",
    eyebrow: "05 / Wiedza rekrutera",
    title: "Baza 15 lat polskiej rekrutacji",
    body:
      "Pracuś uczy się z realnych źródeł HR — ESCO, PRK/ZSK, Barometr Zawodów 2026, BKL PARP, O*NET, KZiS. 26 polskich branż z uprawnieniami UDT, SEP, ADR, HACCP. Zero generycznych templatek.",
    icon: "Brain",
    visual: "sources",
  },
  {
    id: "templates",
    size: "wide",
    eyebrow: "06 / Szablony",
    title: "Pięć szablonów pod ATS",
    body: "Orbit, Atlas, Terra, Cobalt, Lumen. Zmieniasz jednym kliknięciem.",
    icon: "Cards",
    visual: "templates",
  },
  {
    id: "rodo",
    size: "wide",
    eyebrow: "07 / RODO + login",
    title: "Google/Facebook, RODO auto",
    body: "OAuth bez hasła. Minimum danych. Klauzula wstawiana sama.",
    icon: "ShieldCheck",
    visual: "shield",
  },
  {
    id: "history",
    size: "wide",
    eyebrow: "08 / Wersje",
    title: "Jedno CV, wiele wariantów",
    body: "Różne akcenty pod różne oferty. Historia jednym kliknięciem.",
    icon: "ClockCounterClockwise",
    visual: "history",
  },
];

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Zaloguj się i powiedz Pracusiowi, kim jesteś",
    body:
      "Jedno kliknięcie: logowanie Google albo Facebook. Dostajesz własne konto z historią wszystkich CV. Przechodzisz przez sekcje: doświadczenie, wykształcenie, umiejętności, uprawnienia, języki, projekty.",
    caption: "~5 minut",
  },
  {
    index: "02",
    title: "Pracuś pokazuje, co zmienić",
    body:
      "Wklejasz link albo tekst ogłoszenia (opcjonalnie). Agent proponuje konkretne zmiany w kartach — klikasz Zastosuj albo Odrzuć. Wskaźnik ATS zmienia się na żywo, widzisz efekt każdej poprawki.",
    caption: "tyle, ile potrzebujesz",
  },
  {
    index: "03",
    title: "Pobierasz PDF albo DOCX",
    body:
      "Wybierasz jeden z pięciu szablonów testowanych pod ATS, ustawiasz czcionkę i akcent, eksportujesz. PDF do wysłania rekruterowi, DOCX do portali, które żądają Worda. Bez znaków wodnych i prób.",
    caption: "instant",
  },
];

export const templates: TemplateItem[] = [
  {
    id: "atlas",
    name: "Atlas",
    subtitle: "Navy + niebieski akcent, ikony kontaktu",
    tag: "Szablon · Atlas",
    description:
      "Granat z niebieskim akcentem, ikony przy danych kontaktowych, sekcje full-width. Czytelny pod ATS, eleganckie nagłówki, klasyczny układ z mocnym charakterem.",
    audience: "Manager · Sales · Finance · HR · Konsultant",
    colorSchemeId: "blue",
  },
  {
    id: "cobalt",
    name: "Cobalt",
    subtitle: "Navy na cream + sidebar + organic blobs",
    tag: "Szablon · Cobalt",
    description:
      "Navy headings na ciepłym cream, sidebar z kontaktem i linkami, dekoracyjne pastelowe kształty w rogach. CV które się wyróżnia bez ryzyka.",
    audience: "Designer · Product · Marketing · Creative",
    colorSchemeId: "slate",
  },
  {
    id: "orbit",
    name: "Orbit",
    subtitle: "Klasyczny 2-kolumnowy minimal",
    tag: "Szablon · Orbit",
    description:
      "Czysty monochromatyczny układ 2-kolumnowy. Profil + edukacja + umiejętności po lewej, doświadczenie po prawej. Maksymalna czytelność dla ATS.",
    audience: "Każda branża · Świetny dla seniorów · Bezpieczny wybór",
    colorSchemeId: "slate",
  },
];

export const stats: StatItem[] = [
  {
    value: "26",
    label: "polskich branż w bazie wiedzy Pracusia",
    detail:
      "Od magazynu, produkcji i transportu przez handel, gastronomię i usługi aż po IT, finanse, HR, design i sektor publiczny. Agent zna realia każdej z nich — uprawnienia UDT i SEP, ADR, HACCP, PRK/ZSK, polskie certyfikaty, słownik ATS.",
  },
  {
    value: "5",
    label: "szablonów pisanych pod parsery ATS",
    detail:
      "Orbit, Atlas, Terra, Cobalt, Lumen — semantyczne nagłówki i hierarchia, zero grafiki dezorientującej algorytmy rekrutacyjne typu Workday, Greenhouse czy eRecruiter.",
  },
  {
    value: "1",
    unit: "strona",
    label: "A4 z automatycznym dopasowaniem czcionki",
    detail:
      "Dopisujesz kolejne doświadczenie — kreator sam zmniejsza tekst (krok 0,25pt, min 8pt), żeby wszystko zmieściło się na jednej stronie. Koniec z walką z marginesami i enterami.",
  },
  {
    value: "4",
    label: "wymiary analizy ATS w czasie rzeczywistym",
    detail:
      "Kompletność sekcji, gęstość słów kluczowych branży, czytelność opisów i dopasowanie do jednej strony A4. Każdy wymiar z konkretnymi punktami do poprawy, score 0–100 aktualizowany na żywo przy każdej edycji.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Szczerze mówiąc — nigdy nie pisałem CV. Wcześniej szefowie dzwonili: „przyjdź jutro”. Tym razem portal wymagał PDF-a, kumpel wrzucił linka do agentcv. Siadłem wieczorem, Pracuś pokazywał karty z propozycjami — coś klikałem Zastosuj, coś Odrzuć. Wyszło CV, którego sam bym nie ułożył.",
    name: "Tomasz K.",
    role: "Magazynier",
    company: "Duża sieć e-commerce spod Poznania",
    featured: true,
    photoUrl: "https://i.pravatar.cc/96?img=12",
  },
  // 6-col grid, dense flow — każdy rząd wypełnia się co do kolumny: sm(2)+lg(4) lub md(3)+md(3)
  // Row 1: sm + lg
  {
    quote:
      "Wkleiłem link do ogłoszenia, Pracuś wyciągnął z niego maszynę i wymagania, przepisał moje opisy. Wskaźnik ATS w kreatorze podskoczył — widać było na żywo, że dodane słowa kluczowe robią robotę.",
    name: "Paweł M.",
    role: "Operator CNC",
    company: "Zakład produkcyjny",
    span: "sm",
  },
  {
    quote:
      "15 lat spawania, a moje CV to była kartka z listą firm i dat. Pracuś sam zaczął dopytywać o MIG/MAG, TIG, ISO 9606, konkretne materiały. Dla mnie oczywistości — okazuje się, że to są dokładnie słowa, na które parsery ATS polują.",
    name: "Krzysztof R.",
    role: "Spawacz",
    company: "Producent taboru szynowego",
    span: "lg",
    photoUrl: "https://i.pravatar.cc/96?img=59",
  },
  // Row 2: sm + lg
  {
    quote:
      "Zmieniłam szablon z Orbit na Cobalt, wrzuciłam link do ogłoszenia, Pracuś dopasował słownictwo pod branżę. Rekruterka na rozmowie powiedziała „widać, że ktoś wie, co robi” — a ja tylko klikałam Zastosuj.",
    name: "Kasia L.",
    role: "Product Manager",
    company: "Platforma e-commerce",
    span: "sm",
    photoUrl: "https://i.pravatar.cc/96?img=25",
  },
  {
    quote:
      "W CV miałem jedno zdanie: „naprawiałem samochody”. Pracuś dopytał o szczegóły i wyciągnął ze mnie hybrydy, elektryki, diagnostykę OBD, skrzynie DSG, klimatyzacje R1234yf — rzeczy, które w warsztacie robię codziennie. Szef w nowym serwisie powiedział, że od razu widać fachowca.",
    name: "Bartek S.",
    role: "Mechanik samochodowy",
    company: "Serwis wielomarkowy",
    span: "lg",
    photoUrl: "https://i.pravatar.cc/96?img=53",
  },
  // Row 3: md + md
  {
    quote:
      "Kliknęłam „Napisz mi podsumowanie”. Pracuś napisał cztery zdania, z których zrozumiałam, że obsługa 200 klientów dziennie to nie „praca w kasie”, tylko konkretne kompetencje — organizacja, odporność na stres, zarządzanie zwrotami. Aplikowałam o zmianę stanowiska i się udało.",
    name: "Anna W.",
    role: "Kasjerka → Kierowniczka zmiany",
    company: "Sieć dyskontów",
    span: "md",
    photoUrl: "https://i.pravatar.cc/96?img=45",
  },
  {
    quote:
      "Wkleiłem link z portalu transportowego. Agent pokazał, że muszę dopisać ADR, tachograf i trasy międzynarodowe — a ja to robię od dekady, tylko wcześniej nie wpadłem, że trzeba to wprost wymienić. Score ATS z czerwonego zrobił się zielony.",
    name: "Mariusz D.",
    role: "Kierowca C+E",
    company: "Firma transportowa",
    span: "md",
  },
  // Row 4: md + md
  {
    quote:
      "Pivot z marketingu do UX, więc moje CV wyglądało jak patchwork. Pracuś przeformułował projekty w języku discovery i user research, zasugerował też które umiejętności podkreślić. Zastosuj, Zastosuj, Odrzuć — wyszło spójnie.",
    name: "Zuza R.",
    role: "Junior UX Designer",
    company: "Software house",
    span: "md",
  },
  {
    quote:
      "HACCP, menu sezonowe, food cost, praca na zmianach 12h w pełnej karcie. Pracuś wyłuskał to z paru zdań, które mu wrzuciłem, i uporządkował — tak żeby rekruter widział od razu, co umiem przy kuchni.",
    name: "Michał J.",
    role: "Kucharz",
    company: "Restauracja hotelowa",
    span: "md",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0 zł",
    cadence: "na zawsze",
    tagline: "Kreator w akcji. Pracuś AI zaczyna się od Pro.",
    cta: "Zacznij za darmo",
    ctaHref: "/kreator",
    pracusVariant: "ikona-1",
    features: [
      "1 pobranie CV (PDF lub DOCX)",
      "5 szablonów pod ATS",
      "Edytor z autosave",
      "Logowanie Google / Facebook",
      "Podstawowe słowa ATS",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "19 zł",
    cadence: "miesięcznie",
    tagline: "Pełny Pracuś AI dla aktywnie szukających.",
    cta: "Wybierz Pro",
    ctaHref: "/checkout?plan=pro&mode=sub",
    popular: true,
    highlight: "Najczęściej wybierany",
    pracusVariant: "ikona-2",
    features: [
      "10 pobrań CV miesięcznie",
      "Pełny Pracuś AI — chat + propozycje",
      "Dopasowanie CV do ogłoszenia",
      "Live ATS score z 4 wymiarami",
      "Historia wersji i wariacje",
      "Wszystkie 5 szablonów",
      "Priorytet generowania agenta",
    ],
    oneTime: {
      price: "19 zł",
      cadence: "jednorazowo",
      label: "Pro Pack",
      note: "10 pobrań · kredyty nie wygasają",
      href: "/checkout?plan=pro&mode=pack",
      cta: "Kup Pro Pack",
    },
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "39 zł",
    cadence: "miesięcznie",
    tagline: "Wszystko z Pro — bez limitu pobrań.",
    cta: "Wybierz Unlimited",
    ctaHref: "/checkout?plan=unlimited&mode=sub",
    highlight: "Dla recruiterów i coachów",
    pracusVariant: "podobizna",
    features: [
      "Bez limitu pobrań CV",
      "Priority agent — szybsze AI",
      "Wczesny dostęp do nowości",
      "Dedykowane wsparcie < 12h",
      "Faktury VAT dla firm",
      "Beta features AI",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    q: "Co to jest ATS i dlaczego ma znaczenie?",
    a: "ATS (Applicant Tracking System) to oprogramowanie, przez które przechodzi Twoje CV, zanim zobaczy je rekruter. Jeśli parser źle odczyta sekcje albo nie znajdzie słów kluczowych z ogłoszenia — CV nie trafia dalej. Pracuś pisze pod parsery: semantyczne nagłówki, czysta hierarchia sekcji, słowa kluczowe osadzone naturalnie w doświadczeniu.",
  },
  {
    q: "Czy moje CV będzie działać w parserach ATS?",
    a: "Wszystkie 5 szablonów (Orbit, Atlas, Terra, Cobalt, Lumen) testujemy w czterech parserach: Workday, Greenhouse, Lever i polskim eRecruiter. Zero grafiki dezorientującej algorytmy, żadnych kolumn, które rozjeżdżają opisy w OCR. Eksport PDF i DOCX — oba w wersji ATS-friendly.",
  },
  {
    q: "Jak się loguję? Muszę zakładać konto?",
    a: "Logujesz się jednym kliknięciem przez Google albo Facebook — bez nowego hasła do pamiętania, bez weryfikacji mailowej. Zabieramy tylko niezbędne minimum: adres e-mail i nazwę z Twojego profilu. Konto daje Ci dostęp do historii wszystkich CV i synchronizację między urządzeniami.",
  },
  {
    q: "Co dzieje się z moimi danymi? Jak to wygląda pod RODO?",
    a: "Twoje CV i dane konta żyją w szyfrowanym magazynie w UE. Nie sprzedajemy danych, nie budujemy profili marketingowych, nie wysyłamy ich do trzecich stron. Klauzulę RODO (standardową, przyszłościową albo obie) wybierasz z listy i wstawia się automatycznie na końcu CV. Konto i wszystkie CV usuwasz sam z poziomu ustawień — bez pisania do supportu, bez okresu oczekiwania.",
  },
  {
    q: "Czy Pracuś pisze za mnie całe CV?",
    a: "Nie — pisze razem z Tobą. Ty podajesz fakty (stanowisko, projekty, uprawnienia), agent przekształca je w język, który trafia do rekruterów i przechodzi przez parsery. Każdą propozycję widzisz jako kartę „Zastosuj / Odrzuć” — decyzja zawsze należy do Ciebie. To asystent, nie autopilot.",
  },
  {
    q: "Jak działa dopasowanie do ogłoszenia?",
    a: "Wklejasz link z Pracuj.pl, NoFluffJobs, JustJoin, LinkedIn, OLX albo sam tekst ogłoszenia. Agent wyciąga z niego wymagania (kompetencje twarde, miękkie, technologie, framework branżowy) i porównuje z Twoim CV. Mówi: które umiejętności podkreślić, których słów kluczowych brakuje, jak przeformułować opisy. Wskaźnik ATS (0–100, cztery wymiary) aktualizuje się na żywo przy każdej zmianie.",
  },
  {
    q: "Czym różnią się plany Free, Pro i Unlimited?",
    a: "Free (0 zł, na zawsze): 1 pobranie CV, edytor, 5 szablonów — bez asystenta Pracuś AI. Pro (19 zł miesięcznie): 10 pobrań CV, pełny Pracuś (chat, propozycje, dopasowanie do ogłoszeń, live ATS score, historia wersji). Unlimited (39 zł miesięcznie): wszystko z Pro plus bez limitu pobrań, priority agent, faktury VAT dla firm. Rezygnacja jednym klikiem — od razu, bez okresu wypowiedzenia.",
  },
  {
    q: "Czym różni się Pro Pack od Pro miesięcznie?",
    a: "Cena ta sama — 19 zł. Różnica w sposobie płatności. Pro miesięcznie: płacisz 19 zł co miesiąc, 10 pobrań w każdym miesiącu, subskrypcja odnawia się automatycznie, rezygnujesz kiedy chcesz. Pro Pack: płacisz 19 zł raz, dostajesz 10 pobrań, bez odnowień, kredyty nie wygasają — wykorzystasz je kiedy będziesz potrzebować. Wybierasz w zależności od stylu pracy: aktywnie szukasz → subskrypcja, sporadycznie aktualizujesz CV → pack.",
  },
  {
    q: "Skąd Pracuś zna polskie branże i uprawnienia?",
    a: "Baza wiedzy Pracusia jest zbudowana na realnych źródłach HR: ESCO (UE), PRK/ZSK (Polska Rama Kwalifikacji, 8 poziomów), Barometr Zawodów 2026 (MRPiPS), BKL PARP (Bilans Kapitału Ludzkiego), O*NET, KZiS. 26 polskich branż — od magazyniera i operatora CNC przez transport, gastronomię i IT po HR, design i sektor publiczny — z uprawnieniami UDT, SEP, ADR, HACCP, PRK.",
  },
  {
    q: "Aplikuję na różne oferty. Jak działa historia wersji?",
    a: "Jedno konto, jedno CV bazowe, dowolnie wiele wariantów. Pod każdą ofertę zmieniasz akcent (słowa kluczowe, kolejność sekcji, profil) — poprzednia wersja zostaje w historii. Wracasz do niej jednym klikiem, gdy aplikujesz gdzie indziej. Koniec z plikami typu CV_v3_final_OK.docx i mailami do siebie z wersjami roboczymi.",
  },
  {
    q: "Nigdy nie pisałem CV. Czy Pracuś pomoże mi od zera?",
    a: "Tak — po to istnieje. Edytor prowadzi Cię przez każdą sekcję krok po kroku: doświadczenie, wykształcenie, umiejętności, uprawnienia, języki, projekty. Pracuś podpowiada kontekstowo: klikasz „Napisz mi podsumowanie” i dostajesz cztery zdania, których sam byś nie ułożył. Dla zawodów fizycznych (magazynier, spawacz, kierowca C+E, mechanik, operator CNC) agent zna uprawnienia branżowe i wyciąga je nawet z krótkich opisów.",
  },
];

export const finalCta = {
  eyebrow: "Ostatnia rzecz",
  title: "Agent czeka.",
  subtitle: "Zostaw stare CV. Pracuś napisze nowe — w 5 minut, bez karty.",
  primary: "Stwórz CV teraz",
  primaryHref: "/kreator",
  micro: "Darmowe pierwsze CV · RODO ✓ · Bez karty",
} as const;

export const footerGroups = {
  product: {
    label: "Produkt",
    links: [
      { label: "Kreator CV", href: "/kreator" },
      { label: "Szablony CV", href: "/szablony" },
      { label: "Wzory CV", href: "/wzor-cv" },
      { label: "Cennik", href: "/#cennik" },
      { label: "Dla firm", href: "/dla-firm" },
    ],
  },
  resources: {
    label: "Poradniki",
    links: [
      { label: "Jak napisać CV", href: "/poradniki/jak-napisac-cv" },
      { label: "Co to jest ATS", href: "/poradniki/co-to-jest-ats" },
      { label: "List motywacyjny", href: "/poradniki/list-motywacyjny" },
      { label: "Rozmowa kwalifikacyjna", href: "/poradniki/jak-przygotowac-sie-do-rozmowy" },
      { label: "LinkedIn — optymalizacja", href: "/poradniki/linkedin-optymalizacja" },
      { label: "Wszystkie poradniki", href: "/poradniki" },
    ],
  },
  industries: {
    label: "Branże",
    links: [
      { label: "CV programisty", href: "/poradniki/cv-programisty" },
      { label: "CV mechanika", href: "/poradniki/cv-mechanika" },
      { label: "CV księgowej", href: "/poradniki/cv-ksiegowej" },
      { label: "CV sprzedawcy", href: "/poradniki/cv-sprzedawcy" },
      { label: "CV operatora CNC", href: "/poradniki/cv-operatora-cnc" },
      { label: "Więcej branż", href: "/poradniki" },
    ],
  },
  company: {
    label: "Firma",
    links: [
      { label: "O nas", href: "/o-nas" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  legal: {
    label: "Prawne",
    links: [
      { label: "Regulamin", href: "/regulamin" },
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
      { label: "RODO", href: "/polityka-prywatnosci#rodo" },
    ],
  },
} as const;
