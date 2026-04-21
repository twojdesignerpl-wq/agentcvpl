import type { CVData, ContactField } from "./schema";
import { FONT_FAMILY_STACKS } from "./schema";
import { buildRodoText } from "./rodo";

const escapeHTML = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeText = (s: string): string =>
  escapeHTML(s).replace(/\n/g, "<br/>");

const googleFontsHref = (family: string): string => {
  const param = encodeURIComponent(family).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${param}:wght@400;500;600;700&display=swap`;
};

const GOOGLE_FONT_BY_ID: Record<string, string | null> = {
  manrope: "Manrope",
  "ibm-plex": "IBM Plex Sans",
  geist: null,
  outfit: "Outfit",
  "source-sans": "Source Sans 3",
  "work-sans": "Work Sans",
  "nunito-sans": "Nunito Sans",
  lora: "Lora",
  merriweather: "Merriweather",
  "roboto-slab": "Roboto Slab",
};

const LANGUAGE_LABELS: Record<string, string> = {
  A1: "A1 — Początkujący",
  A2: "A2 — Podstawowy",
  B1: "B1 — Średnio zaawansowany",
  B2: "B2 — Zaawansowany",
  C1: "C1 — Biegły",
  C2: "C2 — Profesjonalny",
  native: "Ojczysty",
};

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────

function contactFieldsVisible(cv: CVData): Record<ContactField, string> {
  const hidden = new Set(cv.settings.hiddenContactFields ?? []);
  const { personal } = cv;
  return {
    address: hidden.has("address") ? "" : personal.address,
    email: hidden.has("email") ? "" : personal.email,
    website: hidden.has("website") ? "" : personal.website,
    phone: hidden.has("phone") ? "" : personal.phone,
  };
}

// ─── ORBIT ───────────────────────────────────────────────────────────────────

function formatDatePart(month: string, year: string): string {
  if (!year && !month) return "";
  if (!year) return month;
  if (!month) return year;
  return `${month}.${year}`;
}

function renderOrbitYears(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  current: boolean,
): string {
  const start = formatDatePart(startMonth, startYear) || "—";
  if (current) {
    return `<span class="cv-year">${escapeHTML(start)}</span><span class="cv-year">obecnie</span>`;
  }
  const end = formatDatePart(endMonth, endYear) || "—";
  return `<span class="cv-year">${escapeHTML(start)}</span><span class="cv-year-sep">—</span><span class="cv-year">${escapeHTML(end)}</span>`;
}

function orbitYearsClass(current: boolean): string {
  return current ? "cv-years cv-years--current" : "cv-years";
}

function renderOrbitHeader(cv: CVData): string {
  const { personal, settings } = cv;
  const fullName = `
    <span>${escapeHTML(personal.firstName)}</span>
    <span>${escapeHTML(personal.lastName)}</span>
  `;
  const photoHTML = settings.photoShape === "none"
    ? ""
    : personal.photo
      ? `<div class="cv-photo cv-photo--${settings.photoShape}"><img src="${escapeHTML(personal.photo)}" alt="" /></div>`
      : "";
  const c = contactFieldsVisible(cv);
  const lines: string[] = [];
  if (c.address) lines.push(`<span>${escapeText(c.address)}</span>`);
  if (c.email) lines.push(`<span>${escapeHTML(c.email)}</span>`);
  if (c.website) lines.push(`<span>${escapeHTML(c.website)}</span>`);
  if (c.phone) lines.push(`<span>${escapeHTML(c.phone)}</span>`);

  return `
    <header class="cv-header">
      ${photoHTML}
      <div class="cv-header-name">
        <h1 class="cv-name">${fullName}</h1>
        ${personal.role ? `<p class="cv-role">${escapeHTML(personal.role)}</p>` : ""}
      </div>
      <address class="cv-contact">
        ${lines.join("\n        ")}
      </address>
    </header>
  `;
}

function renderOrbitProfile(cv: CVData): string {
  if (!cv.profile.trim()) return "";
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Profil</h2>
      <p class="cv-body">${escapeText(cv.profile)}</p>
    </section>
  `;
}

function renderOrbitEducation(cv: CVData): string {
  if (cv.education.length === 0) return "";
  const items = cv.education
    .map(
      (e) => `
      <li class="cv-edu-item">
        <div class="${orbitYearsClass(e.current)}">${renderOrbitYears(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current)}</div>
        <div class="cv-edu-body">
          ${e.school ? `<p class="cv-strong">${escapeHTML(e.school)}</p>` : ""}
          ${e.degree ? `<p class="cv-body">${escapeText(e.degree)}</p>` : ""}
        </div>
      </li>
    `,
    )
    .join("");
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Edukacja</h2>
      <ul class="cv-list cv-edu-list">${items}</ul>
    </section>
  `;
}

function renderOrbitKeySkills(cv: CVData): string {
  const { professional, personal } = cv.skills;
  if (professional.length === 0 && personal.length === 0) return "";
  const makeList = (items: string[]) =>
    items.map((s) => `<li>${escapeHTML(s)}</li>`).join("");
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Umiejętności</h2>
      <div class="cv-skills-grid">
        <div>
          <h3 class="cv-subheading">Zawodowe</h3>
          <ul class="cv-list cv-skills">${makeList(professional)}</ul>
        </div>
        <div>
          <h3 class="cv-subheading">Osobiste</h3>
          <ul class="cv-list cv-skills">${makeList(personal)}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderOrbitEmployment(cv: CVData): string {
  if (cv.employment.length === 0) return "";
  const items = cv.employment
    .map(
      (e) => `
      <li class="cv-emp-item">
        <div class="${orbitYearsClass(e.current)}">${renderOrbitYears(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current)}</div>
        <div class="cv-emp-body">
          ${e.position ? `<p class="cv-strong">${escapeHTML(e.position)}</p>` : ""}
          ${e.company ? `<p class="cv-body">${escapeHTML(e.company)}</p>` : ""}
          ${e.description ? `<p class="cv-body cv-emp-desc">${escapeText(e.description)}</p>` : ""}
        </div>
      </li>
    `,
    )
    .join("");
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Doświadczenie zawodowe</h2>
      <ul class="cv-list cv-emp-list">${items}</ul>
    </section>
  `;
}

function renderOrbitLanguages(cv: CVData): string {
  if (!cv.settings.showLanguages || cv.languages.length === 0) return "";
  const items = cv.languages
    .map(
      (l) => `
      <li class="cv-lang-item">
        <span class="cv-strong">${escapeHTML(l.name)}</span>
        <span class="cv-muted">${escapeHTML(LANGUAGE_LABELS[l.level] ?? l.level)}</span>
      </li>
    `,
    )
    .join("");
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Języki</h2>
      <ul class="cv-list cv-lang-list">${items}</ul>
    </section>
  `;
}

function renderOrbitProjects(cv: CVData): string {
  if (!cv.settings.showProjects || cv.projects.length === 0) return "";
  const items = cv.projects
    .map(
      (p) => `
      <li class="cv-proj-item">
        <div class="cv-proj-head">
          <p class="cv-strong">${escapeHTML(p.name)}</p>
          ${p.url ? `<span class="cv-muted cv-proj-url">${escapeHTML(p.url)}</span>` : ""}
        </div>
        ${p.description ? `<p class="cv-body">${escapeText(p.description)}</p>` : ""}
      </li>
    `,
    )
    .join("");
  return `
    <section class="cv-section">
      <h2 class="cv-heading">Projekty</h2>
      <ul class="cv-list cv-proj-list">${items}</ul>
    </section>
  `;
}

function renderOrbitBody(cv: CVData): string {
  return `
    ${renderOrbitHeader(cv)}
    <div class="cv-sep"></div>
    <div class="cv-grid">
      <div class="cv-col cv-col-left">
        ${cv.settings.showProfile ? renderOrbitProfile(cv) : ""}
        ${cv.settings.showEducation ? renderOrbitEducation(cv) : ""}
        ${cv.settings.showSkills ? renderOrbitKeySkills(cv) : ""}
        ${renderOrbitLanguages(cv)}
        ${cv.settings.showCertifications ? renderSharedCertifications(cv) : ""}
        ${cv.settings.showHobbies ? renderSharedHobbies(cv) : ""}
      </div>
      <div class="cv-col cv-col-gap" aria-hidden="true"></div>
      <div class="cv-col cv-col-right">
        ${cv.settings.showEmployment ? renderOrbitEmployment(cv) : ""}
        ${renderOrbitProjects(cv)}
        ${cv.settings.showVolunteer ? renderSharedVolunteer(cv) : ""}
        ${cv.settings.showPublications ? renderSharedPublications(cv) : ""}
        ${cv.settings.showAwards ? renderSharedAwards(cv) : ""}
        ${cv.settings.showConferences ? renderSharedConferences(cv) : ""}
        ${cv.settings.showReferences ? renderSharedReferences(cv) : ""}
        ${renderSharedCustomSections(cv)}
      </div>
    </div>
  `;
}

// ─── SHARED RENDERERS (used by all templates with section-local styling) ─────

function renderSharedCertifications(cv: CVData): string {
  if (cv.certifications.length === 0) return "";
  const items = cv.certifications
    .map((c) => {
      const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
      return `
        <li class="cv-cert-item">
          <div class="cv-cert-head">
            <span class="cv-strong">${escapeHTML(c.name)}</span>
            ${date ? `<span class="cv-muted cv-small">${escapeHTML(date)}</span>` : ""}
          </div>
          ${c.issuer ? `<p class="cv-body cv-muted">${escapeHTML(c.issuer)}</p>` : ""}
          ${c.credentialId ? `<p class="cv-body cv-small cv-muted">ID: ${escapeHTML(c.credentialId)}</p>` : ""}
          ${c.url ? `<p class="cv-body cv-small cv-muted">${escapeHTML(c.url)}</p>` : ""}
        </li>
      `;
    })
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Certyfikaty</h2><ul class="cv-list cv-list-stack">${items}</ul></section>`;
}

