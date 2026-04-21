"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import {
  SortableHandle,
  SortableList,
  useSortableRow,
} from "@/components/cv/editable/sortable-list";
import { SectionHeading } from "./section-heading";
import { useCVStore } from "@/lib/cv/store";
import { Certificate, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { CertificationItem } from "@/lib/cv/schema";

function CertRow({ item }: { item: CertificationItem }) {
  const updateCertification = useCVStore((s) => s.updateCertification);
  const removeCertification = useCVStore((s) => s.removeCertification);
  const { rowRef, rowStyle, handleProps } = useSortableRow(item.id);

  const dateText =
    item.month && item.year ? `${item.month}.${item.year}` : item.year || "";

  return (
    <li ref={rowRef} style={rowStyle} className="group grid grid-cols-[auto_1fr] gap-[0.5em]">
      <SortableHandle handleProps={handleProps} className="mt-[0.35em]" />
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <EditableText
            value={item.name}
            onChange={(v) => updateCertification(item.id, { name: v })}
            placeholder="Nazwa certyfikatu"
            as="p"
            className="font-semibold text-[1em] leading-snug"
          />
          <EditableText
            value={dateText}
            onChange={(v) => {
              const [m, y] = v.includes(".") ? v.split(".") : ["", v];
              updateCertification(item.id, { month: m ?? "", year: y ?? "" });
            }}
            placeholder="MM.RRRR"
            className="text-[calc(var(--cv-font-size)*0.9)] text-[color:var(--cv-muted)] tabular-nums"
          />
        </div>
        <div className="flex items-baseline justify-between gap-2 text-[calc(var(--cv-font-size)*0.95)] text-[color:var(--cv-muted)]">
          <EditableText
            value={item.issuer}
            onChange={(v) => updateCertification(item.id, { issuer: v })}
            placeholder="Wystawca (np. Microsoft, AWS)"
          />
          <EditableText
            value={item.credentialId}
            onChange={(v) => updateCertification(item.id, { credentialId: v })}
            placeholder="ID certyfikatu (opcjonalnie)"
            className="text-[calc(var(--cv-font-size)*0.85)]"
          />
        </div>
        <EditableText
          value={item.url}
          onChange={(v) => updateCertification(item.id, { url: v })}
          placeholder="Link weryfikacyjny (opcjonalnie)"
          as="p"
          className="text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)]"
        />
        <button
          type="button"
          onClick={() => removeCertification(item.id)}
          aria-label="Usuń certyfikat"
          className="self-end text-[color:var(--cv-muted)] opacity-0 group-hover:opacity-70 hover:!opacity-100 transition mt-1"
          tabIndex={-1}
        >
          <Trash size={11} />
        </button>
      </div>
    </li>
  );
}

export function TemplateCertifications() {
  const items = useCVStore((s) => s.cv.certifications);
  const add = useCVStore((s) => s.addCertification);
  const reorder = useCVStore((s) => s.reorderCertifications);

  const ids = items.map((i) => i.id);

  return (
    <section data-cv-section="certifications">
      <SectionHeading>Certyfikaty</SectionHeading>
      <SortableList ids={ids} onReorder={reorder}>
        <ul className="flex flex-col gap-[0.9em]">
          {items.map((item) => (
            <CertRow key={item.id} item={item} />
          ))}
        </ul>
      </SortableList>
      <button
        type="button"
        onClick={add}
        className="mt-[0.9em] flex items-center gap-1 text-[calc(var(--cv-font-size)*0.85)] text-[color:var(--cv-muted)] hover:text-[color:var(--cv-ink)] transition"
      >
        <Certificate size={11} weight="regular" /> Dodaj certyfikat
        <Plus size={10} weight="bold" className="opacity-60" />
      </button>
    </section>
  );
}
