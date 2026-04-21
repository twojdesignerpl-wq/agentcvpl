/**
 * POST /api/fetch-job
 *
 * Pobiera tresc ogloszenia o prace z podanego linka.
 *
 * Zabezpieczenia:
 * 1. Wejscie: tylko https:// URL (Zod).
 * 2. Whitelist domen polskich portali pracy.
 * 3. SSRF protection: reject IP literals + DNS lookup + reject prywatnych adresow.
 * 4. Manual redirect loop — kazdy hop sprawdzany od nowa.
 * 5. Limit rozmiaru odpowiedzi (500 KB, streaming abort przy przekroczeniu).
 * 6. Timeout (10 s, AbortController).
 * 7. Content-Type — tylko text/html / application/xhtml+xml.
 * 8. Parsing — regex-based, bez deps. Strip scripts/styles, extract tekst + OG.
 *
 * Rate limit: 5 req/min (src/proxy.ts). Same-origin check w proxy.
 */

import { promises as dnsPromises } from "node:dns";
import net from "node:net";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_BYTES = 500_000;
const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MAX_CONTENT_CHARS = 7500;

const requestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(10)
    .max(2048)
    .regex(/^https:\/\/\S+$/i, "Tylko linki https:// sa obslugiwane"),
});

/**
 * Lista znanych polskich portali pracy. Używana do dwóch rzeczy:
 * 1. Tier-based walidacja treści (known = luźniejsza heurystyka, unknown = ostrzejsza).
 * 2. Path-scope dla portali wielofunkcyjnych (OLX, LinkedIn, Indeed).
 *
 * NIE JEST whitelistem dostępu — fetch działa na każdej publicznej HTTPS domenie
 * (po SSRF protection). Domena nieznana = treść musi silnie wskazywać na ogłoszenie.
 */
const KNOWN_JOB_DOMAINS: string[] = [
  "pracuj.pl",
  "nofluffjobs.com",
  "justjoin.it",
  "olx.pl",
  "rocketjobs.pl",
  "bulldogjob.pl",
  "bulldogjob.com",
  "theprotocol.it",
  "the-protocol.it",
  "aplikuj.pl",
  "hrlink.pl",
  "praca.pl",
  "gowork.pl",
  "infopraca.pl",
  "erecruiter.pl",
  "kariera.pl",
  "absolvent.pl",
  "jooble.org",
  "indeed.com",
  "linkedin.com",
  "pracait.pl",
  "glassdoor.com",
  "glassdoor.pl",
  "monster.pl",
  "jobs.pl",
  "careerjet.pl",
  "hays.pl",
  "randstad.pl",
  "adecco.pl",
  "manpower.pl",
];

function isKnownJobDomain(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return KNOWN_JOB_DOMAINS.some((d) => h === d || h.endsWith("." + d));
}

/** Domeny / TLD-y które zawsze odrzucamy (pseudo-TLD, lokalne, rezerwowane). */
const BLOCKED_TLDS = [
  ".local",
  ".lan",
  ".internal",
  ".test",
  ".invalid",
  ".localhost",
  ".home",
  ".corp",
  ".example",
];
const BLOCKED_HOSTS = new Set(["localhost", "broadcasthost"]);

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(h)) return true;
  return BLOCKED_TLDS.some((tld) => h.endsWith(tld));
}

