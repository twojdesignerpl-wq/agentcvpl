import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OAuth PKCE callback handler. Supabase redirectuje tutaj po pomyślnym
 * logowaniu Google/Facebook z `?code=...`. Wymieniamy kod na sesję + redirect
 * do "next" (preferowane źródło: cookie auth_next zapisane przez LoginButtons —
 * survival przez OAuth round-trip gdy Supabase nie propaguje query string;
 * fallback: ?next= param — dla magic linków które mają pełne URL).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const cookieNext = request.cookies.get("auth_next")?.value;
  const queryNext = searchParams.get("next");
  const rawNext = cookieNext ? decodeURIComponent(cookieNext) : queryNext;
  const next = rawNext ?? "/konto";
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/zaloguj?error=${encodeURIComponent(errorDescription)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/zaloguj?error=missing_code`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/zaloguj?error=${encodeURIComponent(error.message)}`,
      );
    }

    // Welcome email dla nowych userów (created < 5 min temu). Fire-and-forget,
    // nie blokuj redirectu jeśli Resend padnie.
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email) {
        const createdAgo = Date.now() - new Date(userData.user.created_at).getTime();
        if (createdAgo < 5 * 60_000) {
          const metaName = (userData.user.user_metadata as { name?: string; full_name?: string } | null)
            ?.full_name ?? (userData.user.user_metadata as { name?: string } | null)?.name;
          void import("@/lib/email/send")
            .then((m) =>
              m.sendWelcome({
                id: userData.user!.id,
                email: userData.user!.email!,
                name: metaName,
              }),
            )
            .catch((err) => console.error("[welcome email]", err));
        }
      }
    } catch (err) {
      console.error("[welcome email trigger]", err);
    }
  } catch (e) {
    return NextResponse.redirect(
      `${origin}/zaloguj?error=${encodeURIComponent((e as Error).message)}`,
    );
  }

  // Chronione przed open redirect — tylko relative paths
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/konto";
  const response = NextResponse.redirect(`${origin}${safeNext}`);
  // Wyczyść cookie auth_next po konsumpcji — nie chcemy żeby zostawała dla kolejnych logowań.
  if (cookieNext) {
    response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });
  }
  return response;
}
