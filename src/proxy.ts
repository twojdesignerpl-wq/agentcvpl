import { NextResponse, type NextRequest } from "next/server";
import { checkLimit, getClientIp, type RateResult } from "@/lib/rate-limit";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

// Per-IP limit w oknie 60s (pierwsza linia obrony — chroni przed pojedynczym abuserem)
const LIMITS: Record<string, number> = {
  "/api/chat": 10,
  "/api/cv/ai": 15,
  "/api/pdf": 10,
  "/api/docx": 20,
  "/api/newsletter": 5,
  "/api/fetch-job": 5,
  "/api/og": 60,
  "/api/resend/inbound": 60, // Resend webhook — 1 email/s peak
};

// Global cap w oknie 60s (killswitch — chroni przed rozproszonym atakiem na endpoint AI)
const GLOBAL_LIMITS: Record<string, number> = {
  "/api/chat": 500,
  "/api/cv/ai": 600,
  "/api/pdf": 400,
  "/api/docx": 500,
  "/api/fetch-job": 200,
  "/api/og": 2000,
  "/api/resend/inbound": 600, // Sumaryczny killswitch dla inbound emails
};

// Daily cap per-IP (24h) — anti-abuse dla drogich modeli AI
const DAILY_LIMITS: Record<string, number> = {
  "/api/chat": 200,
  "/api/cv/ai": 300,
};

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

function tooMany(res: RateResult): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000));
  return new NextResponse(
    JSON.stringify({ error: "Za dużo zapytań. Spróbuj ponownie za chwilę." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(res.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(res.reset / 1000)),
      },
    },
  );
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;

  // Refresh Supabase sesji (no-op jeśli Supabase nie skonfigurowany).
  // Robimy to zawsze — nie tylko dla /api — bo Server Components też potrzebują aktualnego tokenu.
  const supabaseResponse = await updateSupabaseSession(req);

  if (path.startsWith("/api/") && !isSameOrigin(req)) {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden origin" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  const perIpLimit = LIMITS[path];
  if (!perIpLimit) return supabaseResponse;

  const ip = getClientIp(req);

  // 1. Global cap — killswitch dla całego endpointa
  const globalLimit = GLOBAL_LIMITS[path];
  if (globalLimit) {
    const global = await checkLimit(`global:${path}`, "all", globalLimit, 60);
    if (!global.success) return tooMany(global);
  }

  // 2. Daily cap per IP (tylko dla drogich endpointów)
  const dailyLimit = DAILY_LIMITS[path];
  if (dailyLimit) {
    const daily = await checkLimit(`day:${path}`, ip, dailyLimit, 86_400);
    if (!daily.success) return tooMany(daily);
  }

  // 3. Per-IP per 60s (podstawowy limit)
  const minute = await checkLimit(path, ip, perIpLimit, 60);
  if (!minute.success) return tooMany(minute);

  supabaseResponse.headers.set("X-RateLimit-Limit", String(perIpLimit));
  supabaseResponse.headers.set("X-RateLimit-Remaining", String(minute.remaining));
  return supabaseResponse;
}

// Match wszystkie routes z wyjątkiem static/image/favicon — session refresh potrzebny
// dla Server Components. Dla /api/* dodatkowo odpala rate limit + same-origin.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|manifest.json|grain.svg|brand/|landing/).*)",
  ],
};
