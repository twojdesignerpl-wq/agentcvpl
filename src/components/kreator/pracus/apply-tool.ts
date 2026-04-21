"use client";

import { nanoid } from "nanoid";
import { useCVStore } from "@/lib/cv/store";
import { useHistoryStore } from "@/lib/cv/history-store";
import type {
  ContactField,
  FontFamilyId,
  LanguageLevel,
  PhotoShape,
  RodoType,
  TemplateId,
} from "@/lib/cv/schema";

const TOOL_LABELS: Record<string, string> = {
  proposeUpdateProfile: "Zaktualizowano profil",
  proposeUpdateEmploymentDescription: "Poprawiono opis stanowiska",
  proposeShortenEmploymentDescription: "Skrócono opis stanowiska",
  proposeAddEmployment: "Dodano stanowisko",
  proposeAddSkills: "Dodano umiejętności",
  proposeAddLanguage: "Dodano język",
  proposeAddCertification: "Dodano certyfikat",
  proposeSetRodo: "Zmieniono klauzulę RODO",
  proposeSetTemplate: "Zmieniono szablon",
  proposeToggleSection: "Zmieniono widoczność sekcji",
  proposeSetPhotoShape: "Zmieniono kształt zdjęcia",
  proposeHideContactField: "Zmieniono widoczność kontaktu",
  proposeSetFontFamily: "Zmieniono czcionkę",
};

type AnyInput = Record<string, unknown>;

/**
 * Wywołuje odpowiednią akcję useCVStore na podstawie tool-name i input.
 * Zwraca krótką notatkę do `addToolResult` (informacyjnie dla agenta).
 */
export function applyToolToStore(
  toolName: string,
  input: AnyInput,
): { status: "applied"; note: string } {
  const store = useCVStore.getState();

  // Snapshot CV przed zmianą — dla version history
  const snapshotLabel = TOOL_LABELS[toolName] ?? "Zmiana Pracusia";
  useHistoryStore.getState().push(snapshotLabel, store.cv);

  switch (toolName) {
    case "proposeUpdateProfile": {
      store.updateProfile(String(input.text ?? ""));
      return { status: "applied", note: "Profil zawodowy zaktualizowany." };
    }

    case "proposeUpdateEmploymentDescription":
    case "proposeShortenEmploymentDescription": {
      const id = String(input.employmentId ?? "");
      store.updateEmployment(id, { description: String(input.description ?? "") });
      return { status: "applied", note: "Opis stanowiska zaktualizowany." };
    }

    case "proposeAddEmployment": {
      const id = `emp-${nanoid(6)}`;
      store.addEmployment();
      // addEmployment dodaje puste na koniec — nadpisz:
      const latest = useCVStore.getState().cv.employment.at(-1);
      if (latest) {
        store.updateEmployment(latest.id, {
          position: String(input.position ?? ""),
          company: String(input.company ?? ""),
          location: String(input.location ?? ""),
          startYear: String(input.startYear ?? ""),
          startMonth: String(input.startMonth ?? ""),
          endYear: String(input.endYear ?? ""),
          endMonth: String(input.endMonth ?? ""),
          current: Boolean(input.current),
          description: String(input.description ?? ""),
        });
      }
      // Id ignored (used local nanoid for future reference)
      void id;
      return { status: "applied", note: "Nowe stanowisko dodane do doświadczenia." };
    }

    case "proposeAddSkills": {
      const group = String(input.group ?? "professional") as "professional" | "personal";
      const newSkills = (Array.isArray(input.skills) ? (input.skills as unknown[]) : [])
        .map((s) => String(s))
        .filter(Boolean);
      const current = store.cv.skills[group] ?? [];
      // Deduplicate (case-insensitive)
      const existingLower = new Set(current.map((s) => s.toLowerCase()));
      const toAdd = newSkills.filter((s) => !existingLower.has(s.toLowerCase()));
      store.setSkills(group, [...current, ...toAdd]);
      return {
        status: "applied",
        note: `Dodano ${toAdd.length} umiejętności (${group === "professional" ? "zawodowe" : "osobiste"}).`,
      };
    }

    case "proposeAddLanguage": {
      store.addLanguage();
      const latest = useCVStore.getState().cv.languages.at(-1);
      if (latest) {
        store.updateLanguage(latest.id, {
          name: String(input.name ?? ""),
          level: (input.level as LanguageLevel) ?? "B2",
        });
      }
      // Włącz sekcję jeśli ukryta
      if (!store.cv.settings.showLanguages) store.toggleLanguages(true);
      return { status: "applied", note: "Język dodany." };
    }

    case "proposeAddCertification": {
      store.addCertification();
      const latest = useCVStore.getState().cv.certifications.at(-1);
      if (latest) {
        store.updateCertification(latest.id, {
          name: String(input.name ?? ""),
          issuer: String(input.issuer ?? ""),
          year: String(input.year ?? ""),
          month: String(input.month ?? ""),
          url: String(input.url ?? ""),
        });
      }
      if (!store.cv.settings.showCertifications) store.toggleCertifications(true);
      return { status: "applied", note: "Certyfikat dodany." };
    }

    case "proposeSetRodo": {
      store.setRodoType((input.type as RodoType) ?? "standard");
      if (typeof input.companyName === "string") {
        store.setRodoCompany(input.companyName);
      }
      return { status: "applied", note: "Klauzula RODO zmieniona." };
    }

    case "proposeSetTemplate": {
      store.setTemplate((input.id as TemplateId) ?? "orbit");
      return { status: "applied", note: "Szablon CV zmieniony." };
    }

    case "proposeToggleSection": {
      const section = String(input.section ?? "");
      const show = Boolean(input.show);
      const togglers: Record<string, (v: boolean) => void> = {
        profile: store.toggleProfile,
        education: store.toggleEducation,
        employment: store.toggleEmployment,
        skills: store.toggleSkills,
        languages: store.toggleLanguages,
        projects: store.toggleProjects,
        certifications: store.toggleCertifications,
        volunteer: store.toggleVolunteer,
        publications: store.togglePublications,
        awards: store.toggleAwards,
        conferences: store.toggleConferences,
        hobbies: store.toggleHobbies,
        references: store.toggleReferences,
        links: store.toggleLinks,
      };
      togglers[section]?.(show);
      return {
        status: "applied",
        note: `Sekcja ${section} ${show ? "włączona" : "ukryta"}.`,
      };
    }

    case "proposeSetPhotoShape": {
      store.setPhotoShape((input.shape as PhotoShape) ?? "circle");
      return { status: "applied", note: "Kształt zdjęcia zmieniony." };
    }

    case "proposeHideContactField": {
      store.setContactFieldHidden(
        (input.field as ContactField) ?? "address",
        Boolean(input.hidden),
      );
      return {
        status: "applied",
        note: `Pole kontaktu ${String(input.field)} ${input.hidden ? "ukryte" : "pokazane"}.`,
      };
    }

    case "proposeSetFontFamily": {
      store.setFontFamily((input.family as FontFamilyId) ?? "manrope");
      return { status: "applied", note: "Czcionka zmieniona." };
    }

    default:
      return { status: "applied", note: `Tool ${toolName} nieobsługiwany.` };
  }
}
