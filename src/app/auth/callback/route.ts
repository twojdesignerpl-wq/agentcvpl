import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OAuth PKCE callback handler. Supabase redirectuje tutaj po pomyślnym
 * logowaniu Google/Facebook z `?code=...`. Wymieniamy kod na sesję + redirect
 * do `next` param (domyślnie `/konto`).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/konto";
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
  } catch (e) {
    // Supabase env vars missing — przekieruj z informacją dla dev
    return NextResponse.redirect(
      `${origin}/zaloguj?error=${encodeURIComponent((e as Error).message)}`,
    );
  }

  // Chronione przed open redirect — tylko relative paths
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/konto";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
