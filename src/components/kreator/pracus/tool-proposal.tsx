"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { CheckCircle, XCircle, Sparkle, Plus, Check } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import {
  FONT_FAMILY_LABELS,
  LANGUAGE_LEVEL_LABELS,
  type CVData,
  type EmploymentItem,
} from "@/lib/cv/schema";
import { cn } from "@/lib/utils";
import type { PracusToolName } from "@/lib/ai/tools";

type AnyInput = Record<string, unknown>;

type Props = {
  toolCallId: string;
  toolName: PracusToolName | string;
  input: AnyInput;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  output?: { status: "applied" | "rejected"; note?: string };
  onApply: (overrideInput?: AnyInput) => void;
  onReject: (reason?: string) => void;
};

const TOOL_LABELS: Record<string, string> = {
  proposeUpdateProfile: "Zaktualizować profil zawodowy",
  proposeUpdateEmploymentDescription: "Poprawić opis stanowiska",
  proposeAddEmployment: "Dodać nowe stanowisko",
  proposeAddSkills: "Dodać umiejętności",
  proposeAddLanguage: "Dodać język",
  proposeAddCertification: "Dodać certyfikat",
  proposeShortenEmploymentDescription: "Skrócić opis stanowiska",
  proposeSetRodo: "Zmienić klauzulę RODO",
  proposeSetTemplate: "Zmienić szablon CV",
  proposeToggleSection: "Zmienić widoczność sekcji",
  proposeSetPhotoShape: "Zmienić kształt zdjęcia",
  proposeHideContactField: "Ukryć pole kontaktu",
  proposeSetFontFamily: "Zmienić czcionkę",
};

const TEMPLATE_LABELS: Record<string, string> = {
  orbit: "Orbit (monochrom)",
  atlas: "Atlas (navy + ikony)",
  terra: "Terra (editorial terakota)",
  cobalt: "Cobalt (korpo 2-col)",
  lumen: "Lumen (label editorial)",
};

const RODO_LABELS: Record<string, string> = {
  standard: "Standard (klasyczna zgoda)",
  future: "Future (przyszłe rekrutacje)",
  both: "Oba typy razem",
  none: "Brak klauzuli",
};

const SECTION_LABELS: Record<string, string> = {
  profile: "Profil",
  education: "Edukacja",
  employment: "Doświadczenie",
  skills: "Umiejętności",
  languages: "Języki",
  projects: "Projekty",
  certifications: "Certyfikaty",
  volunteer: "Wolontariat",
  publications: "Publikacje",
  awards: "Nagrody",
  conferences: "Konferencje",
  hobbies: "Zainteresowania",
  references: "Referencje",
  links: "Linki",
};

const CONTACT_LABELS: Record<string, string> = {
  address: "Adres",
  email: "Email",
  website: "Strona WWW",
  phone: "Telefon",
};

const PHOTO_LABELS: Record<string, string> = {
  circle: "Okrągłe",
  square: "Kwadratowe",
  none: "Bez zdjęcia",
};

function findEmployment(cv: CVData, id: string): EmploymentItem | undefined {
  return cv.employment.find((e) => e.id === id);
}

function formatSnippet(s: string | undefined | null, max = 220): string {
  if (!s) return "";
  const t = String(s).trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "…";
}

function Diff({ before, after }: { before?: string | null; after: string }) {
  const hasBefore = Boolean(before && before.trim());
  return (
    <div className="flex min-w-0 flex-col gap-1.5 text-[12.5px] leading-relaxed">
      {hasBefore ? (
        <details className="rounded-lg border border-ink/8 bg-[color-mix(in_oklab,var(--cream)_94%,black_2%)] text-[11.5px]">
          <summary className="cursor-pointer select-none px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted hover:text-ink">
            Pokaż obecny tekst
          </summary>
          <div className="max-h-[40vh] overflow-y-auto whitespace-pre-wrap break-words px-2.5 pb-2 text-ink-soft">
            {formatSnippet(before, 180)}
          </div>
        </details>
      ) : null}
      <div className="rounded-lg border border-saffron/30 bg-saffron/8 p-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rust)] mb-1">
          Propozycja
        </div>
        <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words text-ink">
          {formatSnippet(after, 500)}
        </div>
      </div>
    </div>
  );
}

