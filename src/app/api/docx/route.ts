import { cvDataSchema } from "@/lib/cv/schema";
import { renderCVToDocx } from "@/lib/cv/render-docx";
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

export const maxDuration = 30;
export const runtime = "nodejs";

const requestSchema = z.object({
  cvData: cvDataSchema,
});

export async function POST(request: Request): Promise<Response> {
  let authUser: User | null = null;
  let usedPackSource = false;
  if (isSupabaseConfigured()) {
    const guard = await requireUser();
    if (!guard.ok) return guard.response;
    authUser = guard.user;

    const check = await canDownload(authUser);
    if (!check.ok) return planLimitResponse(check);
    usedPackSource = check.source === "pro_pack";
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Walidacja danych CV nieudana", details: parsed.error.flatten() }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  // P0.4: atomic claim PRZED render; refund jeśli render fail.
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

  try {
    const buffer = await renderCVToDocx(parsed.data.cvData);

    if (authUser) {
      void recordUsage(authUser.id, "docx", {
        bytes: buffer.length,
        source: usedPackSource ? "pro_pack" : "subscription_or_free",
        claim_id: packClaim?.claim_id ?? null,
      });
    }

    const fileName =
      [parsed.data.cvData.personal.firstName, parsed.data.cvData.personal.lastName]
        .filter(Boolean)
        .join("-")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "cv";

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}.docx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (packClaim) void refundPackCredit(packClaim.claim_id);
    console.error("[/api/docx] Błąd generowania DOCX:", err);
    return new Response(
      JSON.stringify({ error: "Nie udało się wygenerować pliku DOCX. Spróbuj ponownie za chwilę." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