function renderSharedVolunteer(cv: CVData): string {
  if (cv.volunteer.length === 0) return "";
  const items = cv.volunteer
    .map((v) => {
      const years = renderOrbitYears(v.startYear, v.startMonth, v.endYear, v.endMonth, v.current);
      return `
        <li class="cv-emp-item">
          <div class="cv-years">${years}</div>
          <div class="cv-emp-body">
            ${v.role ? `<p class="cv-strong">${escapeHTML(v.role)}</p>` : ""}
            ${v.organization ? `<p class="cv-body">${escapeHTML(v.organization)}</p>` : ""}
            ${v.description ? `<p class="cv-body cv-emp-desc">${escapeText(v.description)}</p>` : ""}
          </div>
        </li>
      `;
    })
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Wolontariat</h2><ul class="cv-list cv-emp-list">${items}</ul></section>`;
}

function renderSharedPublications(cv: CVData): string {
  if (cv.publications.length === 0) return "";
  const items = cv.publications
    .map(
      (p) => `
      <li class="cv-pub-item">
        <div class="cv-pub-head">
          <span class="cv-strong cv-italic">${escapeHTML(p.title)}</span>
          ${p.year ? `<span class="cv-muted cv-small">${escapeHTML(p.year)}</span>` : ""}
        </div>
        ${p.authors ? `<p class="cv-body cv-small cv-muted">${escapeHTML(p.authors)}</p>` : ""}
        ${p.venue ? `<p class="cv-body cv-small">${escapeHTML(p.venue)}</p>` : ""}
        ${p.description ? `<p class="cv-body">${escapeText(p.description)}</p>` : ""}
        ${p.url ? `<p class="cv-body cv-small cv-muted">${escapeHTML(p.url)}</p>` : ""}
      </li>
    `,
    )
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Publikacje</h2><ul class="cv-list cv-list-stack">${items}</ul></section>`;
}

function renderSharedAwards(cv: CVData): string {
  if (cv.awards.length === 0) return "";
  const items = cv.awards
    .map(
      (a) => `
      <li class="cv-award-item">
        <div class="cv-award-head">
          <span class="cv-strong">${escapeHTML(a.title)}</span>
          ${a.year ? `<span class="cv-muted cv-small">${escapeHTML(a.year)}</span>` : ""}
        </div>
        ${a.issuer ? `<p class="cv-body cv-muted">${escapeHTML(a.issuer)}</p>` : ""}
        ${a.description ? `<p class="cv-body">${escapeText(a.description)}</p>` : ""}
      </li>
    `,
    )
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Nagrody i wyróżnienia</h2><ul class="cv-list cv-list-stack">${items}</ul></section>`;
}

function renderSharedConferences(cv: CVData): string {
  if (cv.conferences.length === 0) return "";
  const items = cv.conferences
    .map((c) => {
      const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
      return `
        <li class="cv-conf-item">
          <div class="cv-conf-head">
            <span class="cv-strong">${escapeHTML(c.title)}</span>
            ${date ? `<span class="cv-muted cv-small">${escapeHTML(date)}</span>` : ""}
          </div>
          ${c.event ? `<p class="cv-body cv-muted">${escapeHTML(c.event)}${c.role ? ` — ${escapeHTML(c.role)}` : ""}</p>` : ""}
          ${c.description ? `<p class="cv-body">${escapeText(c.description)}</p>` : ""}
          ${c.url ? `<p class="cv-body cv-small cv-muted">${escapeHTML(c.url)}</p>` : ""}
        </li>
      `;
    })
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Konferencje i prelekcje</h2><ul class="cv-list cv-list-stack">${items}</ul></section>`;
}

function renderSharedHobbies(cv: CVData): string {
  if (cv.hobbies.length === 0) return "";
  const tags = cv.hobbies.map((h) => `<li class="cv-hobby-tag">${escapeHTML(h)}</li>`).join("");
  return `<section class="cv-section"><h2 class="cv-heading">Zainteresowania</h2><ul class="cv-hobbies">${tags}</ul></section>`;
}

function renderSharedReferences(cv: CVData): string {
  if (cv.references.length === 0) return "";
  const items = cv.references
    .map(
      (r) => `
      <li class="cv-ref-item">
        ${r.name ? `<p class="cv-strong">${escapeHTML(r.name)}</p>` : ""}
        ${r.title || r.company ? `<p class="cv-body cv-muted">${escapeHTML(r.title)}${r.title && r.company ? " · " : ""}${escapeHTML(r.company)}</p>` : ""}
        ${r.relation ? `<p class="cv-body cv-small cv-muted cv-italic">${escapeHTML(r.relation)}</p>` : ""}
        ${r.contact ? `<p class="cv-body cv-small">${escapeHTML(r.contact)}</p>` : ""}
      </li>
    `,
    )
    .join("");
  return `<section class="cv-section"><h2 class="cv-heading">Referencje</h2><ul class="cv-list cv-list-stack">${items}</ul></section>`;
}

function renderSharedCustomSections(cv: CVData): string {
  if (cv.customSections.length === 0) return "";
  return cv.customSections
    .map((s) => {
      let body = "";
      if (s.layout === "list") {
        const items = s.items
          .map(
            (it) => `
          <li class="cv-custom-item">
            <div class="cv-custom-head">
              <span class="cv-strong">${escapeHTML(it.primary)}</span>
              ${it.secondary ? `<span class="cv-muted cv-small">${escapeHTML(it.secondary)}</span>` : ""}
            </div>
            ${it.body ? `<p class="cv-body">${escapeText(it.body)}</p>` : ""}
          </li>
        `,
          )
          .join("");
        body = `<ul class="cv-list cv-list-stack">${items}</ul>`;
      } else if (s.layout === "paragraph") {
        body = s.paragraph ? `<p class="cv-body">${escapeText(s.paragraph)}</p>` : "";
      } else if (s.layout === "tags") {
        const tags = s.tags.map((t) => `<li class="cv-hobby-tag">${escapeHTML(t)}</li>`).join("");
        body = `<ul class="cv-hobbies">${tags}</ul>`;
      }
      return `<section class="cv-section"><h2 class="cv-heading">${escapeHTML(s.title)}</h2>${body}</section>`;
    })
    .join("");
}

function orbitStylesheet(): string {
  return `
    .cv-header { display: grid; grid-template-columns: auto 1fr auto; gap: 6mm; align-items: start; }
    .cv-photo { width: 22mm; height: 22mm; overflow: hidden; border: 1px solid #d9d9d9; background: #ededed; flex-shrink: 0; }
    .cv-photo--circle { border-radius: 999px; }
    .cv-photo--square { border-radius: 2mm; }
    .cv-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cv-header-name { padding-top: 1mm; min-width: 0; }
    .cv-name { font-size: 2.7em; font-weight: 700; line-height: 1.0; letter-spacing: -0.01em; }
    .cv-name span { display: block; }
    .cv-role { margin-top: 1.5mm; color: #4d5058; font-size: 1.05em; }
    .cv-contact { font-style: normal; display: flex; flex-direction: column; align-items: flex-end; gap: 0.4em; text-align: right; font-size: 0.95em; padding-top: 3mm; }
    .cv-contact span { display: block; }

    .cv-sep { margin: 8mm 0 7mm; height: 1px; background: #d9d9d9; }

    .cv-grid { display: grid; grid-template-columns: 38% 4% 58%; }
    .cv-col { display: flex; flex-direction: column; gap: 6mm; min-width: 0; }
    .cv-section { break-inside: avoid; }

    .cv-heading { font-size: 1.2em; font-weight: 700; letter-spacing: -0.005em; line-height: 1.25; margin-bottom: 1.2em; }
    .cv-subheading { font-size: 1em; font-weight: 600; margin-bottom: 0.6em; }
    .cv-body { font-size: 1em; line-height: 1.5; }
    .cv-strong { font-weight: 600; font-size: 1em; line-height: 1.35; }
    .cv-muted { color: #4d5058; }

    .cv-years { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1em; font-size: 0.9em; color: #4d5058; font-variant-numeric: tabular-nums; line-height: 1.2; }
    .cv-years--current { align-items: center; text-align: center; }
    .cv-year-sep { font-size: 0.9em; }

    .cv-list { display: flex; flex-direction: column; }
    .cv-edu-list { gap: 1.1em; }
    .cv-edu-item { display: grid; grid-template-columns: 28% 1fr; gap: 0.5em; }

    .cv-emp-list { gap: 1.4em; }
    .cv-emp-item { display: grid; grid-template-columns: 18% 1fr; gap: 1em; }
    .cv-emp-desc { margin-top: 0.5em; }

    .cv-skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8em; }
    .cv-skills { gap: 0.35em; }
    .cv-skills li { font-size: 1em; }

    .cv-lang-list { gap: 0.5em; }
    .cv-lang-item { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; font-size: 1em; }

    .cv-proj-list { gap: 1em; }
    .cv-proj-item { display: flex; flex-direction: column; }
    .cv-proj-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; }
    .cv-proj-url { font-size: 0.9em; }

    /* Shared new-section styles */
    .cv-list-stack { gap: 0.9em; }
    .cv-small { font-size: 0.9em; }
    .cv-italic { font-style: italic; }
    .cv-cert-item,
    .cv-pub-item,
    .cv-award-item,
    .cv-conf-item,
    .cv-ref-item,
    .cv-custom-item { display: flex; flex-direction: column; gap: 0.15em; }
    .cv-cert-head,
    .cv-pub-head,
    .cv-award-head,
    .cv-conf-head,
    .cv-custom-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; }
    .cv-hobbies { display: flex; flex-wrap: wrap; gap: 0.4em 0.6em; }
    .cv-hobby-tag { padding: 0.2em 0.6em; border: 1px solid #d9d9d9; border-radius: 999px; font-size: 0.9em; }
  `;
}

// ─── ATLAS ───────────────────────────────────────────────────────────────────

