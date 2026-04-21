"use client";

import type { ComponentType, RefObject } from "react";
import {
  Buildings,
  Certificate,
  Translate,
  CaretDown,
  HandHeart,
  Microphone,
  Notebook,
  SquaresFour,
  Sparkle,
  Trophy,
  UserList,
  Plus,
  IdentificationCard,
  GraduationCap,
  Briefcase,
  Wrench,
  Link as LinkIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnimatedPopover } from "./animated-popover";
import { useCVStore } from "@/lib/cv/store";

type IconComponent = ComponentType<{ size?: number; weight?: "regular" | "fill" | "bold" }>;

type ToggleRow = {
  id: string;
  label: string;
  description: string;
  Icon: IconComponent;
  checked: boolean;
  onChange: (next: boolean) => void;
};

type Group = {
  label: string;
  rows: ToggleRow[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function SectionsPopover({ open, onOpenChange, containerRef }: Props) {
  const settings = useCVStore((s) => s.cv.settings);
  const customSections = useCVStore((s) => s.cv.customSections);

  const templateId = useCVStore((s) => s.cv.settings.templateId);
  const toggleProfile = useCVStore((s) => s.toggleProfile);
  const toggleEducation = useCVStore((s) => s.toggleEducation);
  const toggleEmployment = useCVStore((s) => s.toggleEmployment);
  const toggleSkills = useCVStore((s) => s.toggleSkills);
  const toggleLinks = useCVStore((s) => s.toggleLinks);
  const toggleLanguages = useCVStore((s) => s.toggleLanguages);
  const toggleProjects = useCVStore((s) => s.toggleProjects);
  const toggleCertifications = useCVStore((s) => s.toggleCertifications);
  const toggleVolunteer = useCVStore((s) => s.toggleVolunteer);
  const togglePublications = useCVStore((s) => s.togglePublications);
  const toggleAwards = useCVStore((s) => s.toggleAwards);
  const toggleConferences = useCVStore((s) => s.toggleConferences);
  const toggleHobbies = useCVStore((s) => s.toggleHobbies);
  const toggleReferences = useCVStore((s) => s.toggleReferences);
  const addCustomSection = useCVStore((s) => s.addCustomSection);

  // Aktywne sekcje opcjonalne + dodatkowe + ukryte podstawowe
  const optionalActive = [
    settings.showLanguages,
    settings.showProjects,
    settings.showCertifications,
    settings.showVolunteer,
    settings.showPublications,
    settings.showAwards,
    settings.showConferences,
    settings.showHobbies,
    settings.showReferences,
  ].filter(Boolean).length;
  const baseHidden = [
    !settings.showProfile,
    !settings.showEducation,
    !settings.showEmployment,
    !settings.showSkills,
    templateId === "cobalt" && !settings.showLinks,
  ].filter(Boolean).length;
  const activeCount = optionalActive + customSections.length + baseHidden;

  const baseRows: ToggleRow[] = [
    {
      id: "profile",
      label: "Profil",
      description: "Krótkie podsumowanie zawodowe",
      Icon: IdentificationCard,
      checked: settings.showProfile,
      onChange: toggleProfile,
    },
    {
      id: "employment",
      label: "Doświadczenie",
      description: "Historia zatrudnienia",
      Icon: Briefcase,
      checked: settings.showEmployment,
      onChange: toggleEmployment,
    },
    {
      id: "education",
      label: "Edukacja",
      description: "Wykształcenie i szkoły",
      Icon: GraduationCap,
      checked: settings.showEducation,
      onChange: toggleEducation,
    },
    {
      id: "skills",
      label: "Umiejętności",
      description: "Kompetencje zawodowe i miękkie",
      Icon: Wrench,
      checked: settings.showSkills,
      onChange: toggleSkills,
    },
  ];
  if (templateId === "cobalt") {
    baseRows.push({
      id: "links",
      label: "Linki",
      description: "Sidebar z linkami (strona, projekty)",
      Icon: LinkIcon,
      checked: settings.showLinks,
      onChange: toggleLinks,
    });
  }

  const groups: Group[] = [
    {
      label: "Sekcje podstawowe",
      rows: baseRows,
    },
    {
      label: "Standardowe",
      rows: [
        {
          id: "languages",
          label: "Języki",
          description: "Poziom znajomości języków obcych",
          Icon: Translate,
          checked: settings.showLanguages,
          onChange: toggleLanguages,
        },
        {
          id: "projects",
          label: "Projekty",
          description: "Portfolio i realizacje",
          Icon: Buildings,
          checked: settings.showProjects,
          onChange: toggleProjects,
        },
      ],
    },
    {
      label: "Osiągnięcia",
      rows: [
        {
          id: "certifications",
          label: "Certyfikaty",
          description: "Kursy i szkolenia z wystawcą",
          Icon: Certificate,
          checked: settings.showCertifications,
          onChange: toggleCertifications,
        },
        {
          id: "awards",
          label: "Nagrody i wyróżnienia",
          description: "Otrzymane nagrody i stypendia",
          Icon: Trophy,
          checked: settings.showAwards,
          onChange: toggleAwards,
        },
        {
          id: "publications",
          label: "Publikacje",
          description: "Artykuły, książki, raporty",
          Icon: Notebook,
          checked: settings.showPublications,
          onChange: togglePublications,
        },
        {
          id: "conferences",
          label: "Konferencje i prelekcje",
          description: "Prezentacje i udział w wydarzeniach",
          Icon: Microphone,
          checked: settings.showConferences,
          onChange: toggleConferences,
        },
      ],
    },
    {
      label: "Osobiste",
      rows: [
        {
          id: "volunteer",
          label: "Wolontariat",
          description: "Praca społeczna, NGO, działalność prospołeczna",
          Icon: HandHeart,
          checked: settings.showVolunteer,
          onChange: toggleVolunteer,
        },
        {
          id: "hobbies",
          label: "Zainteresowania",
          description: "Hobby, pasje, zainteresowania",
          Icon: Sparkle,
          checked: settings.showHobbies,
          onChange: toggleHobbies,
        },
        {
          id: "references",
          label: "Referencje",
          description: "Osoby polecające",
          Icon: UserList,
          checked: settings.showReferences,
          onChange: toggleReferences,
        },
      ],
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "group inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-cream-soft px-3.5 py-2 text-[13px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]",
          open
            ? "border-[color:var(--ink)] bg-[color:color-mix(in_oklab,var(--ink)_6%,var(--cream-soft))]"
            : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] hover:border-[color:var(--ink)]",
        )}
      >
        <SquaresFour size={14} weight="regular" />
        <span>Sekcje</span>
        <span
          aria-hidden={activeCount === 0}
          aria-label={activeCount > 0 ? `${activeCount} aktywne` : undefined}
          className={cn(
            "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--ink)] px-1 text-[10px] font-bold text-[color:var(--cream)] transition-opacity",
            activeCount > 0 ? "opacity-100" : "opacity-0",
          )}
        >
          {activeCount > 0 ? activeCount : 0}
        </span>
        <CaretDown
          size={11}
          weight="bold"
          className={cn("transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>

      <AnimatedPopover
        open={open}
        align="center"
        aria-label="Dodatkowe sekcje CV"
        className="w-[360px] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
      >
        <div
          className="menu-scroll p-2"
          style={{ maxHeight: 480, overflowY: "auto", borderRadius: "1rem" }}
        >
        <div className="px-1 pb-1.5 pt-0.5">
          <h4 className="text-[13px] font-semibold text-[color:var(--ink)]">Dodaj sekcje</h4>
          <p className="mt-0.5 text-[11.5px] text-[color:var(--ink-muted)]">
            Włącz dodatkowe sekcje w Twoim CV.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mono-label px-3 pb-0.5 pt-1 text-[9.5px] tracking-[0.18em] text-[color:var(--ink-muted)]">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.rows.map(({ id, label, description, Icon, checked, onChange }) => (
                  <label
                    key={id}
                    className="group/row flex cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2 transition-colors duration-150 ease-out hover:bg-[color:color-mix(in_oklab,var(--ink)_4%,transparent)] active:scale-[0.99]"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ease-out",
                        checked
                          ? "bg-[color:var(--ink)] text-[color:var(--cream)]"
                          : "bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] text-[color:var(--ink-muted)]",
                      )}
                      aria-hidden
                    >
                      <Icon size={14} weight="regular" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12.5px] font-semibold leading-tight text-[color:var(--ink)]">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[color:var(--ink-muted)]">
                        {description}
                      </span>
                    </span>
                    <Switch
                      checked={checked}
                      onCheckedChange={(next: boolean) => onChange(next)}
                      className="mt-1 shrink-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] mt-1 pt-2">
            <button
              type="button"
              onClick={() => {
                addCustomSection();
                onOpenChange(false);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] px-3 py-2.5 text-[12.5px] font-medium text-[color:var(--ink)] transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--ink)_4%,transparent)] active:scale-[0.99]"
            >
              <Plus size={13} weight="bold" /> Dodaj własną sekcję
            </button>
          </div>
        </div>
        </div>
      </AnimatedPopover>
    </div>
  );
}
