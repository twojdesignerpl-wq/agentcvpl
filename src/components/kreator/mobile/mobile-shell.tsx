"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/lib/cv/store";
import { useAutoFit } from "@/lib/cv/auto-fit";
import { PageA4 } from "@/components/cv/page-a4";
import { TemplateOrbit } from "@/components/cv/template-orbit";
import { TemplateAtlas } from "@/components/cv/template-atlas";
import { TemplateTerra } from "@/components/cv/template-terra";
import { TemplateCobalt } from "@/components/cv/template-cobalt";
import { CobaltDecorativeBlobs } from "@/components/cv/cobalt/decorative-blobs";
import { TemplateLumen } from "@/components/cv/template-lumen";
import { RodoFooter } from "@/components/cv/sections/rodo-footer";
import { usePlan } from "@/lib/plan/plan-context";
import { MobileTopBar } from "./top-bar";
import { MobileBottomNav, type MobileTab } from "./bottom-nav";
import { MobileTabEditor } from "./tab-editor";
import { MobileTabStyle } from "./tab-style";
import { MobileTabAI } from "./tab-ai";
import { MobileTabExport } from "./tab-export";
import { MobilePreviewModal } from "./preview-modal";
import { PracusFab } from "./pracus-fab";
import { PracusQuickSheet } from "./pracus-quick-sheet";
import { track } from "@/lib/analytics/track";

function deriveKey(cv: unknown) {
  try {
    return JSON.stringify(cv);
  } catch {
    return "";
  }
}

export function MobileKreatorShell() {
  const router = useRouter();
  const { hasAI } = usePlan();
  const cv = useCVStore((s) => s.cv);
  const hydrated = useCVStore((s) => s.hydrated);
  const pageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pracusOpen, setPracusOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const depsKey = useMemo(() => deriveKey(cv), [cv]);
  const { effectiveFontSize, overflowed } = useAutoFit(
    cv.settings.fontSize,
    pageRef,
    bodyRef,
    depsKey,
  );

  const downloadExport = useCallback(
    async (format: "pdf" | "docx") => {
      setIsExporting(true);
      setExportError(null);
      try {
        const endpoint = format === "pdf" ? "/api/pdf" : "/api/docx";
        const payload =
          format === "pdf" ? { cvData: cv, effectiveFontSize } : { cvData: cv };
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 402) {
          router.refresh();
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }
        const blob = await res.blob();
        const name =
          [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join("-") || "cv";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        track("cv_exported", { format, template: cv.settings.templateId, variant: "mobile" });
        router.refresh();
      } catch (e) {
        setExportError((e as Error).message);
      } finally {
        setIsExporting(false);
      }
    },
    [cv, effectiveFontSize, router],
  );

  const downloadPDF = useCallback(() => downloadExport("pdf"), [downloadExport]);
  const downloadDOCX = useCallback(() => downloadExport("docx"), [downloadExport]);
  const openPreview = useCallback(() => setPreviewOpen(true), []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  if (!hydrated) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-cream text-ink-muted">
        <p className="font-body text-sm opacity-70">Ładuję Twoje CV…</p>
      </div>
    );
  }

  const templateClass =
    cv.settings.templateId === "atlas"
      ? "atlas-theme"
      : cv.settings.templateId === "terra"
        ? "terra-theme"
        : cv.settings.templateId === "cobalt"
          ? "cobalt-theme"
          : cv.settings.templateId === "lumen"
            ? "lumen-theme"
            : undefined;

  const templateNode =
    cv.settings.templateId === "atlas" ? (
      <TemplateAtlas />
    ) : cv.settings.templateId === "terra" ? (
      <TemplateTerra />
    ) : cv.settings.templateId === "cobalt" ? (
      <TemplateCobalt />
    ) : cv.settings.templateId === "lumen" ? (
      <TemplateLumen />
    ) : (
      <TemplateOrbit />
    );
  const decorations =
    cv.settings.templateId === "cobalt" ? <CobaltDecorativeBlobs /> : undefined;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream text-ink">
      <MobileTopBar
        onPreview={openPreview}
        overflowed={overflowed}
        autoSaveLabel={overflowed ? "Sprawdź treść" : "Zapisano"}
      />

      <main className="flex-1">
        {activeTab === "editor" ? <MobileTabEditor /> : null}
        {activeTab === "style" ? <MobileTabStyle /> : null}
        {activeTab === "ai" ? (
          <div className="flex h-[calc(100dvh-var(--mobile-top-h,3rem)-var(--bottom-nav-h,4rem)-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col">
            <MobileTabAI />
          </div>
        ) : null}
        {activeTab === "export" ? (
          <MobileTabExport
            isExporting={isExporting}
            exportError={exportError}
            overflowed={overflowed}
            effectiveFontSize={effectiveFontSize}
            onDownloadPDF={downloadPDF}
            onDownloadDOCX={downloadDOCX}
            onPreview={openPreview}
          />
        ) : null}
      </main>

      <MobileBottomNav active={activeTab} onChange={setActiveTab} />

      {/* Pracuś FAB — tylko dla planów z AI (Pro/Unlimited/Pack), widoczny w editor/style */}
      {hasAI && (activeTab === "editor" || activeTab === "style") ? (
        <PracusFab onOpen={() => setPracusOpen(true)} />
      ) : null}

      {hasAI ? (
        <PracusQuickSheet open={pracusOpen} onClose={() => setPracusOpen(false)} />
      ) : null}

      <MobilePreviewModal
        open={previewOpen}
        onClose={closePreview}
        pageRef={pageRef}
        bodyRef={bodyRef}
      >
        <PageA4
          settings={cv.settings}
          effectiveFontSize={effectiveFontSize}
          footer={<RodoFooter />}
          decorations={decorations}
          className={templateClass}
        >
          {templateNode}
        </PageA4>
      </MobilePreviewModal>

      {/* Hidden measuring tree: auto-fit needs a live PageA4 tree at all times. */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
        style={{ width: "210mm", height: "297mm" }}
      >
        <PageA4
          ref={pageRef}
          bodyRef={bodyRef}
          settings={cv.settings}
          effectiveFontSize={effectiveFontSize}
          footer={<RodoFooter />}
          decorations={decorations}
          className={templateClass}
        >
          {templateNode}
        </PageA4>
      </div>
    </div>
  );
}