export function ToolProposal({
  toolName,
  input,
  state,
  output,
  onApply,
  onReject,
}: Props) {
  const cv = useCVStore((s) => s.cv);
  const label = TOOL_LABELS[toolName] ?? toolName;

  const isStreaming = state === "input-streaming";
  const isResolved = state === "output-available" && output;

  // Selective apply dla proposeAddSkills — zestaw wybranych skilli (init = wszystkie).
  const proposedSkills =
    toolName === "proposeAddSkills" && Array.isArray(input.skills)
      ? (input.skills as string[]).filter((x) => typeof x === "string")
      : [];
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    () => new Set(proposedSkills),
  );
  useEffect(() => {
    if (toolName === "proposeAddSkills" && !isResolved) {
      setSelectedSkills(new Set(proposedSkills));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolName, proposedSkills.join("|"), isResolved]);

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  // Render diff/content per tool
  let body: React.ReactNode = null;

  if (toolName === "proposeUpdateProfile") {
    body = <Diff before={cv.profile} after={String(input.text ?? "")} />;
  } else if (
    toolName === "proposeUpdateEmploymentDescription" ||
    toolName === "proposeShortenEmploymentDescription"
  ) {
    const emp = findEmployment(cv, String(input.employmentId ?? ""));
    body = (
      <div className="flex flex-col gap-2">
        <div className="text-[11.5px] text-ink-muted">
          Stanowisko: <strong className="text-ink">{emp?.position || "?"}</strong> @{" "}
          {emp?.company || "?"}
        </div>
        <Diff before={emp?.description} after={String(input.description ?? "")} />
      </div>
    );
  } else if (toolName === "proposeAddEmployment") {
    const dates =
      input.current === true
        ? `${input.startMonth ? `${input.startMonth}.` : ""}${input.startYear ?? ""} — obecnie`
        : `${input.startMonth ? `${input.startMonth}.` : ""}${input.startYear ?? "?"} — ${input.endMonth ? `${input.endMonth}.` : ""}${input.endYear ?? "?"}`;
    body = (
      <div className="rounded-lg border border-saffron/30 bg-saffron/8 p-3 flex flex-col gap-1.5">
        <div className="font-semibold text-ink">
          {String(input.position ?? "?")} @ {String(input.company ?? "?")}
        </div>
        {input.location ? (
          <div className="text-[12px] text-ink-muted">{String(input.location)}</div>
        ) : null}
        <div className="text-[11.5px] text-ink-muted">{dates}</div>
        {input.description ? (
          <div className="text-[12.5px] text-ink-soft whitespace-pre-wrap mt-1">
            {formatSnippet(String(input.description), 400)}
          </div>
        ) : null}
      </div>
    );
  } else if (toolName === "proposeAddSkills") {
    const group = String(input.group ?? "professional");
    const groupLabel = group === "professional" ? "zawodowe" : "osobiste";
    const skills = proposedSkills;
    const allSelected = selectedSkills.size === skills.length && skills.length > 0;
    body = (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11.5px] text-ink-muted">
            Grupa: <strong className="text-ink">{groupLabel}</strong>
          </div>
          {!isResolved ? (
            <button
              type="button"
              onClick={() =>
                setSelectedSkills(allSelected ? new Set() : new Set(skills))
              }
              className="text-[11px] font-medium text-ink-muted hover:text-ink underline underline-offset-2 transition-colors"
            >
              {allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
            </button>
          ) : null}
        </div>
        <div className="rounded-lg border border-saffron/30 bg-saffron/8 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rust)] mb-2">
            {isResolved ? "Propozycja" : "Kliknij, żeby wybrać"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => {
              const selected = selectedSkills.has(s);
              const interactive = !isResolved;
              return (
                <motion.button
                  type="button"
                  key={s}
                  onClick={interactive ? () => toggleSkill(s) : undefined}
                  disabled={!interactive}
                  whileTap={interactive ? { scale: 0.95 } : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors",
                    interactive ? "cursor-pointer" : "cursor-default",
                    selected
                      ? "border border-[color:var(--jade)]/50 bg-[color-mix(in_oklab,var(--jade)_10%,var(--cream))] text-ink hover:bg-[color-mix(in_oklab,var(--jade)_16%,var(--cream))]"
                      : "border border-ink/10 bg-cream text-ink-muted line-through decoration-ink-muted/50 hover:border-saffron hover:text-ink hover:no-underline",
                  )}
                >
                  {selected ? (
                    <Check size={11} weight="bold" className="text-[color:var(--jade)]" />
                  ) : (
                    <Plus size={11} weight="bold" />
                  )}
                  {s}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (toolName === "proposeAddLanguage") {
    body = (
      <div className="rounded-lg border border-saffron/30 bg-saffron/8 p-2.5 text-[13px] text-ink">
        <strong>{String(input.name ?? "?")}</strong> ·{" "}
        {LANGUAGE_LEVEL_LABELS[input.level as keyof typeof LANGUAGE_LEVEL_LABELS] ??
          String(input.level ?? "?")}
      </div>
    );
  } else if (toolName === "proposeAddCertification") {
    body = (
      <div className="rounded-lg border border-saffron/30 bg-saffron/8 p-2.5 flex flex-col gap-0.5">
        <strong className="text-ink">{String(input.name ?? "?")}</strong>
        {input.issuer ? (
          <div className="text-[12px] text-ink-muted">{String(input.issuer)}</div>
        ) : null}
        {input.year ? (
          <div className="text-[11.5px] text-ink-muted">
            {input.month ? `${input.month}.` : ""}
            {String(input.year)}
          </div>
        ) : null}
      </div>
    );
  } else if (toolName === "proposeSetRodo") {
    body = (
      <div className="text-[13px] text-ink">
        Obecnie:{" "}
        <strong className="text-ink-soft">
          {RODO_LABELS[cv.rodo.type] ?? cv.rodo.type}
        </strong>
        {" → "}
        Propozycja:{" "}
        <strong className="text-[color:var(--rust)]">
          {RODO_LABELS[String(input.type ?? "")] ?? String(input.type ?? "?")}
        </strong>
        {input.companyName ? ` (firma: ${String(input.companyName)})` : ""}
      </div>
    );
  } else if (toolName === "proposeSetTemplate") {
    body = (
      <div className="text-[13px] text-ink">
        Obecnie:{" "}
        <strong className="text-ink-soft">
          {TEMPLATE_LABELS[cv.settings.templateId] ?? cv.settings.templateId}
        </strong>
        {" → "}
        Propozycja:{" "}
        <strong className="text-[color:var(--rust)]">
          {TEMPLATE_LABELS[String(input.id ?? "")] ?? String(input.id ?? "?")}
        </strong>
      </div>
    );
  } else if (toolName === "proposeToggleSection") {
    const section = String(input.section ?? "");
    const show = Boolean(input.show);
    body = (
      <div className="text-[13px] text-ink">
        {show ? "Pokaż" : "Ukryj"} sekcję{" "}
        <strong className="text-ink">{SECTION_LABELS[section] ?? section}</strong>
      </div>
    );
  } else if (toolName === "proposeSetPhotoShape") {
    body = (
      <div className="text-[13px] text-ink">
        Kształt zdjęcia:{" "}
        <strong className="text-ink-soft">
          {PHOTO_LABELS[cv.settings.photoShape] ?? cv.settings.photoShape}
        </strong>
        {" → "}
        <strong className="text-[color:var(--rust)]">
          {PHOTO_LABELS[String(input.shape ?? "")] ?? String(input.shape ?? "?")}
        </strong>
      </div>
    );
  } else if (toolName === "proposeHideContactField") {
    const field = String(input.field ?? "");
    const hidden = Boolean(input.hidden);
    body = (
      <div className="text-[13px] text-ink">
        {hidden ? "Ukryj" : "Pokaż"} pole kontaktu:{" "}
        <strong className="text-ink">{CONTACT_LABELS[field] ?? field}</strong>
      </div>
    );
  } else if (toolName === "proposeSetFontFamily") {
    body = (
      <div className="text-[13px] text-ink">
        Czcionka:{" "}
        <strong className="text-ink-soft">
          {FONT_FAMILY_LABELS[cv.settings.fontFamily] ?? cv.settings.fontFamily}
        </strong>
        {" → "}
        <strong className="text-[color:var(--rust)]">
          {FONT_FAMILY_LABELS[input.family as keyof typeof FONT_FAMILY_LABELS] ??
            String(input.family ?? "?")}
        </strong>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "rounded-2xl border bg-cream-soft p-3.5 flex flex-col gap-2.5 shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)]",
        isResolved && output?.status === "applied"
          ? "border-[color:var(--jade)]/40 bg-[color-mix(in_oklab,var(--jade)_6%,var(--cream-soft))]"
          : isResolved && output?.status === "rejected"
            ? "border-ink/10 bg-[color-mix(in_oklab,var(--ink)_3%,var(--cream-soft))] opacity-80"
            : "border-saffron/30",
      )}
    >
      <div className="flex items-center gap-2">
        <Sparkle size={14} weight="fill" className="text-[color:var(--saffron)]" />
        <span className="font-heading text-[12.5px] font-semibold text-ink uppercase tracking-wide">
          {label}
        </span>
        {isStreaming ? (
          <span className="text-[10.5px] text-ink-muted ml-auto animate-pulse">
            generuję…
          </span>
        ) : null}
      </div>

      {body}

      {isResolved ? (
        <div
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-medium",
            output?.status === "applied"
              ? "text-[color:var(--jade)]"
              : "text-ink-muted",
          )}
        >
          {output?.status === "applied" ? (
            <>
              <CheckCircle size={14} weight="fill" /> Zastosowano
            </>
          ) : (
            <>
              <XCircle size={14} weight="regular" /> Odrzucono
              {output?.note ? ` · ${output.note}` : ""}
            </>
          )}
        </div>
      ) : state === "input-available" ? (
        <div className="flex gap-2 pt-0.5">
          {toolName === "proposeAddSkills" ? (
            <button
              type="button"
              disabled={selectedSkills.size === 0}
              onClick={() =>
                onApply({
                  ...input,
                  skills: proposedSkills.filter((s) => selectedSkills.has(s)),
                })
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
                selectedSkills.size === 0
                  ? "bg-ink/15 text-ink-muted cursor-not-allowed"
                  : "bg-ink text-cream hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)]",
              )}
            >
              <CheckCircle size={14} weight="fill" />
              Dodaj zaznaczone
              {selectedSkills.size > 0 ? ` (${selectedSkills.size})` : ""}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApply()}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-3.5 py-1.5 text-[12px] font-semibold hover:bg-[color-mix(in_oklab,var(--ink)_88%,white)] transition-colors"
            >
              <CheckCircle size={14} weight="fill" /> Zastosuj
            </button>
          )}
          <button
            type="button"
            onClick={() => onReject()}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-transparent px-3.5 py-1.5 text-[12px] font-medium text-ink-muted hover:text-ink hover:border-ink/25 transition-colors"
          >
            <XCircle size={14} weight="regular" /> Odrzuć
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}

// Helper: export empty id generator (nie używane w komponencie, ale przydatne w dispatcher-ze)
export const genItemId = (prefix: string) => `${prefix}-${nanoid(6)}`;
