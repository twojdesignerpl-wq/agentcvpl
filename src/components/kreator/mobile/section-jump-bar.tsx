"use client";

import { useCallback } from "react";
import { useCVStore } from "@/lib/cv/store";
import { cn } from "@/lib/utils";

type JumpItem = {
  id: string;
  label: string;
  visible: boolean;
};

const OFFSET = 104;

function scrollToAnchor(anchorId: string) {
  const el = document.getElementById(anchorId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Horizontal scrollable chip nav pomagający szybko przeskoczyć między sekcjami
 * w długiej akordeonowej liście edytora. Renderuje tylko widoczne sekcje.
 */
export function SectionJumpBar() {
  const settings = useCVStore((s) => s.cv.settings);
  const customCount = useCVStore((s) => s.cv.customSections.length);

  const items: JumpItem[] = [
    { id: "personal", label: "Dane", visible: true },
    { id: "profile", label: "Profil", visible: settings.showProfile },
    { id: "employment", label: "Doświadczenie", visible: settings.showEmployment },
    { id: "education", label: "Edukacja", visible: settings.showEducation },
    { id: "skills", label: "Umiejętności", visible: settings.showSkills },
    { id: "languages", label: "Języki", visible: settings.showLanguages },
    { id: "projects", label: "Projekty", visible: settings.showProjects },
    { id: "certifications", label: "Certyfikaty", visible: settings.showCertifications },
    { id: "volunteer", label: "Wolontariat", visible: settings.showVolunteer },
    { id: "publications", label: "Publikacje", visible: settings.showPublications },
    { id: "awards", label: "Nagrody", visible: settings.showAwards },
    { id: "conferences", label: "Konferencje", visible: settings.showConferences },
    { id: "references", label: "Referencje", visible: settings.showReferences },
    { id: "hobbies", label: "Zainteresowania", visible: settings.showHobbies },
    { id: "custom", label: "Własne", visible: customCount > 0 },
  ];

  const active = items.filter((i) => i.visible);

  const onClick = useCallback((id: string) => {
    scrollToAnchor(`section-${id}`);
  }, []);

  return (
    <nav
      aria-label="Skocz do sekcji"
      className="hide-scrollbar sticky top-[calc(var(--mobile-top-h,3rem)+env(safe-area-inset-top,0px))] z-20 -mx-4 overflow-x-auto border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] bg-[color:color-mix(in_oklab,var(--cream)_94%,transparent)] backdrop-blur-md"
    >
      <ul className="flex items-center gap-1.5 px-4 py-2">
        {active.map((item) => (
          <li key={item.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onClick(item.id)}
              className={cn(
                "tap-target inline-flex items-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12.5px] font-medium text-ink transition-[border-color,background-color,transform] duration-150 ease-out active:scale-[0.97] hover:border-[color:var(--ink)]",
              )}
              aria-label={`Przejdź do sekcji ${item.label}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