// ─── SSRF ─────────────────────────────────────────────────────────────────────

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 224 || (a >= 240 && a <= 255)) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::" || lower === "0:0:0:0:0:0:0:1") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("fe8") || lower.startsWith("fe9") ||
      lower.startsWith("fea") || lower.startsWith("feb")) return true;
  if (lower.startsWith("ff")) return true;
  const mapped = lower.match(/^::ffff:([0-9.]+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

function isPrivateIP(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true;
}

async function resolvesToPublicAddress(hostname: string): Promise<boolean> {
  if (net.isIP(hostname)) return !isPrivateIP(hostname);
  try {
    const addrs = await dnsPromises.lookup(hostname, { all: true });
    if (addrs.length === 0) return false;
    return addrs.every((a) => !isPrivateIP(a.address));
  } catch {
    return false;
  }
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

type FetchResult = {
  finalUrl: string;
  html: string;
  truncated: boolean;
};

class FetchError extends Error {}

async function safeFetch(initialUrl: string): Promise<FetchResult> {
  let currentUrl = initialUrl;
  const seen = new Set<string>();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (seen.has(currentUrl)) throw new FetchError("Wykryto petle przekierowan.");
    seen.add(currentUrl);

    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      throw new FetchError("Nieprawidlowy URL.");
    }

    if (parsed.protocol !== "https:") {
      throw new FetchError("Tylko adresy https:// sa obslugiwane.");
    }
    if (net.isIP(parsed.hostname)) {
      throw new FetchError("Adresy IP nie sa obslugiwane.");
    }
    if (isBlockedHost(parsed.hostname)) {
      throw new FetchError("Ten adres nie jest obslugiwany (domena lokalna/rezerwowana).");
    }

    if (!(await resolvesToPublicAddress(parsed.hostname))) {
      throw new FetchError("Adres docelowy nie moze byc publiczny (SSRF).");
    }

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(currentUrl, {
        signal: ac.signal,
        redirect: "manual",
        headers: {
          // Przeglądarkowy UA — wiele portali pracy blokuje nieznanych botów.
          // Intencja: pobrać treść ogłoszenia, do której użytkownik ma publiczny dostęp.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Sec-Ch-Ua": '"Chromium";v="121", "Not A(Brand";v="99"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Upgrade-Insecure-Requests": "1",
        },
      });
    } catch (e) {
      clearTimeout(timer);
      if ((e as Error).name === "AbortError") {
        throw new FetchError("Przekroczono czas oczekiwania na odpowiedz serwera.");
      }
      throw new FetchError("Nie udalo sie polaczyc z serwerem.");
    }
    clearTimeout(timer);

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new FetchError("Przekierowanie bez adresu docelowego.");
      try {
        currentUrl = new URL(loc, currentUrl).toString();
      } catch {
        throw new FetchError("Nieprawidlowy adres przekierowania.");
      }
      await res.body?.cancel();
      continue;
    }

    if (!res.ok) {
      await res.body?.cancel();
      throw new FetchError(`Serwer zwrocil blad HTTP ${res.status}.`);
    }

    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
      await res.body?.cancel();
      throw new FetchError("Strona nie jest dokumentem HTML.");
    }

    const clHeader = res.headers.get("content-length");
    if (clHeader && Number(clHeader) > MAX_BYTES * 2) {
      await res.body?.cancel();
      throw new FetchError("Strona przekracza dozwolony rozmiar.");
    }

    const { text, truncated } = await readCapped(res, MAX_BYTES);
    return { finalUrl: currentUrl, html: text, truncated };
  }

  throw new FetchError("Zbyt wiele przekierowan.");
}

async function readCapped(res: Response, maxBytes: number): Promise<{ text: string; truncated: boolean }> {
  if (!res.body) return { text: "", truncated: false };
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let total = 0;
  let truncated = false;
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      truncated = true;
      const overshoot = total - maxBytes;
      const keep = value.length - overshoot;
      if (keep > 0) chunks.push(decoder.decode(value.subarray(0, keep), { stream: true }));
      await reader.cancel();
      break;
    }
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return { text: chunks.join(""), truncated };
}

// ─── Parse ────────────────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const code = parseInt(n, 16);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    });
}

interface ParsedListing {
  title: string;
  content: string;
  metaDescription: string;
}

function extract(html: string): ParsedListing {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<template[\s\S]*?<\/template>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");

  const meta: Record<string, string> = {};
  const metaRe =
    /<meta\s+(?:[^>]*?(?:property|name)=["']([^"']+)["'])[^>]*?content=["']([^"']*)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(s)) !== null) {
    meta[m[1].toLowerCase()] = decodeEntities(m[2]);
  }
  const metaRe2 =
    /<meta\s+(?:[^>]*?content=["']([^"']*)["'])[^>]*?(?:property|name)=["']([^"']+)["'][^>]*>/gi;
  while ((m = metaRe2.exec(s)) !== null) {
    meta[m[2].toLowerCase()] = decodeEntities(m[1]);
  }

  const titleMatch = s.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = (meta["og:title"] ?? titleMatch?.[1] ?? "").trim();

  const mainMatch =
    s.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ??
    s.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const bodyMatch = s.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = mainMatch?.[1] ?? bodyMatch?.[1] ?? s;

  body = body.replace(/<\/(li|p|div|h[1-6]|br|tr|section|article|ul|ol)[^>]*>/gi, "\n");
  body = body.replace(/<br\s*\/?>/gi, "\n");
  body = body.replace(/<[^>]+>/g, " ");
  body = decodeEntities(body);

  body = body
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\t+/g, " ")
    .replace(/[ \u00A0]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (body.length > MAX_CONTENT_CHARS) {
    body = body.slice(0, MAX_CONTENT_CHARS).trimEnd() + "…";
  }

  return {
    title,
    content: body,
    metaDescription: meta["og:description"] ?? meta["description"] ?? "",
  };
}

