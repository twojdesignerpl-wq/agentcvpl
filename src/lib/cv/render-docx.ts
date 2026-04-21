import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { buildRodoText } from "./rodo";
import type { CVData } from "./schema";

const LANGUAGE_LABELS: Record<string, string> = {
  A1: "A1 — Początkujący",
  A2: "A2 — Podstawowy",
  B1: "B1 — Średnio zaawansowany",
  B2: "B2 — Zaawansowany",
  C1: "C1 — Biegły",
  C2: "C2 — Profesjonalny",
  native: "Ojczysty",
};

const PRIMARY_COLOR = "1A1A1A";
const MUTED_COLOR = "6B6B6B";
const ACCENT_COLOR = "B84A2E";

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: {
      bottom: { color: "D9D9D9", space: 2, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: ACCENT_COLOR,
        characterSpacing: 40,
      }),
    ],
  });
}

function line(text: string, opts?: { bold?: boolean; color?: string; italic?: boolean; size?: number }): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({
        text,
        bold: opts?.bold,
        italics: opts?.italic,
        color: opts?.color ?? PRIMARY_COLOR,
        size: opts?.size ?? 20,
      }),
    ],
  });
}

function spacer(points = 120): Paragraph {
  return new Paragraph({ spacing: { after: points }, children: [] });
}

