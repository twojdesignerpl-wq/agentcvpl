/**
 * Tool definitions dla `/api/chat` — agent Pracuś może proponować konkretne
 * zmiany w CV. Każda propozycja staje się tool-call w UIMessage, na kliencie
 * renderowana jako karta Zastosuj/Odrzuć. Serwer nie ma `execute` — klient
 * wywołuje odpowiednie akcje `useCVStore` + `addToolResult`.
 */

import { tool } from "ai";
import { z } from "zod";
import {
  languageLevelSchema,
  photoShapeSchema,
  rodoTypeSchema,
  templateIdSchema,
  contactFieldSchema,
  fontFamilySchema,
} from "@/lib/cv/schema";

const SECTION_TOGGLE = z.enum([
  "profile",
  "education",
  "employment",
  "skills",
  "languages",
  "projects",
  "certifications",
  "volunteer",
  "publications",
  "awards",
  "conferences",
  "hobbies",
  "references",
  "links",
]);

export type SectionToggleKey = z.infer<typeof SECTION_TOGGLE>;

// ────────────────────────────────────────────────────────────────────────────
// Tool outputs = typowany shape po "apply" (klient wysyła do modelu jako rezultat)
// ────────────────────────────────────────────────────────────────────────────
export interface ToolResult {
  status: "applied" | "rejected";
  note?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Tools
// ────────────────────────────────────────────────────────────────────────────

export const pracusTools = {
  proposeUpdateProfile: tool({
    description:
      "Proponuje nową treść podsumowania zawodowego (sekcja 'Profil' w CV). Użyj gdy użytkownik prosi o poprawę/napisanie profilu, albo gdy obecny profil jest pusty/słaby. Tekst musi być w 1. osobie, 3-4 zdania, z mierzalnymi osiągnięciami. Po polsku, bez żargonu.",
    inputSchema: z.object({
      text: z
        .string()
        .min(10)
        .max(800)
        .describe("Nowa treść profilu zawodowego — 3-4 zdania, 1. osoba, konkretne osiągnięcia."),
      reasoning: z
        .string()
        .max(300)
        .describe("Krótkie uzasadnienie co zmieniłeś i dlaczego (max 2 zdania)."),
    }),
  }),

  proposeUpdateEmploymentDescription: tool({
    description:
      "Proponuje poprawiony opis konkretnego stanowiska pracy (pole 'description' w employment). Użyj gdy user prosi o poprawę opisu lub gdy opis zawiera zabronione frazy typu 'odpowiedzialny za'. Tekst ma bullet-points (każdy zaczyna silnym czasownikiem + mierzalny efekt).",
    inputSchema: z.object({
      employmentId: z
        .string()
        .min(1)
        .describe(
          "ID stanowiska z CV (format 'emp-xxxxxx'). ID są pokazane w kontekście CV przy każdym employment.",
        ),
      description: z
        .string()
        .min(20)
        .max(1200)
        .describe(
          "Nowy opis stanowiska. Bulletpoints (każdy nowa linia zaczynająca '- ' lub '• '). Silne czasowniki, liczby, narzędzia po nazwie.",
        ),
      reasoning: z.string().max(300).describe("Co poprawiłeś vs obecnej wersji."),
    }),
  }),

  proposeAddEmployment: tool({
    description:
      "Proponuje dodanie nowego stanowiska pracy. Użyj gdy użytkownik opisuje pracę, której nie ma jeszcze w CV (np. 'byłem przez 2 lata na stażu w X'). Wypełnij wszystkie podane pola; brakujące zostaw puste, agent dopyta.",
    inputSchema: z.object({
      position: z.string().min(1).max(120),
      company: z.string().min(1).max(120),
      location: z.string().max(120).default(""),
      startYear: z.string().regex(/^\d{4}$|^$/, "Rok 4-cyfrowy lub puste"),
      startMonth: z.string().regex(/^\d{2}$|^$/, "Miesiąc 2-cyfrowy lub puste").default(""),
      endYear: z.string().regex(/^\d{4}$|^$/).default(""),
      endMonth: z.string().regex(/^\d{2}$|^$/).default(""),
      current: z.boolean().default(false).describe("True jeśli to obecne miejsce pracy."),
      description: z.string().max(1200).default(""),
      reasoning: z.string().max(300),
    }),
  }),

  proposeAddSkills: tool({
    description:
      "Proponuje dodanie umiejętności do CV. Dwie grupy: 'professional' (twarde: narzędzia, systemy, metodyki) lub 'personal' (miękkie: negocjacje, praca pod presją, mentoring). Dodawaj konkretne z nazwą (np. 'SAP EWM' nie 'systemy ERP'). Max 5 naraz.",
    inputSchema: z.object({
      group: z.enum(["professional", "personal"]),
      skills: z
        .array(z.string().min(2).max(80))
        .min(1)
        .max(5)
        .describe("Lista 1-5 umiejętności. Każda konkretna, z nazwą narzędzia/metody."),
      reasoning: z.string().max(300),
    }),
  }),

  proposeAddLanguage: tool({
    description:
      "Proponuje dodanie języka obcego. Poziom w skali CEFR (A1, A2, B1, B2, C1, C2, native).",
    inputSchema: z.object({
      name: z.string().min(2).max(60).describe("Nazwa języka po polsku (np. 'Angielski', 'Niemiecki')."),
      level: languageLevelSchema,
      reasoning: z.string().max(200),
    }),
  }),

  proposeAddCertification: tool({
    description:
      "Proponuje dodanie certyfikatu/uprawnienia. Polskie certyfikaty mają pierwszeństwo (UDT, SEP, PRK/ZSK, ISO, branżowe). Podaj wystawcę po polsku, rok uzyskania.",
    inputSchema: z.object({
      name: z.string().min(2).max(160),
      issuer: z.string().max(120).default(""),
      year: z.string().regex(/^\d{4}$|^$/).default(""),
      month: z.string().regex(/^\d{2}$|^$/).default(""),
      url: z.string().url().optional().or(z.literal("")),
      reasoning: z.string().max(200),
    }),
  }),

  proposeShortenEmploymentDescription: tool({
    description:
      "Proponuje skrócenie opisu konkretnego stanowiska (gdy CV nie mieści się na 1 stronę — overflow=true, lub gdy opis jest rozwlekły). Zachowaj mierzalne efekty, usuń wodę.",
    inputSchema: z.object({
      employmentId: z.string().min(1),
      description: z.string().min(20).max(800).describe("Skrócona wersja opisu — zachowaj konkrety."),
      targetChars: z.number().int().min(100).max(1200).describe("Docelowa długość znaków."),
      reasoning: z.string().max(300),
    }),
  }),

  proposeSetRodo: tool({
    description:
      "Proponuje zmianę klauzuli RODO. Typy: 'standard' (klasyczna zgoda), 'future' (dla przyszłych rekrutacji), 'both' (obie razem), 'none' (bez klauzuli — rzadko, ryzyko ATS odrzuci CV).",
    inputSchema: z.object({
      type: rodoTypeSchema,
      companyName: z
        .string()
        .max(120)
        .optional()
        .describe("Nazwa firmy docelowej (opcjonalnie — w klauzuli 'future')."),
      reasoning: z.string().max(200),
    }),
  }),

  proposeSetTemplate: tool({
    description:
      "Proponuje zmianę szablonu CV. Szablony: 'orbit' (monochrom, klasyczny, bezpieczny dla ATS), 'atlas' (navy + niebieski akcent, ikony kontakt), 'terra' (ciepły editorial z terakotą, italic serif), 'cobalt' (2-kolumnowy z sidebar, korpo-navy), 'lumen' (editorial label-based, minimalistyczny). Proponuj gdy styl nie pasuje do branży.",
    inputSchema: z.object({
      id: templateIdSchema,
      reasoning: z.string().min(10).max(300).describe("Dlaczego ten szablon lepszy dla kandydata."),
    }),
  }),

  proposeToggleSection: tool({
    description:
      "Proponuje włączenie lub ukrycie sekcji w CV. Nie proponuj włączania sekcji, którą user świadomie ukrył. Proponuj włączenie sekcji opcjonalnej (np. languages/certifications) gdy user ma dane, których nie widać.",
    inputSchema: z.object({
      section: SECTION_TOGGLE,
      show: z.boolean(),
      reasoning: z.string().max(300),
    }),
  }),

  proposeSetPhotoShape: tool({
    description:
      "Proponuje kształt zdjęcia: 'circle' (miękkie, UX/kreatywne), 'square' (klasyczne, korpo/finanse), 'none' (bez zdjęcia — zagraniczne normy/preferencja).",
    inputSchema: z.object({
      shape: photoShapeSchema,
      reasoning: z.string().max(200),
    }),
  }),

  proposeHideContactField: tool({
    description:
      "Proponuje ukrycie pola kontaktu (adres, telefon, email, strona www). Użyj np. gdy user chce prywatności (adres ukryty) lub gdy dane nadmiarowe.",
    inputSchema: z.object({
      field: contactFieldSchema,
      hidden: z.boolean().describe("true = ukryj, false = pokaż"),
      reasoning: z.string().max(200),
    }),
  }),

  proposeSetFontFamily: tool({
    description:
      "Proponuje zmianę rodziny czcionki CV. Dostępne: 'manrope' (default, nowoczesna sans-serif), 'ibm-plex' (korpo, profesjonalna), 'geist' (techniczna), 'outfit' (geometryczna), 'source-sans' (klasyczna).",
    inputSchema: z.object({
      family: fontFamilySchema,
      reasoning: z.string().max(200),
    }),
  }),
} as const;

export type PracusToolName = keyof typeof pracusTools;
export const PRACUS_TOOL_NAMES = Object.keys(pracusTools) as PracusToolName[];