const ATLAS_ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5h18v11H3z"/><path d="M3 7l9 6 9-6"/></svg>`,
  address: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`,
};

function renderAtlasYears(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  current: boolean,
): string {
  const start = formatDatePart(startMonth, startYear);
  const tail = current ? "obecnie" : formatDatePart(endMonth, endYear);
  if (!start && !tail) return "";
  if (!start) return escapeHTML(tail);
  if (!tail) return escapeHTML(start);
  return `${escapeHTML(start)} – ${escapeHTML(tail)}`;
}

function renderAtlasHeader(cv: CVData): string {
  const { personal, settings } = cv;
  const atlasShapeCls = settings.photoShape === "circle" ? " atlas-photo--circle" : "";
  const photoHTML = settings.photoShape === "none"
    ? ""
    : personal.photo
      ? `<div class="atlas-photo${atlasShapeCls}"><img src="${escapeHTML(personal.photo)}" alt="" /></div>`
      : `<div class="atlas-photo atlas-photo--empty${atlasShapeCls}"></div>`;

  const c = contactFieldsVisible(cv);
  const lines: string[] = [];
  if (c.email) lines.push(`<li><span class="atlas-ico">${ATLAS_ICONS.email}</span><span>${escapeHTML(c.email)}</span></li>`);
  if (c.address) lines.push(`<li><span class="atlas-ico">${ATLAS_ICONS.address}</span><span>${escapeText(c.address)}</span></li>`);
  if (c.website) lines.push(`<li><span class="atlas-ico">${ATLAS_ICONS.website}</span><span>${escapeHTML(c.website)}</span></li>`);
  if (c.phone) lines.push(`<li><span class="atlas-ico">${ATLAS_ICONS.phone}</span><span>${escapeHTML(c.phone)}</span></li>`);

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).map((p) => escapeHTML(p)).join(" ");

  return `
    <header class="atlas-header">
      ${photoHTML}
      <div class="atlas-head-text">
        ${personal.role ? `<p class="atlas-role">${escapeHTML(personal.role)}</p>` : ""}
        <h1 class="atlas-name">${fullName}</h1>
        ${lines.length ? `<ul class="atlas-contact">${lines.join("")}</ul>` : ""}
      </div>
    </header>
  `;
}

function renderAtlasProfile(cv: CVData): string {
  if (!cv.profile.trim()) return "";
  return `
    <section class="atlas-section">
      <h2 class="atlas-heading">Profil</h2>
      <p class="atlas-body">${escapeText(cv.profile)}</p>
    </section>
  `;
}

function renderAtlasSkills(cv: CVData): string {
  const merged = [...cv.skills.professional, ...cv.skills.personal];
  if (merged.length === 0) return "";
  const mid = Math.ceil(merged.length / 2);
  const renderCol = (items: string[]) =>
    `<ul class="atlas-skills-col">${items.map((s) => `<li><span class="atlas-dot"></span><span>${escapeHTML(s)}</span></li>`).join("")}</ul>`;
  return `
    <section class="atlas-section">
      <h2 class="atlas-heading">Umiejętności</h2>
      <div class="atlas-skills">
        ${renderCol(merged.slice(0, mid))}
        ${renderCol(merged.slice(mid))}
      </div>
    </section>
  `;
}

function renderAtlasEducation(cv: CVData): string {
  if (cv.education.length === 0) return "";
  const items = cv.education
    .map(
      (e) => `
      <li class="atlas-edu-item">
        <span class="atlas-years">${renderAtlasYears(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current) || "—"}</span>
        <div class="atlas-edu-body">
          ${e.school ? `<p class="atlas-strong">${escapeHTML(e.school)}</p>` : ""}
          ${e.degree ? `<p class="atlas-muted atlas-small">${escapeText(e.degree)}</p>` : ""}
        </div>
        <span class="atlas-location">${escapeHTML(e.location ?? "")}</span>
      </li>
    `,
    )
    .join("");
  return `
    <section class="atlas-section">
      <div class="atlas-heading-wrap">
        <h2 class="atlas-heading">Edukacja</h2>
        <div class="atlas-underline"></div>
      </div>
      <ul class="atlas-list atlas-edu-list">${items}</ul>
    </section>
  `;
}

function renderAtlasEmployment(cv: CVData): string {
  if (cv.employment.length === 0) return "";
  const items = cv.employment
    .map((e) => {
      const headParts: string[] = [];
      if (e.position) headParts.push(`<span class="atlas-strong">${escapeHTML(e.position)}</span>`);
      if (e.company) {
        headParts.push(`<span class="atlas-muted">w</span><span class="atlas-strong">${escapeHTML(e.company)}</span>`);
      }
      return `
      <li class="atlas-emp-item">
        <span class="atlas-years">${renderAtlasYears(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current) || "—"}</span>
        <div class="atlas-emp-body">
          <div class="atlas-emp-head">${headParts.join(" ")}</div>
          ${e.description ? `<p class="atlas-muted atlas-small atlas-emp-desc">${escapeText(e.description)}</p>` : ""}
        </div>
        <span class="atlas-location">${escapeHTML(e.location ?? "")}</span>
      </li>
    `;
    })
    .join("");
  return `
    <section class="atlas-section">
      <div class="atlas-heading-wrap">
        <h2 class="atlas-heading">Doświadczenie zawodowe</h2>
        <div class="atlas-underline"></div>
      </div>
      <ul class="atlas-list atlas-emp-list">${items}</ul>
    </section>
  `;
}

function renderAtlasLanguages(cv: CVData): string {
  if (!cv.settings.showLanguages || cv.languages.length === 0) return "";
  const items = cv.languages
    .map(
      (l) => `
      <li class="atlas-lang-item">
        <span class="atlas-strong">${escapeHTML(l.name)}</span>
        <span class="atlas-muted">${escapeHTML(LANGUAGE_LABELS[l.level] ?? l.level)}</span>
      </li>
    `,
    )
    .join("");
  return `
    <section class="atlas-section">
      <div class="atlas-heading-wrap">
        <h2 class="atlas-heading">Języki</h2>
        <div class="atlas-underline"></div>
      </div>
      <ul class="atlas-list">${items}</ul>
    </section>
  `;
}

function renderAtlasProjects(cv: CVData): string {
  if (!cv.settings.showProjects || cv.projects.length === 0) return "";
  const items = cv.projects
    .map(
      (p) => `
      <li class="atlas-proj-item">
        <div class="atlas-proj-head">
          <p class="atlas-strong">${escapeHTML(p.name)}</p>
          ${p.url ? `<span class="atlas-muted">${escapeHTML(p.url)}</span>` : ""}
        </div>
        ${p.description ? `<p class="atlas-muted atlas-small">${escapeText(p.description)}</p>` : ""}
      </li>
    `,
    )
    .join("");
  return `
    <section class="atlas-section">
      <div class="atlas-heading-wrap">
        <h2 class="atlas-heading">Projekty</h2>
        <div class="atlas-underline"></div>
      </div>
      <ul class="atlas-list">${items}</ul>
    </section>
  `;
}

function renderAtlasBody(cv: CVData): string {
  const showTwoCol = cv.settings.showProfile || cv.settings.showSkills;
  return `
    ${renderAtlasHeader(cv)}
    ${showTwoCol ? `
    <div class="atlas-two-col">
      <div class="atlas-profile-col">${cv.settings.showProfile ? renderAtlasProfile(cv) : ""}</div>
      <div class="atlas-skills-col-wrap">${cv.settings.showSkills ? renderAtlasSkills(cv) : ""}</div>
    </div>
    ` : ""}
    ${cv.settings.showEducation ? renderAtlasEducation(cv) : ""}
    ${cv.settings.showEmployment ? renderAtlasEmployment(cv) : ""}
    ${renderAtlasLanguages(cv)}
    ${renderAtlasProjects(cv)}
    ${cv.settings.showCertifications ? renderSharedCertifications(cv) : ""}
    ${cv.settings.showVolunteer ? renderSharedVolunteer(cv) : ""}
    ${cv.settings.showPublications ? renderSharedPublications(cv) : ""}
    ${cv.settings.showAwards ? renderSharedAwards(cv) : ""}
    ${cv.settings.showConferences ? renderSharedConferences(cv) : ""}
    ${cv.settings.showHobbies ? renderSharedHobbies(cv) : ""}
    ${cv.settings.showReferences ? renderSharedReferences(cv) : ""}
    ${renderSharedCustomSections(cv)}
  `;
}

function atlasStylesheet(): string {
  return `
    .atlas { color: #0f1a2a; }
    .atlas .atlas-header { display: flex; gap: 7mm; align-items: flex-start; }
    .atlas .atlas-photo { width: 28mm; height: 28mm; overflow: hidden; border-radius: 2mm; background: #f1f3f6; flex-shrink: 0; }
    .atlas .atlas-photo--circle { border-radius: 999px; }
    .atlas .atlas-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .atlas .atlas-photo--empty { background: #f1f3f6; }
    .atlas .atlas-head-text { flex: 1; min-width: 0; padding-top: 1mm; }
    .atlas .atlas-role { font-size: 0.9em; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.5mm; }
    .atlas .atlas-name { font-size: 2.6em; font-weight: 700; letter-spacing: -0.02em; line-height: 1.04; color: #0f1a2a; margin-bottom: 3mm; }
    .atlas .atlas-contact { font-size: 0.92em; display: flex; flex-direction: column; gap: 1.1mm; margin-top: 1.5mm; }
    .atlas .atlas-contact li { display: flex; align-items: center; gap: 2.3mm; color: #0f1a2a; }
    .atlas .atlas-ico { display: inline-flex; align-items: center; justify-content: center; width: 4.2mm; height: 4.2mm; border: 1px solid #2563eb; color: #2563eb; border-radius: 999px; flex-shrink: 0; }
    .atlas .atlas-ico svg { width: 2.6mm; height: 2.6mm; }

    .atlas .atlas-two-col { display: grid; grid-template-columns: 38% 1fr; gap: 8mm; margin-top: 8mm; }

    .atlas .atlas-section { break-inside: avoid; }
    .atlas .atlas-heading-wrap { margin-bottom: 0.9em; }
    .atlas .atlas-heading-wrap .atlas-heading { margin-bottom: 0.4em; }
    .atlas .atlas-heading { font-size: 1.2em; font-weight: 700; color: #0f1a2a; line-height: 1.25; letter-spacing: -0.005em; margin-bottom: 0.9em; }
    .atlas .atlas-underline { height: 1px; background: #e5e7eb; width: 100%; }
    .atlas .atlas-body { font-size: 1em; line-height: 1.5; color: #0f1a2a; }
    .atlas .atlas-muted { color: #4b5563; }
    .atlas .atlas-strong { font-weight: 600; }
    .atlas .atlas-small { font-size: 0.95em; }

    .atlas .atlas-skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1em; }
    .atlas .atlas-skills-col { display: flex; flex-direction: column; gap: 0.45em; }
    .atlas .atlas-skills-col li { display: flex; align-items: center; gap: 0.55em; font-size: 1em; }
    .atlas .atlas-dot { display: inline-block; width: 0.55em; height: 0.55em; border-radius: 999px; border: 1.5px solid #2563eb; flex-shrink: 0; }

    .atlas section + section,
    .atlas .atlas-two-col + section { margin-top: 7mm; }

    .atlas .atlas-list { display: flex; flex-direction: column; }
    .atlas .atlas-edu-list { gap: 1em; }
    .atlas .atlas-emp-list { gap: 1.1em; }
    .atlas .atlas-edu-item,
    .atlas .atlas-emp-item { display: grid; grid-template-columns: 18% 1fr 18%; gap: 1em; align-items: start; }
    .atlas .atlas-years { font-size: 0.9em; font-weight: 500; color: #2563eb; font-variant-numeric: tabular-nums; line-height: 1.35; }
    .atlas .atlas-location { font-size: 0.9em; color: #4b5563; text-align: right; line-height: 1.35; }
    .atlas .atlas-edu-body p + p { margin-top: 0.15em; }
    .atlas .atlas-emp-head { display: flex; flex-wrap: wrap; gap: 0.35em; align-items: baseline; font-size: 1em; font-weight: 600; }
    .atlas .atlas-emp-desc { margin-top: 0.45em; line-height: 1.5; }

    .atlas .atlas-lang-item { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; font-size: 1em; padding: 0.15em 0; }
    .atlas .atlas-proj-item { display: flex; flex-direction: column; gap: 0.25em; padding: 0.3em 0; }
    .atlas .atlas-proj-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; }
  `;
}

// ─── TERRA ───────────────────────────────────────────────────────────────────

const TERRA_ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"/></svg>`,
  address: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z"/><path d="M6 17h12"/></svg>`,
};

function renderTerraDates(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  current: boolean,
): string {
  const start = formatDatePart(startMonth, startYear);
  const tail = current ? "obecnie" : formatDatePart(endMonth, endYear);
  if (!start && !tail) return "";
  if (!start) return escapeHTML(tail);
  if (!tail) return escapeHTML(start);
  return `${escapeHTML(start)} – ${escapeHTML(tail)}`;
}

function renderTerraHeader(cv: CVData): string {
  const { personal, settings } = cv;
  const c = contactFieldsVisible(cv);
  const terraShapeCls = settings.photoShape === "square" ? " terra-photo--square" : "";
  const photoHTML = settings.photoShape === "none"
    ? ""
    : personal.photo
      ? `<div class="terra-photo${terraShapeCls}"><img src="${escapeHTML(personal.photo)}" alt="" /></div>`
      : `<div class="terra-photo terra-photo--empty${terraShapeCls}"></div>`;
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).map(escapeHTML).join(" ");
  const contactLines: string[] = [];
  if (c.email) contactLines.push(`<li><span class="terra-ico">${TERRA_ICONS.email}</span><span>${escapeHTML(c.email)}</span></li>`);
  if (c.website) contactLines.push(`<li><span class="terra-ico">${TERRA_ICONS.website}</span><span>${escapeHTML(c.website)}</span></li>`);
  if (c.address) contactLines.push(`<li><span class="terra-ico">${TERRA_ICONS.address}</span><span>${escapeText(c.address)}</span></li>`);
  if (c.phone) contactLines.push(`<li><span class="terra-ico">${TERRA_ICONS.phone}</span><span>${escapeHTML(c.phone)}</span></li>`);

  return `
    <header class="terra-header">
      <div class="terra-head-row">
        ${photoHTML}
        <div class="terra-head-text">
          <h1 class="terra-name terra-serif">${fullName || "&nbsp;"}</h1>
          ${personal.role ? `<p class="terra-role">${escapeHTML(personal.role)}</p>` : ""}
        </div>
      </div>
      <div class="terra-hrule"></div>
      ${contactLines.length ? `<ul class="terra-contact">${contactLines.join("")}</ul>` : ""}
    </header>
  `;
}

function renderTerraProfile(cv: CVData): string {
  if (!cv.profile.trim()) return "";
  return `<section class="terra-profile-box"><p class="terra-profile-text">${escapeText(cv.profile)}</p></section>`;
}

function renderTerraEmployment(cv: CVData): string {
  if (cv.employment.length === 0) return "";
  const last = cv.employment.length - 1;
  const items = cv.employment
    .map((e, idx) => {
      const dates = renderTerraDates(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current);
      const bullets = e.description
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const body = bullets.length > 1
        ? `<ul class="terra-emp-bullets">${bullets.map((b) => `<li>${escapeHTML(b)}</li>`).join("")}</ul>`
        : e.description
          ? `<p class="terra-emp-text">${escapeText(e.description)}</p>`
          : "";
      return `
        <li class="terra-emp-item">
          <div class="terra-emp-head">
            <h3 class="terra-serif terra-emp-title">${escapeHTML(e.position || "")}</h3>
            ${e.company ? `<span class="terra-emp-meta"><span class="terra-ico-sm">${TERRA_ICONS.briefcase}</span>${escapeHTML(e.company)}</span>` : ""}
            ${dates ? `<span class="terra-emp-dates"><span class="terra-ico-sm">${TERRA_ICONS.calendar}</span>${dates}</span>` : ""}
          </div>
          ${body}
          ${e.location ? `<p class="terra-emp-loc">${escapeHTML(e.location)}</p>` : ""}
          ${idx < last ? `<div class="terra-hrule terra-hrule--item"></div>` : ""}
        </li>
      `;
    })
    .join("");
  return `
    <section class="terra-section">
      <h2 class="terra-heading">Doświadczenie</h2>
      <ul class="terra-list">${items}</ul>
    </section>
  `;
}

function renderTerraEducation(cv: CVData): string {
  if (cv.education.length === 0) return "";
  const items = cv.education
    .map((e) => {
      const dates = renderTerraDates(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current);
      return `
        <li class="terra-edu-item">
          <p class="terra-serif terra-edu-title">${escapeHTML(e.degree || "")}</p>
          <div class="terra-edu-meta">
            ${e.school ? `<span class="terra-edu-school"><span class="terra-ico-sm">${TERRA_ICONS.book}</span>${escapeHTML(e.school)}</span>` : ""}
            ${dates ? `<span class="terra-edu-dates"><span class="terra-ico-sm">${TERRA_ICONS.calendar}</span>${dates}</span>` : ""}
          </div>
          ${e.location ? `<p class="terra-edu-loc">${escapeHTML(e.location)}</p>` : ""}
        </li>
      `;
    })
    .join("");
  return `
    <section class="terra-section">
      <h2 class="terra-heading">Edukacja</h2>
      <ul class="terra-list">${items}</ul>
    </section>
  `;
}

function renderTerraSkills(cv: CVData): string {
  const { professional, personal } = cv.skills;
  const languages = cv.languages;
  const showLanguages = cv.settings.showLanguages;
  const hasAny = professional.length > 0 || personal.length > 0 || (showLanguages && languages.length > 0);
  if (!hasAny) return "";

  const langs = languages
    .map((l) => {
      const level = LANGUAGE_LABELS[l.level]?.split(" — ")[0] ?? l.level;
      return l.name ? `${escapeHTML(l.name)} (${escapeHTML(level)})` : "";
    })
    .filter(Boolean)
    .join(", ");

  const group = (heading: string, items: string[]) => {
    if (items.length === 0) return "";
    return `
      <div class="terra-skill-group">
        <h3 class="terra-serif terra-skill-heading">${heading}</h3>
        <p class="terra-skill-body">${items.map(escapeHTML).join(", ")}</p>
      </div>
    `;
  };

  return `
    <section class="terra-section">
      <h2 class="terra-heading">Umiejętności</h2>
      <div class="terra-skill-stack">
        ${group("Zawodowe", professional)}
        ${group("Osobiste", personal)}
        ${showLanguages && langs ? `<div class="terra-skill-group"><h3 class="terra-serif terra-skill-heading">Języki</h3><p class="terra-skill-body">${langs}</p></div>` : ""}
      </div>
    </section>
  `;
}

function renderTerraBody(cv: CVData): string {
  const showSplit = cv.settings.showSkills || cv.settings.showEducation;
  return `
    ${renderTerraHeader(cv)}
    ${cv.settings.showProfile ? renderTerraProfile(cv) : ""}
    ${cv.settings.showEmployment ? renderTerraEmployment(cv) : ""}
    ${showSplit ? `
    <div class="terra-hrule terra-hrule--split"></div>
    <div class="terra-two-col">
      <div>${cv.settings.showSkills ? renderTerraSkills(cv) : ""}</div>
      <div>${cv.settings.showEducation ? renderTerraEducation(cv) : ""}</div>
    </div>
    ` : ""}
    ${cv.settings.showProjects ? renderOrbitProjects(cv) : ""}
    ${cv.settings.showCertifications ? renderSharedCertifications(cv) : ""}
    ${cv.settings.showVolunteer ? renderSharedVolunteer(cv) : ""}
    ${cv.settings.showPublications ? renderSharedPublications(cv) : ""}
    ${cv.settings.showAwards ? renderSharedAwards(cv) : ""}
    ${cv.settings.showConferences ? renderSharedConferences(cv) : ""}
    ${cv.settings.showHobbies ? renderSharedHobbies(cv) : ""}
    ${cv.settings.showReferences ? renderSharedReferences(cv) : ""}
    ${renderSharedCustomSections(cv)}
  `;
}

function terraStylesheet(): string {
  return `
    .terra { color: #1e1813; background: #faf5ee; }
    .terra .terra-serif { font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; font-feature-settings: "kern", "liga"; }

    .terra .terra-header { }
    .terra .terra-head-row { display: flex; align-items: center; gap: 6mm; }
    .terra .terra-photo { width: 22mm; height: 22mm; border-radius: 999px; overflow: hidden; background: #ecdcc8; flex-shrink: 0; }
    .terra .terra-photo--square { border-radius: 2mm; }
    .terra .terra-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .terra .terra-head-text { min-width: 0; }
    .terra .terra-name { font-style: italic; font-weight: 400; font-size: 2.75em; line-height: 1.0; letter-spacing: -0.015em; color: #1e1813; }
    .terra .terra-role { margin-top: 1.5mm; font-size: 0.82em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.22em; color: #b85a3e; }

    .terra .terra-hrule { height: 1px; background: #dfd4c2; margin: 5mm 0 3.5mm; }
    .terra .terra-hrule--item { margin: 5mm 0 0; }
    .terra .terra-hrule--split { margin: 6mm 0; }

    .terra .terra-contact { display: flex; flex-wrap: wrap; gap: 1.5mm 6mm; font-size: 0.9em; color: #1e1813; }
    .terra .terra-contact li { display: inline-flex; align-items: center; gap: 1.5mm; }
    .terra .terra-ico { display: inline-flex; width: 3mm; height: 3mm; color: #1e1813; }
    .terra .terra-ico svg { width: 100%; height: 100%; }
    .terra .terra-ico-sm { display: inline-flex; width: 2.8mm; height: 2.8mm; color: #544a41; margin-right: 1mm; }
    .terra .terra-ico-sm svg { width: 100%; height: 100%; }

    .terra .terra-profile-box { margin-top: 6mm; border-radius: 3mm; background: #ecdcc8; padding: 4mm 5mm; }
    .terra .terra-profile-text { font-size: 0.97em; line-height: 1.55; color: #1e1813; }

    .terra .terra-section { margin-top: 7mm; break-inside: avoid; }
    .terra .terra-heading { font-size: 0.88em; font-weight: 600; color: #b85a3e; text-transform: uppercase; letter-spacing: 0.22em; margin-bottom: 1em; }

    .terra .terra-list { display: flex; flex-direction: column; gap: 5mm; }
    .terra .terra-emp-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 1mm 5mm; }
    .terra .terra-emp-title { font-style: italic; font-weight: 400; font-size: 1.18em; line-height: 1.2; color: #1e1813; margin: 0; }
    .terra .terra-emp-meta { display: inline-flex; align-items: center; font-size: 0.92em; color: #544a41; }
    .terra .terra-emp-dates { display: inline-flex; align-items: center; font-size: 0.92em; color: #544a41; margin-left: auto; font-variant-numeric: tabular-nums; }
    .terra .terra-emp-bullets { margin-top: 2.5mm; padding-left: 1.2em; display: flex; flex-direction: column; gap: 0.35em; font-size: 0.95em; line-height: 1.55; }
    .terra .terra-emp-bullets li { list-style: disc; color: #1e1813; }
    .terra .terra-emp-text { margin-top: 2mm; font-size: 0.95em; line-height: 1.55; color: #1e1813; white-space: pre-line; }
    .terra .terra-emp-loc { margin-top: 2mm; font-size: 0.88em; font-style: italic; color: #544a41; }

    .terra .terra-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
    .terra .terra-two-col .terra-section { margin-top: 0; }

    .terra .terra-edu-item + .terra-edu-item { margin-top: 4mm; }
    .terra .terra-edu-title { font-style: italic; font-weight: 400; font-size: 1.08em; line-height: 1.2; color: #1e1813; }
    .terra .terra-edu-meta { margin-top: 1.5mm; display: flex; flex-wrap: wrap; align-items: center; gap: 0.5mm 3mm; font-size: 0.92em; color: #544a41; }
    .terra .terra-edu-school { display: inline-flex; align-items: center; }
    .terra .terra-edu-dates { display: inline-flex; align-items: center; margin-left: auto; font-variant-numeric: tabular-nums; }
    .terra .terra-edu-loc { margin-top: 0.5mm; font-size: 0.85em; font-style: italic; color: #8c8070; }

    .terra .terra-skill-stack { display: flex; flex-direction: column; gap: 4mm; }
    .terra .terra-skill-heading { font-style: italic; font-weight: 400; font-size: 1.02em; line-height: 1.25; color: #1e1813; }
    .terra .terra-skill-body { margin-top: 1.2mm; font-size: 0.92em; line-height: 1.45; color: #544a41; }

    .terra .cv-rodo { color: #544a41; border-top-color: #dfd4c2; }
    .terra-page-bg { background: #faf5ee; }
  `;
}

// ─── LUMEN ───────────────────────────────────────────────────────────────────

const LUMEN_COLORS = {
  bg: "#ffffff",
  ink: "#0a0c10",
  muted: "#4b5563",
  mutedSoft: "#8a919e",
  line: "#e7e8ec",
  lineSoft: "#f3f4f6",
};

function lumenDates(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  current: boolean,
): string {
  const start = formatDatePart(startMonth, startYear);
  const tail = current ? "obecnie" : formatDatePart(endMonth, endYear);
  if (!start && !tail) return "";
  if (!start) return escapeHTML(tail);
  if (!tail) return escapeHTML(start);
  return `${escapeHTML(start)} — ${escapeHTML(tail)}`;
}

function renderLumenHeader(cv: CVData): string {
  const { personal } = cv;
  const fullName = `${escapeHTML(personal.firstName)} ${escapeHTML(personal.lastName)}`.trim();
  const showPhoto = cv.settings.photoShape !== "none";
  const photoClass = cv.settings.photoShape === "circle" ? "lumen-photo lumen-photo--circle" : "lumen-photo";
  const photoBlock = showPhoto
    ? personal.photo
      ? `<div class="${photoClass}"><img src="${escapeHTML(personal.photo)}" alt="${escapeHTML(fullName) || "Zdjęcie"}"/></div>`
      : `<div class="${photoClass} lumen-photo--empty"></div>`
    : "";

  const fields = contactFieldsVisible(cv);
  const contactItems: string[] = [];
  if (fields.address) contactItems.push(`<div class="lumen-contact-item"><p class="lumen-contact-label">Adres</p><p class="lumen-contact-value">${escapeHTML(fields.address)}</p></div>`);
  if (fields.phone) contactItems.push(`<div class="lumen-contact-item"><p class="lumen-contact-label">Telefon</p><p class="lumen-contact-value">${escapeHTML(fields.phone)}</p></div>`);
  if (fields.email) contactItems.push(`<div class="lumen-contact-item"><p class="lumen-contact-label">Email</p><p class="lumen-contact-value">${escapeHTML(fields.email)}</p></div>`);
  if (fields.website) contactItems.push(`<div class="lumen-contact-item"><p class="lumen-contact-label">Strona</p><p class="lumen-contact-value">${escapeHTML(fields.website)}</p></div>`);

  const cols = Math.min(contactItems.length, 3);
  const contactRow = contactItems.length
    ? `<div class="lumen-contact" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr));">${contactItems.join("")}</div>`
    : "";

  return `
    <header class="lumen-header">
      ${photoBlock}
      <h1 class="lumen-name">${fullName || ""}</h1>
      ${personal.role ? `<p class="lumen-eyebrow lumen-role">${escapeHTML(personal.role)}</p>` : ""}
      ${contactRow}
    </header>
  `;
}

function renderLumenSection(heading: string, content: string): string {
  if (!content.trim()) return "";
  return `
    <section class="lumen-section">
      <h2 class="lumen-heading">${escapeHTML(heading)}</h2>
      <div class="lumen-section-body">${content}</div>
    </section>
  `;
}

function renderLumenProfile(cv: CVData): string {
  if (!cv.profile) return "";
  return renderLumenSection("Profil", `<p class="lumen-body">${escapeText(cv.profile)}</p>`);
}

function renderLumenEmployment(cv: CVData): string {
  if (cv.employment.length === 0) return "";
  const items = cv.employment
    .map((e) => `
      <li class="lumen-row">
        <div class="lumen-row-meta">
          <p class="lumen-row-date">${lumenDates(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current)}</p>
          ${e.location ? `<p class="lumen-row-location">${escapeHTML(e.location)}</p>` : ""}
        </div>
        <div class="lumen-row-body">
          <p class="lumen-row-title">${escapeHTML(e.position)}${e.company ? ` <span class="lumen-row-conj">w</span> ${escapeHTML(e.company)}` : ""}</p>
          ${e.description ? `<p class="lumen-row-desc">${escapeText(e.description)}</p>` : ""}
        </div>
      </li>
    `)
    .join("");
  return renderLumenSection("Doświadczenie", `<ul class="lumen-list">${items}</ul>`);
}

function renderLumenEducation(cv: CVData): string {
  if (cv.education.length === 0) return "";
  const items = cv.education
    .map((e) => `
      <li class="lumen-row">
        <div class="lumen-row-meta">
          <p class="lumen-row-date">${lumenDates(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current)}</p>
          ${e.location ? `<p class="lumen-row-location">${escapeHTML(e.location)}</p>` : ""}
        </div>
        <div class="lumen-row-body">
          <p class="lumen-row-title">${escapeHTML(e.school)}</p>
          ${e.degree ? `<p class="lumen-row-desc">${escapeHTML(e.degree)}</p>` : ""}
        </div>
      </li>
    `)
    .join("");
  return renderLumenSection("Edukacja", `<ul class="lumen-list">${items}</ul>`);
}

function renderLumenSkillGroup(items: string[], heading?: string): string {
  if (items.length === 0) return "";
  const tags = items
    .map((s) => `<li class="lumen-skill"><span class="lumen-skill-bullet"></span><span>${escapeHTML(s)}</span></li>`)
    .join("");
  const headingHTML = heading
    ? `<p class="lumen-eyebrow lumen-subheading">${escapeHTML(heading)}</p>`
    : "";
  return `<div class="lumen-skill-group">${headingHTML}<ul class="lumen-skill-list">${tags}</ul></div>`;
}

function renderLumenSkills(cv: CVData): string {
  const hasProf = cv.skills.professional.length > 0;
  const hasPers = cv.skills.personal.length > 0;
  if (!hasProf && !hasPers) return "";
  const groups = [
    renderLumenSkillGroup(cv.skills.professional, hasPers ? "Zawodowe" : undefined),
    hasPers ? renderLumenSkillGroup(cv.skills.personal, "Miękkie") : "",
  ].filter(Boolean).join("");
  return renderLumenSection("Umiejętności", `<div class="lumen-skill-groups">${groups}</div>`);
}

function renderLumenLanguages(cv: CVData): string {
  if (!cv.settings.showLanguages || cv.languages.length === 0) return "";
  const items = cv.languages
    .filter((l) => l.name)
    .map((l) => `<li class="lumen-lang"><span>${escapeHTML(l.name)}</span><span class="lumen-lang-level">${escapeHTML(LANGUAGE_LABELS[l.level] ?? l.level)}</span></li>`)
    .join("");
  if (!items) return "";
  return renderLumenSection("Języki", `<ul class="lumen-list lumen-list-compact">${items}</ul>`);
}

function renderLumenBody(cv: CVData): string {
  const sharedSections = [
    cv.settings.showProjects ? renderLumenSection("Projekty", renderSharedProjectsBody(cv)) : "",
    cv.settings.showCertifications ? renderLumenSection("Certyfikaty", renderSharedCertificationsBody(cv)) : "",
    cv.settings.showVolunteer ? renderLumenSection("Wolontariat", renderSharedVolunteerBody(cv)) : "",
    cv.settings.showPublications ? renderLumenSection("Publikacje", renderSharedPublicationsBody(cv)) : "",
    cv.settings.showAwards ? renderLumenSection("Nagrody", renderSharedAwardsBody(cv)) : "",
    cv.settings.showConferences ? renderLumenSection("Konferencje", renderSharedConferencesBody(cv)) : "",
    cv.settings.showHobbies ? renderLumenSection("Zainteresowania", renderSharedHobbiesBody(cv)) : "",
    cv.settings.showReferences ? renderLumenSection("Referencje", renderSharedReferencesBody(cv)) : "",
  ].filter(Boolean).join("");

  return `
    <div class="lumen-content">
      ${renderLumenHeader(cv)}
      ${cv.settings.showProfile ? renderLumenProfile(cv) : ""}
      ${cv.settings.showEmployment ? renderLumenEmployment(cv) : ""}
      ${cv.settings.showEducation ? renderLumenEducation(cv) : ""}
      ${cv.settings.showSkills ? renderLumenSkills(cv) : ""}
      ${renderLumenLanguages(cv)}
      ${sharedSections}
      ${renderSharedCustomSections(cv)}
    </div>
  `;
}

// Helpers extracting body content from existing shared section renderers
// (chcemy tylko wnętrze ul, bez own heading, bo Lumen owija własnym)
function renderSharedProjectsBody(cv: CVData): string {
  if (cv.projects.length === 0) return "";
  const items = cv.projects.map((p) => `
    <li class="lumen-row">
      <div class="lumen-row-body">
        <p class="lumen-row-title">${escapeHTML(p.name)}${p.url ? ` <span class="lumen-row-conj">·</span> <span class="lumen-row-url">${escapeHTML(p.url)}</span>` : ""}</p>
        ${p.description ? `<p class="lumen-row-desc">${escapeText(p.description)}</p>` : ""}
      </div>
    </li>
  `).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedCertificationsBody(cv: CVData): string {
  if (cv.certifications.length === 0) return "";
  const items = cv.certifications.map((c) => {
    const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
    return `
      <li class="lumen-row">
        <div class="lumen-row-meta">
          ${date ? `<p class="lumen-row-date">${escapeHTML(date)}</p>` : ""}
        </div>
        <div class="lumen-row-body">
          <p class="lumen-row-title">${escapeHTML(c.name)}</p>
          ${c.issuer ? `<p class="lumen-row-desc">${escapeHTML(c.issuer)}</p>` : ""}
        </div>
      </li>
    `;
  }).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedVolunteerBody(cv: CVData): string {
  if (cv.volunteer.length === 0) return "";
  const items = cv.volunteer.map((v) => `
    <li class="lumen-row">
      <div class="lumen-row-meta">
        <p class="lumen-row-date">${lumenDates(v.startYear, v.startMonth, v.endYear, v.endMonth, v.current)}</p>
      </div>
      <div class="lumen-row-body">
        <p class="lumen-row-title">${escapeHTML(v.role)}${v.organization ? ` <span class="lumen-row-conj">·</span> ${escapeHTML(v.organization)}` : ""}</p>
        ${v.description ? `<p class="lumen-row-desc">${escapeText(v.description)}</p>` : ""}
      </div>
    </li>
  `).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedPublicationsBody(cv: CVData): string {
  if (cv.publications.length === 0) return "";
  const items = cv.publications.map((p) => `
    <li class="lumen-row">
      <div class="lumen-row-meta">
        ${p.year ? `<p class="lumen-row-date">${escapeHTML(p.year)}</p>` : ""}
      </div>
      <div class="lumen-row-body">
        <p class="lumen-row-title">${escapeHTML(p.title)}</p>
        ${p.venue ? `<p class="lumen-row-desc">${escapeHTML(p.venue)}</p>` : ""}
        ${p.description ? `<p class="lumen-row-desc">${escapeText(p.description)}</p>` : ""}
      </div>
    </li>
  `).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedAwardsBody(cv: CVData): string {
  if (cv.awards.length === 0) return "";
  const items = cv.awards.map((a) => `
    <li class="lumen-row">
      <div class="lumen-row-meta">
        ${a.year ? `<p class="lumen-row-date">${escapeHTML(a.year)}</p>` : ""}
      </div>
      <div class="lumen-row-body">
        <p class="lumen-row-title">${escapeHTML(a.title)}</p>
        ${a.issuer ? `<p class="lumen-row-desc">${escapeHTML(a.issuer)}</p>` : ""}
      </div>
    </li>
  `).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedConferencesBody(cv: CVData): string {
  if (cv.conferences.length === 0) return "";
  const items = cv.conferences.map((c) => {
    const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
    return `
      <li class="lumen-row">
        <div class="lumen-row-meta">
          ${date ? `<p class="lumen-row-date">${escapeHTML(date)}</p>` : ""}
        </div>
        <div class="lumen-row-body">
          <p class="lumen-row-title">${escapeHTML(c.title)}</p>
          ${c.event ? `<p class="lumen-row-desc">${escapeHTML(c.event)}${c.role ? ` — ${escapeHTML(c.role)}` : ""}</p>` : ""}
        </div>
      </li>
    `;
  }).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function renderSharedHobbiesBody(cv: CVData): string {
  if (cv.hobbies.length === 0) return "";
  const tags = cv.hobbies
    .map((h) => `<li class="lumen-skill"><span class="lumen-skill-bullet"></span><span>${escapeHTML(h)}</span></li>`)
    .join("");
  return `<ul class="lumen-skill-list">${tags}</ul>`;
}

function renderSharedReferencesBody(cv: CVData): string {
  if (cv.references.length === 0) return "";
  const items = cv.references.map((r) => `
    <li class="lumen-row">
      <div class="lumen-row-body">
        ${r.name ? `<p class="lumen-row-title">${escapeHTML(r.name)}</p>` : ""}
        ${r.title || r.company ? `<p class="lumen-row-desc">${escapeHTML(r.title)}${r.title && r.company ? " · " : ""}${escapeHTML(r.company)}</p>` : ""}
        ${r.contact ? `<p class="lumen-row-desc">${escapeHTML(r.contact)}</p>` : ""}
      </div>
    </li>
  `).join("");
  return `<ul class="lumen-list">${items}</ul>`;
}

function lumenStylesheet(): string {
  const c = LUMEN_COLORS;
  return `
    .cv-page.lumen { background: ${c.bg}; color: ${c.ink}; }
    .lumen .cv-rodo { color: ${c.muted}; border-top-color: ${c.line}; }

    .lumen .lumen-content { display: flex; flex-direction: column; gap: 10mm; }

    .lumen .lumen-header { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .lumen .lumen-photo { width: 28mm; height: 28mm; overflow: hidden; border-radius: 2mm; background: ${c.lineSoft}; margin-bottom: 8mm; }
    .lumen .lumen-photo--circle { border-radius: 999px; }
    .lumen .lumen-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .lumen .lumen-photo--empty { background: ${c.lineSoft}; }
    .lumen .lumen-name { font-weight: 800; letter-spacing: -0.01em; font-size: 2.95em; line-height: 1.0; color: ${c.ink}; }
    .lumen .lumen-eyebrow { text-transform: uppercase; letter-spacing: 0.22em; font-weight: 600; }
    .lumen .lumen-role { margin-top: 3mm; font-size: 0.92em; color: ${c.ink}; }
    .lumen .lumen-contact { display: grid; gap: 3mm 6mm; margin-top: 8mm; width: 100%; text-align: left; }
    .lumen .lumen-contact-item { display: flex; flex-direction: column; gap: 1mm; }
    .lumen .lumen-contact-label { font-weight: 800; font-size: 0.92em; color: ${c.ink}; }
    .lumen .lumen-contact-value { font-size: 0.95em; line-height: 1.35; color: ${c.muted}; }

    .lumen .lumen-section { display: grid; grid-template-columns: 26% 1fr; gap: 5mm; }
    .lumen .lumen-heading { font-weight: 800; letter-spacing: -0.01em; font-size: 1.55em; line-height: 1.05; color: ${c.ink}; }
    .lumen .lumen-section-body { min-width: 0; }
    .lumen .lumen-body { font-size: 1em; line-height: 1.6; color: ${c.muted}; }

    .lumen .lumen-list { display: flex; flex-direction: column; gap: 5mm; }
    .lumen .lumen-list-compact { gap: 2mm; }

    .lumen .lumen-row { display: grid; grid-template-columns: 38% 1fr; gap: 3mm; align-items: start; }
    .lumen .lumen-row-meta { display: flex; flex-direction: column; gap: 0.5mm; }
    .lumen .lumen-row-date { font-weight: 800; letter-spacing: -0.01em; font-size: 0.95em; color: ${c.ink}; line-height: 1.25; }
    .lumen .lumen-row-location { font-size: 0.9em; color: ${c.muted}; }
    .lumen .lumen-row-body { display: flex; flex-direction: column; min-width: 0; }
    .lumen .lumen-row-title { font-weight: 800; letter-spacing: -0.005em; font-size: 1em; line-height: 1.3; color: ${c.ink}; }
    .lumen .lumen-row-conj { font-weight: 400; color: ${c.muted}; }
    .lumen .lumen-row-url { font-weight: 400; font-size: 0.92em; color: ${c.muted}; }
    .lumen .lumen-row-desc { margin-top: 1.5mm; font-size: 0.95em; line-height: 1.55; color: ${c.muted}; }

    .lumen .lumen-skill-groups { display: flex; flex-direction: column; gap: 4mm; }
    .lumen .lumen-subheading { font-size: 0.78em; color: ${c.muted}; margin-bottom: 1.6mm; }
    .lumen .lumen-skill-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2mm 3mm; }
    .lumen .lumen-skill { display: flex; align-items: center; gap: 2mm; font-size: 0.95em; color: ${c.ink}; line-height: 1.3; }
    .lumen .lumen-skill-bullet { display: inline-block; width: 1.6mm; height: 1.6mm; background: ${c.ink}; flex-shrink: 0; }

    .lumen .lumen-lang { display: flex; justify-content: space-between; align-items: baseline; gap: 2mm; font-size: 0.95em; padding: 0.4mm 0; }
    .lumen .lumen-lang-level { color: ${c.muted}; font-size: 0.9em; }
  `;
}

// ─── COBALT ──────────────────────────────────────────────────────────────────

const COBALT_COLORS = {
  bg: "#faf6ec",
  ink: "#112742",
  muted: "#45566a",
  mutedSoft: "#7e8996",
  line: "#d8dfe6",
  lineSoft: "#ecf0f4",
  blobNavy: "#1f3a5f",
  blobPink: "#f4cfc4",
  blobBlue: "#cdd9ed",
};

function renderCobaltBlobs(): string {
  // Te same paths co w decorative-blobs.tsx (preview/PDF parity).
  // Pozycjonowanie przez CSS classes (.cobalt-blob--tr/bl/br).
  return `
    <div class="cobalt-blobs" aria-hidden>
      <svg class="cobalt-blob cobalt-blob--tr" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <path d="M150 18 C 175 28, 192 50, 188 80 C 184 110, 158 124, 138 116 C 116 108, 108 84, 118 60 C 124 44, 138 22, 150 18 Z" fill="${COBALT_COLORS.blobBlue}" opacity="0.92"/>
        <path d="M82 32 C 110 28, 138 46, 144 70 C 148 92, 130 108, 108 102 C 84 96, 70 78, 70 60 C 70 48, 76 36, 82 32 Z" fill="${COBALT_COLORS.blobPink}" opacity="0.88"/>
        <path d="M178 92 C 194 100, 200 122, 188 138 C 174 154, 152 150, 144 132 C 138 116, 152 96, 168 92 C 172 91, 175 91, 178 92 Z" fill="${COBALT_COLORS.blobNavy}" opacity="0.95"/>
      </svg>
      <svg class="cobalt-blob cobalt-blob--bl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <path d="M30 110 C 22 86, 36 60, 64 56 C 92 52, 116 70, 118 96 C 120 124, 100 144, 72 142 C 50 140, 36 128, 30 110 Z" fill="${COBALT_COLORS.blobPink}" opacity="0.86"/>
        <path d="M104 138 C 130 128, 158 138, 162 162 C 166 184, 144 200, 122 192 C 98 184, 88 162, 96 148 C 98 144, 100 140, 104 138 Z" fill="${COBALT_COLORS.blobNavy}" opacity="0.95"/>
        <path d="M52 168 C 70 164, 90 178, 88 196 C 86 212, 64 218, 50 208 C 36 198, 38 178, 50 170 C 51 169, 51 168, 52 168 Z" fill="${COBALT_COLORS.blobBlue}" opacity="0.9"/>
      </svg>
      <svg class="cobalt-blob cobalt-blob--br" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <path d="M138 78 C 168 70, 196 90, 194 122 C 192 154, 162 174, 134 168 C 104 162, 92 132, 104 108 C 112 92, 124 82, 138 78 Z" fill="${COBALT_COLORS.blobNavy}" opacity="0.95"/>
        <path d="M70 130 C 96 124, 122 142, 124 168 C 126 192, 102 208, 78 200 C 54 192, 46 168, 56 148 C 60 134, 64 134, 70 130 Z" fill="${COBALT_COLORS.blobPink}" opacity="0.88"/>
      </svg>
    </div>
  `;
}

function renderCobaltHeader(cv: CVData): string {
  const { personal } = cv;
  const fullName = `${escapeHTML(personal.firstName)} ${escapeHTML(personal.lastName)}`.trim();
  const showPhoto = cv.settings.photoShape !== "none";
  const photoClass = cv.settings.photoShape === "circle" ? "cobalt-photo cobalt-photo--circle" : "cobalt-photo";
  const photoBlock = showPhoto
    ? personal.photo
      ? `<div class="${photoClass}"><img src="${escapeHTML(personal.photo)}" alt="${escapeHTML(fullName) || "Zdjęcie"}"/></div>`
      : `<div class="${photoClass} cobalt-photo--empty"></div>`
    : "";
  return `
    <header class="cobalt-header">
      ${photoBlock}
      <div class="cobalt-head-text">
        <h1 class="cobalt-name">${fullName || ""}</h1>
        ${personal.role ? `<p class="cobalt-role">${escapeHTML(personal.role)}</p>` : ""}
      </div>
    </header>
  `;
}

function renderCobaltProfile(cv: CVData): string {
  if (!cv.profile) return "";
  return `<p class="cobalt-profile">${escapeText(cv.profile)}</p>`;
}

function renderCobaltEmployment(cv: CVData): string {
  if (cv.employment.length === 0) return "";
  const items = cv.employment
    .map((e) => {
      const start = formatDatePart(e.startMonth, e.startYear);
      const end = e.current ? "obecnie" : formatDatePart(e.endMonth, e.endYear);
      const dates = start && end ? `${start} – ${end}` : start || end;
      return `
        <li class="cobalt-emp-item">
          ${e.company ? `<p class="cobalt-emp-company">${escapeHTML(e.company)}</p>` : ""}
          ${e.position ? `<p class="cobalt-emp-position">${escapeHTML(e.position)}</p>` : ""}
          <p class="cobalt-emp-meta">${escapeHTML(dates)}${e.location ? ` · ${escapeHTML(e.location)}` : ""}</p>
          ${e.description ? `<div class="cobalt-emp-desc">${escapeText(e.description)}</div>` : ""}
        </li>
      `;
    })
    .join("");
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Doświadczenie</h2><ul class="cobalt-list">${items}</ul></section>`;
}

function renderCobaltEducation(cv: CVData): string {
  if (cv.education.length === 0) return "";
  const items = cv.education
    .map((e) => {
      const start = formatDatePart(e.startMonth, e.startYear);
      const end = e.current ? "obecnie" : formatDatePart(e.endMonth, e.endYear);
      const dates = start && end ? `${start} – ${end}` : start || end;
      return `
        <li class="cobalt-edu-item">
          ${e.school ? `<p class="cobalt-edu-school">${escapeHTML(e.school)}</p>` : ""}
          ${e.degree ? `<p class="cobalt-edu-degree">${escapeHTML(e.degree)}</p>` : ""}
          <p class="cobalt-emp-meta">${escapeHTML(dates)}${e.location ? ` · ${escapeHTML(e.location)}` : ""}</p>
        </li>
      `;
    })
    .join("");
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Edukacja</h2><ul class="cobalt-list">${items}</ul></section>`;
}

function renderCobaltDetails(cv: CVData): string {
  const fields = contactFieldsVisible(cv);
  const rows: string[] = [];
  if (fields.address) rows.push(`<div class="cobalt-detail"><p class="cobalt-detail-label">Adres</p><p class="cobalt-detail-value">${escapeHTML(fields.address)}</p></div>`);
  if (fields.phone) rows.push(`<div class="cobalt-detail"><p class="cobalt-detail-label">Telefon</p><p class="cobalt-detail-value">${escapeHTML(fields.phone)}</p></div>`);
  if (fields.email) rows.push(`<div class="cobalt-detail"><p class="cobalt-detail-label">Email</p><p class="cobalt-detail-value">${escapeHTML(fields.email)}</p></div>`);
  if (rows.length === 0) return "";
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Kontakt</h2><div class="cobalt-details">${rows.join("")}</div></section>`;
}

function renderCobaltSkills(cv: CVData): string {
  const groups: string[] = [];
  if (cv.skills.professional.length > 0) {
    const items = cv.skills.professional
      .map((s) => `<li class="cobalt-skill"><span class="cobalt-skill-name">${escapeHTML(s)}</span><span class="cobalt-skill-bar"></span></li>`)
      .join("");
    groups.push(`<div><h3 class="cobalt-subheading">Zawodowe</h3><ul class="cobalt-skills-list">${items}</ul></div>`);
  }
  if (cv.skills.personal.length > 0) {
    const items = cv.skills.personal
      .map((s) => `<li class="cobalt-skill"><span class="cobalt-skill-name">${escapeHTML(s)}</span><span class="cobalt-skill-bar"></span></li>`)
      .join("");
    groups.push(`<div><h3 class="cobalt-subheading">Miękkie</h3><ul class="cobalt-skills-list">${items}</ul></div>`);
  }
  if (groups.length === 0) return "";
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Umiejętności</h2><div class="cobalt-skills-groups">${groups.join("")}</div></section>`;
}

function renderCobaltLinks(cv: CVData): string {
  const rows: string[] = [];
  const fields = contactFieldsVisible(cv);
  if (fields.website) {
    rows.push(`<li><p class="cobalt-detail-label">Strona</p><p class="cobalt-detail-value">${escapeHTML(fields.website)}</p></li>`);
  }
  if (cv.settings.showProjects) {
    cv.projects
      .filter((p) => p.url)
      .forEach((p) => {
        const host = p.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
        rows.push(`<li><p class="cobalt-detail-label">${escapeHTML(p.name || host)}</p><p class="cobalt-detail-value">${escapeHTML(host)}</p></li>`);
      });
  }
  if (rows.length === 0) return "";
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Linki</h2><ul class="cobalt-list">${rows.join("")}</ul></section>`;
}

function renderCobaltLanguages(cv: CVData): string {
  if (!cv.settings.showLanguages || cv.languages.length === 0) return "";
  const items = cv.languages
    .filter((l) => l.name)
    .map((l) => `<li class="cobalt-lang"><span>${escapeHTML(l.name)}</span><span class="cobalt-lang-level">${escapeHTML(LANGUAGE_LABELS[l.level] ?? l.level)}</span></li>`)
    .join("");
  if (!items) return "";
  return `<section class="cobalt-section"><h2 class="cobalt-heading">Języki</h2><ul class="cobalt-list">${items}</ul></section>`;
}

function renderCobaltBody(cv: CVData): string {
  return `
    <div class="cobalt-content">
      ${renderCobaltHeader(cv)}
      ${cv.settings.showProfile ? renderCobaltProfile(cv) : ""}
      <div class="cobalt-grid">
        <main class="cobalt-main">
          ${cv.settings.showEmployment ? renderCobaltEmployment(cv) : ""}
          ${cv.settings.showEducation ? renderCobaltEducation(cv) : ""}
          ${cv.settings.showProjects ? renderSharedCustomSections(cv) : ""}
          ${cv.settings.showVolunteer ? renderSharedVolunteer(cv) : ""}
          ${cv.settings.showPublications ? renderSharedPublications(cv) : ""}
          ${cv.settings.showAwards ? renderSharedAwards(cv) : ""}
          ${cv.settings.showConferences ? renderSharedConferences(cv) : ""}
          ${cv.settings.showReferences ? renderSharedReferences(cv) : ""}
        </main>
        <aside class="cobalt-aside">
          ${renderCobaltDetails(cv)}
          ${cv.settings.showSkills ? renderCobaltSkills(cv) : ""}
          ${renderCobaltLanguages(cv)}
          ${cv.settings.showCertifications ? renderSharedCertifications(cv) : ""}
          ${cv.settings.showHobbies ? renderSharedHobbies(cv) : ""}
          ${cv.settings.showLinks ? renderCobaltLinks(cv) : ""}
        </aside>
      </div>
    </div>
  `;
}

function cobaltStylesheet(): string {
  const c = COBALT_COLORS;
  return `
    .cv-page.cobalt { background: ${c.bg}; color: ${c.ink}; }
    .cv-page.cobalt .cv-body { z-index: 2; }
    .cv-page.cobalt > .cv-footer-slot {
      z-index: 2;
      padding: 5mm 6mm 2mm;
      margin: 0 -6mm -2mm;
      background: linear-gradient(
        to top,
        ${c.bg} 0%,
        ${c.bg} 80%,
        color-mix(in oklab, ${c.bg} 60%, transparent) 100%
      );
    }
    .cobalt .cv-rodo { color: ${c.muted}; border-top-color: color-mix(in oklab, ${c.ink} 14%, transparent); }

    .cv-page.cobalt .cobalt-blobs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    .cv-page.cobalt .cobalt-blob { position: absolute; }
    .cv-page.cobalt .cobalt-blob--tr { top: 0; right: 0; width: 85mm; height: 85mm; transform: translate(18%, -22%); }
    .cv-page.cobalt .cobalt-blob--bl { bottom: 0; left: 0; width: 78mm; height: 78mm; transform: translate(-30%, 32%); }
    .cv-page.cobalt .cobalt-blob--br { bottom: 0; right: 0; width: 82mm; height: 82mm; transform: translate(34%, 34%); }

    .cobalt .cobalt-content { position: relative; display: flex; flex-direction: column; gap: 7mm; }

    .cobalt .cobalt-header { display: flex; gap: 6mm; align-items: flex-start; }
    .cobalt .cobalt-photo { width: 24mm; height: 24mm; overflow: hidden; border-radius: 2mm; background: ${c.lineSoft}; flex-shrink: 0; }
    .cobalt .cobalt-photo--circle { border-radius: 999px; }
    .cobalt .cobalt-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cobalt .cobalt-photo--empty { background: ${c.lineSoft}; }
    .cobalt .cobalt-head-text { flex: 1; min-width: 0; }
    .cobalt .cobalt-name { font-size: 3em; font-weight: 800; letter-spacing: -0.02em; line-height: 1.0; color: ${c.ink}; }
    .cobalt .cobalt-role { margin-top: 0.6mm; font-size: 1.15em; font-weight: 700; color: ${c.ink}; }

    .cobalt .cobalt-profile { max-width: 105mm; font-size: 0.98em; line-height: 1.5; color: ${c.ink}; }

    .cobalt .cobalt-grid { display: grid; grid-template-columns: 60% 4% 36%; }

    .cobalt .cobalt-main { display: flex; flex-direction: column; gap: 6mm; min-width: 0; }
    .cobalt .cobalt-aside { grid-column: 3; display: flex; flex-direction: column; gap: 6mm; min-width: 0; }

    .cobalt .cobalt-section { break-inside: avoid; }
    .cobalt .cobalt-heading { font-size: 1.55em; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; color: ${c.ink}; margin-bottom: 1.4mm; }
    .cobalt .cobalt-subheading { font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${c.muted}; margin-bottom: 1.6mm; }

    .cobalt .cobalt-list { display: flex; flex-direction: column; gap: 1.1em; }

    .cobalt .cobalt-emp-company { font-size: 1em; font-weight: 700; color: ${c.ink}; line-height: 1.25; }
    .cobalt .cobalt-emp-position { font-size: 0.96em; font-weight: 600; color: ${c.ink}; line-height: 1.3; }
    .cobalt .cobalt-emp-meta { font-size: 0.88em; color: ${c.muted}; line-height: 1.4; margin-top: 0.15em; }
    .cobalt .cobalt-emp-desc { margin-top: 0.5em; font-size: 0.95em; line-height: 1.5; color: ${c.ink}; }

    .cobalt .cobalt-edu-school { font-size: 1em; font-weight: 700; color: ${c.ink}; line-height: 1.25; }
    .cobalt .cobalt-edu-degree { font-size: 0.96em; color: ${c.ink}; line-height: 1.3; }

    .cobalt .cobalt-details { display: flex; flex-direction: column; gap: 2.4mm; }
    .cobalt .cobalt-detail-label { font-size: 0.85em; font-weight: 700; color: ${c.ink}; }
    .cobalt .cobalt-detail-value { font-size: 0.95em; line-height: 1.35; color: ${c.ink}; }

    .cobalt .cobalt-skills-groups { display: flex; flex-direction: column; gap: 3mm; }
    .cobalt .cobalt-skills-list { display: flex; flex-direction: column; gap: 1.4mm; }
    .cobalt .cobalt-skill { display: flex; flex-direction: column; gap: 0.8mm; }
    .cobalt .cobalt-skill-name { font-size: 1em; line-height: 1.2; color: ${c.ink}; }
    .cobalt .cobalt-skill-bar { display: block; height: 2px; border-radius: 2px; background: linear-gradient(to right, ${c.ink} 0%, ${c.ink} 62%, ${c.lineSoft} 100%); }

    .cobalt .cobalt-lang { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; font-size: 0.95em; padding: 0.1em 0; }
    .cobalt .cobalt-lang-level { color: ${c.muted}; font-size: 0.9em; }

    .cobalt .cv-section { break-inside: avoid; }
    .cobalt .cv-heading { font-size: 1.15em; font-weight: 700; color: ${c.ink}; margin-bottom: 0.6em; }
    .cobalt .cv-list { display: flex; flex-direction: column; gap: 0.7em; }
    .cobalt .cv-list-stack { gap: 0.55em; }
    .cobalt .cv-strong { font-weight: 700; color: ${c.ink}; }
    .cobalt .cv-muted { color: ${c.muted}; }
    .cobalt .cv-italic { font-style: italic; }
    .cobalt .cv-small { font-size: 0.88em; }
    .cobalt .cv-body { font-size: 0.95em; line-height: 1.5; color: ${c.ink}; }
    .cobalt .cv-cert-head, .cobalt .cv-pub-head, .cobalt .cv-award-head, .cobalt .cv-conf-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; }
    .cobalt .cv-emp-item { display: grid; grid-template-columns: 18% 1fr; gap: 0.8em; }
    .cobalt .cv-years { color: ${c.muted}; font-size: 0.88em; }
    .cobalt .cv-emp-desc { margin-top: 0.4em; }
    .cobalt .cv-hobbies { display: flex; flex-wrap: wrap; gap: 0.4em; }
    .cobalt .cv-hobby-tag { padding: 0.15em 0.6em; background: ${c.lineSoft}; border-radius: 999px; font-size: 0.88em; color: ${c.ink}; }
  `;
}

// ─── SHELL STYLESHEET (shared) ───────────────────────────────────────────────

function buildStylesheet(fontStack: string, fontSize: number): string {
  return `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    body { font-family: ${fontStack}; font-size: ${fontSize}pt; font-weight: 450; color: #0f1115; line-height: 1.48; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-feature-settings: "ss01", "kern"; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h1, h2, h3, h4, p, ul, ol { margin: 0; padding: 0; }
    ul { list-style: none; }

    @page { size: A4; margin: 0; }

    .cv-page { position: relative; width: 210mm; height: 297mm; overflow: hidden; background: #fff; }
    /* Bezpośredni descendant selector — żeby class="cv-body" na wewnętrznych paragrafach
       NIE dziedziczyła position:absolute z wrappera (overloaded class). */
    .cv-page > .cv-body { position: absolute; left: calc(14mm - 3px); right: calc(14mm - 3px); top: 12mm; bottom: 18mm; padding: 0 3px; overflow: hidden; }
    .cv-page > .cv-body--no-footer { bottom: 8mm; }
    .cv-page > .cv-footer-slot { position: absolute; left: calc(14mm - 3px); right: calc(14mm - 3px); bottom: 8mm; padding: 0 3px; }
    .cv-rodo { padding-top: 3mm; border-top: 1px solid #ededed; font-size: 0.72em; line-height: 1.45; color: #4d5058; letter-spacing: 0; }

    ${orbitStylesheet()}
    ${atlasStylesheet()}
    ${terraStylesheet()}
    ${cobaltStylesheet()}
    ${lumenStylesheet()}
  `;
}

function renderRodo(cv: CVData): { html: string; present: boolean } {
  const text = buildRodoText(cv.rodo.type, cv.rodo.companyName);
  if (!text) return { html: "", present: false };
  return {
    html: `<footer class="cv-rodo">${escapeHTML(text)}</footer>`,
    present: true,
  };
}

export function renderCVToHTML(cv: CVData, fontSizeOverride?: number): string {
  const stack = FONT_FAMILY_STACKS[cv.settings.fontFamily];
  const fontSize = fontSizeOverride ?? cv.settings.fontSize;
  const googleFont = GOOGLE_FONT_BY_ID[cv.settings.fontFamily];
  const fontLink = googleFont
    ? `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link rel="stylesheet" href="${googleFontsHref(googleFont)}" />`
    : "";
  const stylesheet = buildStylesheet(stack, fontSize);

  const rodo = renderRodo(cv);
  const bodyClass = rodo.present ? "cv-body" : "cv-body cv-body--no-footer";
  const templateId = cv.settings.templateId ?? "orbit";
  const bodyContent =
    templateId === "atlas"
      ? renderAtlasBody(cv)
      : templateId === "terra"
        ? renderTerraBody(cv)
        : templateId === "cobalt"
          ? renderCobaltBody(cv)
          : templateId === "lumen"
            ? renderLumenBody(cv)
            : renderOrbitBody(cv);
  const pageClass =
    templateId === "atlas"
      ? "cv-page atlas"
      : templateId === "terra"
        ? "cv-page terra"
        : templateId === "cobalt"
          ? "cv-page cobalt"
          : templateId === "lumen"
            ? "cv-page lumen"
            : "cv-page";
  const decorationsHTML = templateId === "cobalt" ? renderCobaltBlobs() : "";
  const serifLink = templateId === "terra"
    ? `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" />`
    : "";

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CV — ${escapeHTML(`${cv.personal.firstName} ${cv.personal.lastName}`.trim() || "Kreator")}</title>
${fontLink}
${serifLink}
<style>${stylesheet}</style>
</head>
<body>
<div class="${pageClass}">
  ${decorationsHTML}
  <div class="${bodyClass}">
    ${bodyContent}
  </div>
  ${rodo.present ? `<div class="cv-footer-slot">${rodo.html}</div>` : ""}
</div>
</body>
</html>`;
}
