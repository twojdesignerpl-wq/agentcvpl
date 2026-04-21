"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { MONTH_LABELS } from "@/lib/cv/schema";
import { MobileTextField } from "./mobile-field";
import { MobileArrayCardHeader } from "./array-card-header";
import { MOBILE_SELECT_BASE as SELECT_BASE, yearOptions } from "./select-base";

export function MobileCertificationsForm() {
  const items = useCVStore((s) => s.cv.certifications);
  const add = useCVStore((s) => s.addCertification);
  const update = useCVStore((s) => s.updateCertification);
  const remove = useCVStore((s) => s.removeCertification);
  const reorder = useCVStore((s) => s.reorderCertifications);
  const years = yearOptions();

  const moveBy = (idx: number, delta: number) => {
    const ids = items.map((c) => c.id);
    const next = idx + delta;
    if (next < 0 || next >= ids.length) return;
    const out = ids.slice();
    const [id] = out.splice(idx, 1);
    out.splice(next, 0, id);
    reorder(out);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] bg-[color:color-mix(in_oklab,var(--cream-soft)_60%,transparent)] px-3 py-5 text-center text-[13px] text-[color:var(--ink-muted)]">
          Brak wpisów. AWS, Google, Prince2, ISTQB…
        </p>
      ) : null}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-3"
        >
          <MobileArrayCardHeader
            label={`Certyfikat #${idx + 1}`}
            index={idx}
            total={items.length}
            onMoveUp={() => moveBy(idx, -1)}
            onMoveDown={() => moveBy(idx, 1)}
            onRemove={() => remove(item.id)}
            confirmMessage="Usunąć certyfikat?"
          />
          <div className="space-y-3">
            <MobileTextField
              label="Nazwa"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="np. AWS Solutions Architect"
            />
            <MobileTextField
              label="Wystawca"
              value={item.issuer}
              onChange={(e) => update(item.id, { issuer: e.target.value })}
              placeholder="np. Amazon Web Services"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Miesiąc
                </span>
                <select
                  value={item.month}
                  onChange={(e) => update(item.id, { month: e.target.value })}
                  className={SELECT_BASE}
                  aria-label="Miesiąc wystawienia"
                >
                  <option value="">—</option>
                  {MONTH_LABELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="mono-label mb-1.5 block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Rok
                </span>
                <select
                  value={item.year}
                  onChange={(e) => update(item.id, { year: e.target.value })}
                  className={SELECT_BASE}
                  aria-label="Rok wystawienia"
                >
                  <option value="">—</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <MobileTextField
              label="ID / numer (opcjonalnie)"
              value={item.credentialId}
              onChange={(e) => update(item.id, { credentialId: e.target.value })}
              placeholder="np. AWS-12345"
            />
            <MobileTextField
              label="Link do weryfikacji (opcjonalnie)"
              type="url"
              inputMode="url"
              value={item.url}
              onChange={(e) => update(item.id, { url: e.target.value })}
              placeholder="https://…"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="tap-target flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)] py-3 text-[14px] font-semibold text-ink hover:border-[color:var(--ink)]"
      >
        <Plus size={14} weight="bold" /> Dodaj certyfikat
      </button>
    </div>
  );
}
