import type { RodoType } from "./schema";

export const RODO_STANDARD =
  "Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).";

const RODO_FUTURE_TEMPLATE =
  "Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w moim CV również na potrzeby przyszłych procesów rekrutacyjnych prowadzonych przez {company}, zgodnie z art. 6 ust. 1 lit. a RODO.";

export function buildRodoText(type: RodoType, companyName = ""): string {
  const company = companyName.trim() || "pracodawcy";
  const future = RODO_FUTURE_TEMPLATE.replace("{company}", company);
  switch (type) {
    case "none":
      return "";
    case "standard":
      return RODO_STANDARD;
    case "future":
      return future;
    case "both":
      return `${RODO_STANDARD} ${future}`;
    default:
      return "";
  }
}

export const RODO_OPTIONS: Array<{
  value: RodoType;
  label: string;
  pillLabel: string;
  hint: string;
}> = [
  {
    value: "none",
    label: "Bez klauzuli",
    pillLabel: "Brak",
    hint: "Nie dodawaj klauzuli RODO (nie polecamy dla polskich rekruterów).",
  },
  {
    value: "standard",
    label: "Standardowa",
    pillLabel: "Standard",
    hint: "Podstawowa klauzula zgody na przetwarzanie danych w procesie rekrutacji.",
  },
  {
    value: "future",
    label: "Przyszłe rekrutacje",
    pillLabel: "Przyszłe",
    hint: "Zgoda na wykorzystanie CV w przyszłych procesach rekrutacyjnych.",
  },
  {
    value: "both",
    label: "Standardowa + przyszłe",
    pillLabel: "Std + Przyszłe",
    hint: "Obie klauzule razem — najszerszy zakres.",
  },
];