function detectSource(hostname: string): string {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  if (h.endsWith("pracuj.pl")) return "pracuj";
  if (h.endsWith("linkedin.com")) return "linkedin";
  if (h.endsWith("nofluffjobs.com")) return "nofluffjobs";
  if (h.endsWith("justjoin.it")) return "justjoin";
  if (h.endsWith("rocketjobs.pl")) return "rocketjobs";
  return "other";
}

/**
 * Heurystyka "czy to ogloszenie pracy" z tier-based progiem.
 * - known = znany portal pracy → 2 sygnaly wystarczy (luzniej, bo na 99% ogloszenie)
 * - unknown = dowolna HTTPS domena → 4 sygnaly + min 500 znakow tresci
 */
function looksLikeJobOffer(
  title: string,
  content: string,
  known: boolean,
): { ok: true } | { ok: false; reason: string } {
  if (content.length < 120) {
    return {
      ok: false,
      reason:
        "Pod tym adresem znaleziono tylko kilka zdan tresci — prawdopodobnie to nie jest ogloszenie pracy (albo strona wymaga logowania).",
    };
  }
  if (!known && content.length < 500) {
    return {
      ok: false,
      reason:
        "Tresc strony jest zbyt krotka jak na ogloszenie pracy. Skopiuj tresc ogloszenia recznie.",
    };
  }

  const combined = `${title}\n${content}`.toLowerCase();
  const signals = [
    "wymagania",
    "obowiazki",
    "obowiązki",
    "zakres obowiazkow",
    "zakres obowiązków",
    "oferujemy",
    "twoja rola",
    "twoje zadania",
    "czego oczekujemy",
    "co oferujemy",
    "odpowiedzialnosci",
    "odpowiedzialności",
    "mile widziane",
    "dobrze widziane",
    "twoj zakres",
    "twój zakres",
    "oferta pracy",
    "ogloszenie",
    "ogłoszenie",
    "lokalizacja",
    "miejsce pracy",
    "wynagrodzenie",
    "zatrudnienie",
    "umowa o prace",
    "umowa o pracę",
    "b2b",
    "praca zdalna",
    "praca hybrydowa",
    "requirements",
    "responsibilities",
    "we offer",
    "what we offer",
    "your role",
    "about the role",
    "qualifications",
    "benefits",
    "must have",
    "nice to have",
    "apply",
    "aplikuj",
  ];
  const hits = signals.reduce((acc, w) => acc + (combined.includes(w) ? 1 : 0), 0);
  const minHits = known ? 2 : 4;

  if (hits < minHits) {
    return {
      ok: false,
      reason: known
        ? "Strona nie zawiera typowych sekcji ogloszenia (wymagania, obowiazki, oferujemy). Skopiuj tresc recznie."
        : "Ta strona nie wyglada na ogloszenie o prace — brakuje typowych sekcji (wymagania, obowiazki, oferujemy, benefity). Jesli to jednak oferta pracy, skopiuj jej tresc recznie i wklej w pole ponizej.",
    };
  }

  return { ok: true };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Nieprawidlowy JSON." });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return json(422, { error: "Podaj poprawny adres https:// do ogloszenia pracy." });
  }

  let url: URL;
  try {
    url = new URL(parsed.data.url);
  } catch {
    return json(422, { error: "Nieprawidlowy format URL." });
  }

  if (url.protocol !== "https:") {
    return json(422, { error: "Tylko adresy https:// sa obslugiwane." });
  }
  if (net.isIP(url.hostname)) {
    return json(422, { error: "Adresy IP nie sa obslugiwane." });
  }
  if (isBlockedHost(url.hostname)) {
    return json(422, {
      error: "Ten adres nie jest obslugiwany (domena lokalna/rezerwowana).",
    });
  }

  const known = isKnownJobDomain(url.hostname);

  let result: FetchResult;
  try {
    result = await safeFetch(url.toString());
  } catch (e) {
    const msg = e instanceof FetchError ? e.message : "Nie udalo sie pobrac ogloszenia.";
    return json(502, { error: msg });
  }

  const listing = extract(result.html);
  const check = looksLikeJobOffer(listing.title, listing.content, known);
  if (!check.ok) {
    return json(422, { error: check.reason });
  }

  return json(200, {
    ok: true,
    title: listing.title,
    content: listing.content,
    metaDescription: listing.metaDescription,
    source: detectSource(url.hostname),
    hostname: url.hostname,
    finalUrl: result.finalUrl,
    truncated: result.truncated,
    tier: known ? "known" : "unknown",
  });
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