function bulletPoint(text: string): Paragraph {
  return new Paragraph({
    numbering: { reference: "cv-bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 20, color: PRIMARY_COLOR })],
  });
}

function formatDateRange(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string,
  current: boolean,
): string {
  const fmt = (m: string, y: string): string => {
    if (!y && !m) return "";
    if (!y) return m;
    if (!m) return y;
    return `${m}.${y}`;
  };
  const start = fmt(startMonth, startYear);
  const end = current ? "obecnie" : fmt(endMonth, endYear);
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}

function buildDocument(cv: CVData): Document {
  const children: Paragraph[] = [];

  const fullName = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: fullName || "CV",
          bold: true,
          size: 36,
          color: PRIMARY_COLOR,
        }),
      ],
    }),
  );

  if (cv.personal.role) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: cv.personal.role,
            size: 22,
            color: ACCENT_COLOR,
            characterSpacing: 30,
          }),
        ],
      }),
    );
  }

  const contactParts: string[] = [];
  const hidden = new Set(cv.settings.hiddenContactFields ?? []);
  if (!hidden.has("email") && cv.personal.email) contactParts.push(cv.personal.email);
  if (!hidden.has("phone") && cv.personal.phone) contactParts.push(cv.personal.phone);
  if (!hidden.has("address") && cv.personal.address) contactParts.push(cv.personal.address);
  if (!hidden.has("website") && cv.personal.website) contactParts.push(cv.personal.website);

  if (contactParts.length) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: contactParts.join("  ·  "),
            size: 20,
            color: MUTED_COLOR,
          }),
        ],
      }),
    );
  }

  if (cv.profile.trim()) {
    children.push(heading("Profil"));
    const profileLines = cv.profile.split("\n").filter((l) => l.trim());
    profileLines.forEach((l) => {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: l, size: 20, color: PRIMARY_COLOR })],
        }),
      );
    });
  }

  if (cv.employment.length > 0) {
    children.push(heading("Doświadczenie zawodowe"));
    cv.employment.forEach((e) => {
      const date = formatDateRange(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current);
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 30 },
          children: [
            new TextRun({ text: e.position || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(e.company ? [new TextRun({ text: `  ·  ${e.company}`, size: 22, color: PRIMARY_COLOR })] : []),
            ...(date ? [new TextRun({ text: `    ${date}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (e.location) {
        children.push(line(e.location, { color: MUTED_COLOR, italic: true, size: 18 }));
      }
      const descLines = e.description.split("\n").map((l) => l.trim()).filter(Boolean);
      descLines.forEach((l) => children.push(bulletPoint(l)));
    });
  }

  if (cv.education.length > 0) {
    children.push(heading("Edukacja"));
    cv.education.forEach((e) => {
      const date = formatDateRange(e.startYear, e.startMonth, e.endYear, e.endMonth, e.current);
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: e.school || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(date ? [new TextRun({ text: `    ${date}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (e.degree) children.push(line(e.degree, { color: PRIMARY_COLOR }));
      if (e.location) children.push(line(e.location, { color: MUTED_COLOR, italic: true, size: 18 }));
    });
  }

  if (cv.skills.professional.length > 0 || cv.skills.personal.length > 0) {
    children.push(heading("Umiejętności"));
    if (cv.skills.professional.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Zawodowe: ", bold: true, size: 20, color: PRIMARY_COLOR }),
            new TextRun({
              text: cv.skills.professional.join(", "),
              size: 20,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
      );
    }
    if (cv.skills.personal.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Osobiste: ", bold: true, size: 20, color: PRIMARY_COLOR }),
            new TextRun({ text: cv.skills.personal.join(", "), size: 20, color: PRIMARY_COLOR }),
          ],
        }),
      );
    }
  }

  if (cv.settings.showLanguages && cv.languages.length > 0) {
    children.push(heading("Języki"));
    cv.languages.forEach((l) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: l.name || "", bold: true, size: 20, color: PRIMARY_COLOR }),
            new TextRun({
              text: `  —  ${LANGUAGE_LABELS[l.level] ?? l.level}`,
              size: 20,
              color: MUTED_COLOR,
            }),
          ],
        }),
      );
    });
  }

  if (cv.settings.showProjects && cv.projects.length > 0) {
    children.push(heading("Projekty"));
    cv.projects.forEach((p) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: p.name || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(p.url ? [new TextRun({ text: `    ${p.url}`, size: 18, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (p.description) children.push(line(p.description, { color: PRIMARY_COLOR }));
    });
  }

  if (cv.settings.showCertifications && cv.certifications.length > 0) {
    children.push(heading("Certyfikaty"));
    cv.certifications.forEach((c) => {
      const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: c.name || "", bold: true, size: 20, color: PRIMARY_COLOR }),
            ...(c.issuer ? [new TextRun({ text: `  ·  ${c.issuer}`, size: 20, color: PRIMARY_COLOR })] : []),
            ...(date ? [new TextRun({ text: `    ${date}`, size: 18, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (c.credentialId || c.url) {
        const parts: string[] = [];
        if (c.credentialId) parts.push(`ID: ${c.credentialId}`);
        if (c.url) parts.push(c.url);
        children.push(line(parts.join(" · "), { color: MUTED_COLOR, size: 18 }));
      }
    });
  }

  if (cv.settings.showVolunteer && cv.volunteer.length > 0) {
    children.push(heading("Wolontariat"));
    cv.volunteer.forEach((v) => {
      const date = formatDateRange(v.startYear, v.startMonth, v.endYear, v.endMonth, v.current);
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: v.role || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(v.organization ? [new TextRun({ text: `  ·  ${v.organization}`, size: 22, color: PRIMARY_COLOR })] : []),
            ...(date ? [new TextRun({ text: `    ${date}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (v.description) {
        const lines = v.description.split("\n").map((l) => l.trim()).filter(Boolean);
        lines.forEach((l) => children.push(bulletPoint(l)));
      }
    });
  }

  if (cv.settings.showPublications && cv.publications.length > 0) {
    children.push(heading("Publikacje"));
    cv.publications.forEach((p) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: p.title || "", bold: true, italics: true, size: 22, color: PRIMARY_COLOR }),
            ...(p.year ? [new TextRun({ text: `    ${p.year}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (p.authors) children.push(line(p.authors, { color: MUTED_COLOR, size: 18 }));
      if (p.venue) children.push(line(p.venue, { color: PRIMARY_COLOR, size: 18 }));
      if (p.description) children.push(line(p.description, { color: PRIMARY_COLOR }));
      if (p.url) children.push(line(p.url, { color: MUTED_COLOR, size: 18 }));
    });
  }

  if (cv.settings.showAwards && cv.awards.length > 0) {
    children.push(heading("Nagrody i wyróżnienia"));
    cv.awards.forEach((a) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: a.title || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(a.year ? [new TextRun({ text: `    ${a.year}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      if (a.issuer) children.push(line(a.issuer, { color: MUTED_COLOR, size: 20 }));
      if (a.description) children.push(line(a.description, { color: PRIMARY_COLOR }));
    });
  }

  if (cv.settings.showConferences && cv.conferences.length > 0) {
    children.push(heading("Konferencje i prelekcje"));
    cv.conferences.forEach((c) => {
      const date = c.month && c.year ? `${c.month}.${c.year}` : c.year;
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: c.title || "", bold: true, size: 22, color: PRIMARY_COLOR }),
            ...(date ? [new TextRun({ text: `    ${date}`, size: 20, color: MUTED_COLOR })] : []),
          ],
        }),
      );
      const meta = [c.event, c.role].filter(Boolean).join(" · ");
      if (meta) children.push(line(meta, { color: MUTED_COLOR, size: 20 }));
      if (c.description) children.push(line(c.description, { color: PRIMARY_COLOR }));
      if (c.url) children.push(line(c.url, { color: MUTED_COLOR, size: 18 }));
    });
  }

  if (cv.settings.showHobbies && cv.hobbies.length > 0) {
    children.push(heading("Zainteresowania"));
    children.push(line(cv.hobbies.join(", "), { color: PRIMARY_COLOR }));
  }

  if (cv.settings.showReferences && cv.references.length > 0) {
    children.push(heading("Referencje"));
    cv.references.forEach((r) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: r.name || "", bold: true, size: 22, color: PRIMARY_COLOR }),
          ],
        }),
      );
      const line1 = [r.title, r.company].filter(Boolean).join(" · ");
      if (line1) children.push(line(line1, { color: MUTED_COLOR, size: 20 }));
      if (r.relation) children.push(line(r.relation, { italic: true, color: MUTED_COLOR, size: 18 }));
      if (r.contact) children.push(line(r.contact, { color: PRIMARY_COLOR, size: 18 }));
    });
  }

  if (cv.customSections.length > 0) {
    cv.customSections.forEach((sec) => {
      children.push(heading(sec.title));
      if (sec.layout === "list") {
        sec.items.forEach((it) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 30 },
              children: [
                new TextRun({ text: it.primary || "", bold: true, size: 22, color: PRIMARY_COLOR }),
                ...(it.secondary
                  ? [new TextRun({ text: `    ${it.secondary}`, size: 20, color: MUTED_COLOR })]
                  : []),
              ],
            }),
          );
          if (it.body) children.push(line(it.body, { color: PRIMARY_COLOR }));
        });
      } else if (sec.layout === "paragraph") {
        if (sec.paragraph) {
          sec.paragraph
            .split("\n")
            .filter((l) => l.trim())
            .forEach((l) => children.push(line(l, { color: PRIMARY_COLOR })));
        }
      } else if (sec.layout === "tags") {
        if (sec.tags.length > 0) children.push(line(sec.tags.join(", "), { color: PRIMARY_COLOR }));
      }
    });
  }

  const rodoText = buildRodoText(cv.rodo.type, cv.rodo.companyName);
  if (rodoText) {
    children.push(spacer(240));
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        border: {
          top: { color: "D9D9D9", space: 4, style: BorderStyle.SINGLE, size: 4 },
        },
        children: [
          new TextRun({
            text: rodoText,
            size: 16,
            color: MUTED_COLOR,
          }),
        ],
      }),
    );
  }

  return new Document({
    creator: "agentcv.pl",
    title: fullName || "CV",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "cv-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 400, hanging: 200 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, right: 900, bottom: 900, left: 900 },
          },
        },
        children,
      },
    ],
  });
}

export async function renderCVToDocx(cv: CVData): Promise<Buffer> {
  const doc = buildDocument(cv);
  return Packer.toBuffer(doc);
}
