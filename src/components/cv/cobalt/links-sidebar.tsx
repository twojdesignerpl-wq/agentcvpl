"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { useCVStore } from "@/lib/cv/store";
import { CobaltSectionHeading } from "./section-heading";

function hostnameOf(url: string): string {
  if (!url) return "";
  try {
    const withProto = url.startsWith("http") ? url : `https://${url}`;
    const u = new URL(withProto);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function CobaltLinksSidebar() {
  const personal = useCVStore((s) => s.cv.personal);
  const projects = useCVStore((s) => s.cv.projects);
  const showProjects = useCVStore((s) => s.cv.settings.showProjects);
  const updatePersonal = useCVStore((s) => s.updatePersonal);

  const projectLinks = showProjects
    ? projects.filter((p) => p.url && p.url.trim() !== "")
    : [];

  if (!personal.website && projectLinks.length === 0) {
    // Pokazujemy nadal sekcję żeby user mógł wpisać website
    return (
      <section data-cv-section="links-cobalt">
        <CobaltSectionHeading>Linki</CobaltSectionHeading>
        <div>
          <p className="cobalt-display text-[calc(var(--cv-font-size)*0.85)] font-bold text-[color:var(--cv-ink)]">
            Strona
          </p>
          <EditableText
            value={personal.website}
            onChange={(v) => updatePersonal({ website: v })}
            placeholder="www.twojastrona.pl"
            className="text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-ink)]"
          />
        </div>
      </section>
    );
  }

  return (
    <section data-cv-section="links-cobalt">
      <CobaltSectionHeading>Linki</CobaltSectionHeading>
      <ul className="flex flex-col gap-[2mm]">
        {personal.website ? (
          <li>
            <p className="cobalt-display text-[calc(var(--cv-font-size)*0.85)] font-bold text-[color:var(--cv-ink)]">
              Strona
            </p>
            <EditableText
              value={personal.website}
              onChange={(v) => updatePersonal({ website: v })}
              placeholder="www.twojastrona.pl"
              className="text-[calc(var(--cv-font-size)*0.95)] leading-snug text-[color:var(--cv-ink)]"
            />
          </li>
        ) : null}
        {projectLinks.map((p) => (
          <li key={p.id}>
            <p className="cobalt-display text-[calc(var(--cv-font-size)*0.85)] font-bold text-[color:var(--cv-ink)]">
              {p.name || hostnameOf(p.url)}
            </p>
            <p className="text-[calc(var(--cv-font-size)*0.92)] leading-snug text-[color:var(--cv-muted)] truncate">
              {hostnameOf(p.url)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
