"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Toolbar } from "./toolbar";
import { clampZoom, ZOOM_STEP } from "./zoom-control";
import { usePlan } from "@/lib/plan/plan-context";
import { PracusPanel } from "./pracus/panel";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useIsClient } from "@/hooks/use-is-client";
import { MobileKreatorShell } from "./mobile/mobile-shell";
import { track } from "@/lib/analytics/track";

const AUTO_ZOOM_MIN = 0.4;
const AUTO_ZOOM_MAX = 1.2;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795275591;

function deriveKey(cv: unknown) {
  try {
    return JSON.stringify(cv);
  } catch {
    return "";
  }
}

export function KreatorShell() {
  const isClient = useIsClient();
  const isMobile = useIsMobile();

  if (isClient && isMobile) {
    return <MobileKreatorShell />;
  }

  return <DesktopKreatorShell />;
}

function DesktopKreatorShell() {
  const router = useRouter();
  const { hasAI } = usePlan();
  const showAiPanel = hasAI;

  const cv = useCVStore((s) => s.cv);
  const hydrated = useCVStore((s) => s.hydrated);
  const pageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [autoZoom, setAutoZoom] = useState(1);
  const [manualZoom, setManualZoom] = useState(1);
  const [zoomMode, setZoomMode] = useState<"auto" | "manual">("manual");

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const depsKey = useMemo(() => deriveKey(cv), [cv]);
  const { effectiveFontSize, overflowed } = useAutoFit(
    cv.settings.fontSize,
    pageRef,
    bodyRef,
    depsKey,
  );

  useEffect(() => {
    if (!hydrated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a4Width = A4_WIDTH_MM * MM_TO_PX;
    const computeZoom = () => {
      const padding = 48;
      const available = canvas.clientWidth - padding;
      const next = Math.max(AUTO_ZOOM_MIN, Math.min(AUTO_ZOOM_MAX, available / a4Width));
      setAutoZoom(Number(next.toFixed(2)));
    };
    const raf = requestAnimationFrame(computeZoom);
    const observer = new ResizeObserver(computeZoom);
    observer.observe(canvas);
    window.addEventListener("resize", computeZoom);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", computeZoom);
    };
  }, [hydrated]);

  const effectiveZoom = zoomMode === "auto" ? autoZoom : manualZoom;

  const handleZoomChange = useCallback((next: number) => {
    setManualZoom(clampZoom(next));
    setZoomMode("manual");
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomMode("auto");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        const base = zoomMode === "auto" ? autoZoom : manualZoom;
        setManualZoom(clampZoom(base + ZOOM_STEP));
        setZoomMode("manual");
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        const base = zoomMode === "auto" ? autoZoom : manualZoom;
        setManualZoom(clampZoom(base - ZOOM_STEP));
        setZoomMode("manual");
      } else if (e.key === "0") {
        e.preventDefault();
        setZoomMode("auto");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoZoom, manualZoom, zoomMode]);

  const downloadExport = async (format: "pdf" | "docx") => {
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
        // Plan limit osiągnięty — odśwież, żeby KreatorGated przełączył się na blok-screen.
        router.refresh();
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const name = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join("-") || "cv";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      track("cv_exported", { format, template: cv.settings.templateId });
      // Po udanym pobraniu odśwież usage — jeśli był to ostatni dostępny slot,
      // KreatorGated pokaże blok-screen z CTA do zakupu.
      router.refresh();
    } catch (e) {
      setExportError((e as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = () => downloadExport("pdf");
  const downloadDOCX = () => downloadExport("docx");

  if (!hydrated) {
    return (
      <div className="min-h-[100dvh] grid place-items-center bg-cream text-ink-muted">
        <p className="font-body text-sm opacity-70">Ładuję Twoje CV…</p>
      </div>
    );
  }

  const scaledWidth = A4_WIDTH_MM * MM_TO_PX * effectiveZoom;
  const scaledHeight = A4_HEIGHT_MM * MM_TO_PX * effectiveZoom;

  const canvas = (
    <div
      ref={canvasRef}
      className={
        showAiPanel
          ? "flex-1 min-w-0 max-w-[1100px] overflow-auto"
          : "flex-1 min-w-0 overflow-auto"
      }
    >
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <div
          style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
        >
          <div
            style={{
              transform: `scale(${effectiveZoom})`,
              transformOrigin: "top left",
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
            }}
          >
            <PageA4
              ref={pageRef}
              bodyRef={bodyRef}
              settings={cv.settings}
              effectiveFontSize={effectiveFontSize}
              footer={<RodoFooter />}
              decorations={
                cv.settings.templateId === "cobalt" ? <CobaltDecorativeBlobs /> : undefined
              }
              className={
                cv.settings.templateId === "atlas"
                  ? "atlas-theme"
                  : cv.settings.templateId === "terra"
                    ? "terra-theme"
                    : cv.settings.templateId === "cobalt"
                      ? "cobalt-theme"
                      : cv.settings.templateId === "lumen"
                        ? "lumen-theme"
                        : undefined
              }
            >
              {cv.settings.templateId === "atlas" ? (
                <TemplateAtlas />
              ) : cv.settings.templateId === "terra" ? (
                <TemplateTerra />
              ) : cv.settings.templateId === "cobalt" ? (
                <TemplateCobalt />
              ) : cv.settings.templateId === "lumen" ? (
                <TemplateLumen />
              ) : (
                <TemplateOrbit />
              )}
            </PageA4>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-cream text-ink flex flex-col">
      <Toolbar
        effectiveFontSize={effectiveFontSize}
        overflowed={overflowed}
        onDownloadPDF={downloadPDF}
        onDownloadDOCX={downloadDOCX}
        isExporting={isExporting}
        zoom={effectiveZoom}
        zoomMode={zoomMode}
        onZoomChange={handleZoomChange}
        onZoomReset={handleZoomReset}
      />
      {exportError ? (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-[12px] text-rose-700">
          Błąd eksportu PDF: {exportError}
        </div>
      ) : null}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {showAiPanel ? (
          <div className="flex-1 w-full flex items-stretch justify-center gap-6 xl:gap-10 px-6 xl:px-10 overflow-hidden min-h-0">
            {canvas}
            <PracusPanel />
          </div>
        ) : (
          <div className="flex-1 w-full flex items-stretch justify-center overflow-hidden min-h-0">
            {canvas}
          </div>
        )}
      </div>
    </div>
  );
}
