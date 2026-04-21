import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const runtime = "nodejs";
export const maxDuration = 10;

const schema = z.object({
  email: z.string().min(5).max(254).email(),
  source: z.string().max(64).optional(),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Niepoprawny adres email" }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const source = parsed.data.source?.slice(0, 64) ?? null;

  // Jeśli Supabase nie skonfigurowany (dev) — zachowaj poprzednie zachowanie
  // (200 OK, żeby formularz nie wybuchał). W prod Supabase jest wymagany.
  if (!isSupabaseConfigured()) {
    return new Response(
      JSON.stringify({ ok: true, message: "Zapisano (dev — brak Supabase)" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const admin = createSupabaseServiceClient();
    const { error } = await admin
      .from("newsletter_subscribers")
      .upsert(
        { email, source },
        { onConflict: "email", ignoreDuplicates: false },
      );
    if (error) {
      console.error("[/api/newsletter] Supabase error:", error.message);
      return new Response(
        JSON.stringify({ error: "Zapis nie powiódł się — spróbuj ponownie." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("[/api/newsletter] Unexpected error:", (err as Error).message);
    return new Response(
      JSON.stringify({ error: "Zapis nie powiódł się — spróbuj ponownie." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, message: "Zapisano. Sprawdź skrzynkę za tydzień." }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
