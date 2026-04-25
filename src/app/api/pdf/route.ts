import { cvDataSchema } from "@/lib/cv/schema";
import { renderCVToHTML } from "@/lib/cv/render-html";
import { requireUser } from "@/lib/auth/guard";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  canDownload,
  claimPackCredit,
  refundPackCredit,
  planLimitResponse,
  recordUsage,
  type PackClaim,
} from "@/lib/plans/usage";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";

export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024;

let cachedChromePath: string | null = null;

const requestSchema = z.object({
  cvData: cvDataSchema,
  effectiveFontSize: z.number().min(6).max(20).optional(),
});

async function getBrowser() {
  const puppeteer = (await import("puppeteer-core")).default;

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  if (!cachedChromePath) {
    const possiblePaths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      process.env.LOCALAPPDATA
        ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
        : "",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ].filter(Boolean);

    const fs = await import("fs");
    const found = possiblePaths.find((p) => {
      try {
        fs.accessSync(p);
        return true;
      } catch {
        return false;
      }
    });

    if (!found) {
      throw new Error(
        "Chrome/Chromium nie znaleziony. Zainstaluj Google Chrome lub ustaw zmienną CHROME_PATH.",
      );
    }

    cachedChromePath = process.env.CHROME_PATH || found;
  }

  return puppeteer.launch({
    executablePath: cachedChromePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--mute-audio",
      "--hide-scrollbars",
    ],
  });
}

export async function POST(request: Request): Promise<Response> {
  // Auth gate — pobranie PDF wymaga zalogowanego użytkownika gdy Supabase jest skonfigurowany.
  // W dev bez Supabase (anon-only) działa jak przedtem.
  let authUser: User | null = null;
  let usedPackSource = false;
  if (isSupabaseConfigured()) {
    const guard = await requireUser();
    if (!guard.ok) return guard.response;
    authUser = guard.user;

    // Plan gating — sprawdzenie limitu pobrań per-plan (Free:1, Pro:10, Unlimited:∞, Pro Pack: credits)
    const check = await canDownload(authUser);
    if (!check.ok) return planLimitResponse(check);
    usedPackSource = check.source === "pro_pack";
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowy format JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Błąd walidacji danych CV", details: parsed.error.flatten() }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  const { cvData, effectiveFontSize } = parsed.data;

  // P0.4: claim Pro Pack credit ATOMOWO przed render. Przy błędzie — refund.
  // canDownload mógł powiedzieć ok dla pro_pack ale w międzyczasie ktoś inny
  // zajął credit (concurrent download) — wtedy claim zwróci null → 402.
  let packClaim: PackClaim | null = null;
  if (authUser && usedPackSource) {
    packClaim = await claimPackCredit(authUser.id);
    if (!packClaim) {
      return planLimitResponse({
        ok: false,
        reason: "plan_limit",
        plan: "pro",
        limit: 0,
        used: 0,
      });
    }
  }

  const html = renderCVToHTML(cvData, effectiveFontSize);

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.emulateMediaType("screen");

    // Network whitelist: tylko data: URL (user photos) + Google Fonts.
    // Blokuje SSRF via attacker-controlled URLs w user CV (photo/website).
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.startsWith("data:") ||
        url.startsWith("https://fonts.googleapis.com/") ||
        url.startsWith("https://fonts.gstatic.com/") ||
        url === "about:blank"
      ) {
        req.continue();
      } else {
        req.abort();
      }
    });

    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15_000 });
    try {
      // Deterministyczne oczekiwanie na fonts zamiast networkidle0.
      await page.evaluate(() => (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready);
    } catch {
      // fallback — kontynuuj nawet jeśli fonts API niedostępne
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      timeout: 20_000,
    });

    if (pdf.length > MAX_PDF_BYTES) {
      // PDF wygenerowany ale za duży — refund credit (user nie dostaje pliku).
      if (packClaim) void refundPackCredit(packClaim.claim_id);
      return new Response(
        JSON.stringify({ error: "PDF wynikowy przekracza limit rozmiaru" }),
        { status: 413, headers: { "Content-Type": "application/json" } },
      );
    }

    // Zapisz usage do audit (credit już zclaimed atomowo PRZED render w P0.4 flow)
    if (authUser) {
      void recordUsage(authUser.id, "pdf", {
        bytes: pdf.length,
        source: usedPackSource ? "pro_pack" : "subscription_or_free",
        claim_id: packClaim?.claim_id ?? null,
      });
    }

    const fileName =
      [cvData.personal.firstName, cvData.personal.lastName]
        .filter(Boolean)
        .join("-")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "cv";

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    // P0.4: render failed — refund credit jeśli był claimed.
    if (packClaim) void refundPackCredit(packClaim.claim_id);
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/pdf] Błąd generowania PDF:", err);
    return new Response(
      JSON.stringify({
        error: `Nie udało się wygenerować pliku PDF: ${message}`,
        code: "pdf_generation_failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // Ignore close errors — browser mogło już paść.
      }
    }
  }
}
