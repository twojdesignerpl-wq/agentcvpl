import type { CVData } from "@/lib/cv/schema";

/**
 * Sample CV used by the landing-page TemplatesShowcase.
 * Persona: Tomasz Kowalski — universal blue-collar-friendly profile
 * that reads well in serif/editorial templates and ATS-friendly variants.
 */
export const SAMPLE_CV: CVData = {
  personal: {
    firstName: "Tomasz",
    lastName: "Kowalski",
    role: "Magazynier / Team Leader",
    photo: "",
    address: "Poznań",
    email: "tomasz.kowalski@agentcv.pl",
    website: "linkedin.com/in/tomasz-kowalski",
    phone: "+48 512 345 678",
  },
  profile:
    "Doświadczony magazynier z uprawnieniami na wózki widłowe (UDT) i 6-letnim stażem w logistyce e-commerce. Obsługiwałem operacje 24/7 w magazynach wysokiego składowania, wdrażałem procedury BHP, koordynowałem zespół 8 osób na zmianie. Szukam pracy, w której mogę dalej rozwijać kompetencje lidera zespołu.",
  education: [
    {
      id: "edu-1",
      school: "Zespół Szkół Zawodowych nr 2 w Poznaniu",
      degree: "Technik logistyk",
      location: "Poznań",
      startYear: "2015",
      startMonth: "09",
      endYear: "2019",
      endMonth: "05",
      current: false,
    },
  ],
  skills: {
    professional: [
      "Obsługa wózków widłowych (UDT)",
      "System WMS / SAP EWM",
      "Dokumentacja CMR / WZ / PZ",
      "Inwentaryzacja",
      "Obsługa skanerów kodów kreskowych",
      "MS Excel (średniozaawansowany)",
    ],
    personal: [
      "Zarządzanie zespołem",
      "Komunikacja w pracy zmianowej",
      "Odpowiedzialność za KPI",
    ],
  },
  employment: [
    {
      id: "exp-1",
      position: "Starszy magazynier / Team Leader",
      company: "Amazon Poznań FC",
      location: "Poznań",
      startYear: "2022",
      startMonth: "03",
      endYear: "",
      endMonth: "",
      current: true,
      description:
        "• Koordynuję pracę zespołu 8 osób na zmianie nocnej, odpowiadam za KPI wydajności (pick rate, accuracy).\n• Wdrożyłem procedurę kontroli jakości, która obniżyła liczbę błędnych wysyłek o 32% w ciągu 6 miesięcy.\n• Obsługa systemu WMS (SAP EWM), przygotowanie dokumentacji spedycyjnej CMR.\n• Szkolenia BHP dla nowych pracowników — przeszkoliłem 24 osoby w 2024 roku.",
    },
    {
      id: "exp-2",
      position: "Magazynier",
      company: "InPost Logistics",
      location: "Poznań",
      startYear: "2019",
      startMonth: "06",
      endYear: "2022",
      endMonth: "02",
      current: false,
      description:
        "• Przyjmowanie i kompletacja zamówień na podstawie dokumentów WZ/PZ.\n• Obsługa wózka widłowego czołowego i bocznego (uprawnienia UDT).\n• Udział w inwentaryzacjach rocznych, średnia dokładność >99,5%.",
    },
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
        "Zmiana układu stref kompletacji zwiększyła wydajność zespołu o 18% bez dodatkowego zatrudnienia. Zastosowane metody: Lean, Kaizen, WMS.",
      url: "",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Uprawnienia UDT — wózki widłowe (czołowe, boczne)",
      issuer: "Urząd Dozoru Technicznego",
      year: "2019",
      month: "07",
      credentialId: "",
      url: "",
    },
  ],
  volunteer: [],
  publications: [],
  awards: [],
  conferences: [],
  hobbies: [],
  references: [],
  customSections: [],
  rodo: {
    type: "standard",
    companyName: "",
  },
  settings: {
    templateId: "orbit",
    fontFamily: "manrope",
    fontSize: 10,
    photoShape: "circle",
    showProfile: true,
    showEducation: true,
    showEmployment: true,
    showSkills: true,
    showLanguages: true,
    showProjects: true,
    showCertifications: true,
    showVolunteer: false,
    showPublications: false,
    showAwards: false,
    showConferences: false,
    showHobbies: false,
    showReferences: false,
    showLinks: true,
    hiddenContactFields: [],
  },
};
