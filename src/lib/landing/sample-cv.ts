import type { CVData } from "@/types/cv";

/**
 * Sample CV used by the landing-page TemplatesShowcase.
 * Persona: Tomasz Kowalski — universal blue-collar-friendly profile
 * that also reads well when rendered in serif/editorial templates.
 * Content intentionally mixes technical skills + certifications
 * so the three preview templates (Klasyczny / Kreatywny / Studyjny)
 * all showcase realistic kreator output.
 */
export const SAMPLE_CV: CVData = {
  personalInfo: {
    firstName: "Tomasz",
    lastName: "Kowalski",
    email: "tomasz.kowalski@agentcv.pl",
    phone: "+48 512 345 678",
    city: "Poznań",
    linkedIn: "linkedin.com/in/tomasz-kowalski",
    website: "",
    photo: "",
  },
  summary:
    "Doświadczony magazynier z uprawnieniami na wózki widłowe (UDT) i 6-letnim stażem w logistyce e-commerce. Obsługiwałem operacje 24/7 w magazynach wysokiego składowania, wdrażałem procedury bezpieczeństwa BHP, koordynowałem zespół 8 osób na zmianie. Szukam pracy, w której mogę dalej rozwijać kompetencje lidera zespołu.",
  experience: [
    {
      id: "exp-1",
      company: "Amazon Poznań FC",
      position: "Starszy magazynier / Team Leader",
      startDate: "2022-03",
      endDate: "",
      isCurrent: true,
      bullets: [
        {
          id: "b1",
          text: "Koordynuję pracę zespołu 8 osób na zmianie nocnej, odpowiadam za KPI wydajności (pick rate, accuracy).",
        },
        {
          id: "b2",
          text: "Wdrożyłem procedurę kontroli jakości, która obniżyła liczbę błędnych wysyłek o 32% w ciągu 6 miesięcy.",
        },
        {
          id: "b3",
          text: "Obsługa systemu WMS (SAP EWM), przygotowanie dokumentacji spedycyjnej CMR.",
        },
        {
          id: "b4",
          text: "Szkolenia BHP dla nowych pracowników — przeszkoliłem 24 osoby w 2024 roku.",
        },
      ],
    },
    {
      id: "exp-2",
      company: "InPost Logistics",
      position: "Magazynier",
      startDate: "2019-06",
      endDate: "2022-02",
      isCurrent: false,
      bullets: [
        {
          id: "b5",
          text: "Przyjmowanie i kompletacja zamówień na podstawie dokumentów WZ/PZ.",
        },
        {
          id: "b6",
          text: "Obsługa wózka widłowego czołowego i bocznego (uprawnienia UDT).",
        },
        {
          id: "b7",
          text: "Udział w inwentaryzacjach rocznych, średnia dokładność >99,5%.",
        },
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "Zespół Szkół Zawodowych nr 2 w Poznaniu",
      degree: "Technik logistyk",
      field: "Logistyka i spedycja",
      startDate: "2015-09",
      endDate: "2019-05",
      isCurrent: false,
      description:
        "Praktyki zawodowe w firmie kurierskiej. Praca dyplomowa: optymalizacja procesów kompletacji w magazynie wysokiego składowania.",
    },
  ],
  skills: [
    "Obsługa wózków widłowych (UDT)",
    "System WMS / SAP EWM",
    "Zarządzanie zespołem",
    "BHP i procedury bezpieczeństwa",
    "Dokumentacja CMR / WZ / PZ",
    "Inwentaryzacja",
    "Obsługa skanerów kodów kreskowych",
    "MS Excel (poziom średniozaawansowany)",
  ],
  languages: [
    { id: "l1", name: "Polski", level: "native" },
    { id: "l2", name: "Angielski", level: "B1" },
  ],
  projects: [
    {
      id: "p1",
      name: "Optymalizacja procesu kompletacji",
      description:
        "Zmiana układu stref kompletacji zwiększyła wydajność zespołu o 18% bez dodatkowego zatrudnienia.",
      url: "",
      technologies: ["Lean", "WMS", "Kaizen"],
    },
  ],
  rodoClause: "standard",
  rodoCompanyName: "",
};
