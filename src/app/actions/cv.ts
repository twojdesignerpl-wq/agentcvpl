"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cvDataSchema, type CVData } from "@/lib/cv/schema";

export type CvRow = {
  id: string;
  data: CVData;
  effective_font_size: number | null;
  created_at: string;
  updated_at: string;
};

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

const saveInput = z.object({
  id: z.string().uuid().nullable().optional(),
  cv: cvDataSchema,
  effectiveFontSize: z.number().min(6).max(20).optional(),
});

/**
 * Upsert CV. Jeśli `id` podany — update; bez — nowy record.
 * Zwraca ID (do zapisu w Zustand jako `syncedCvId`).
 */
export async function saveCvAction(input: {
  id?: string | null;
  cv: CVData;
  effectiveFontSize?: number;
}): Promise<ActionResult<{ id: string }>> {
  const parsed = saveInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Nieprawidłowe dane CV", code: "validation" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { ok: false, error: "Nie jesteś zalogowany", code: "unauthenticated" };
  }

  const payload = {
    user_id: authData.user.id,
    data: parsed.data.cv,
    effective_font_size: parsed.data.effectiveFontSize ?? null,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("cvs")
      .update(payload)
      .eq("id", parsed.data.id)
      .eq("user_id", authData.user.id);
    if (error) return { ok: false, error: error.message, code: "db" };
    revalidatePath("/konto/cv");
    return { ok: true, data: { id: parsed.data.id } };
  }

  const { data, error } = await supabase
    .from("cvs")
    .insert(payload)
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Zapis nie powiódł się", code: "db" };
  revalidatePath("/konto/cv");
  return { ok: true, data: { id: data.id } };
}

export async function listCvsAction(): Promise<ActionResult<CvRow[]>> {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { ok: false, error: "Nie jesteś zalogowany", code: "unauthenticated" };

  const { data, error } = await supabase
    .from("cvs")
    .select("id, data, effective_font_size, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) return { ok: false, error: error.message, code: "db" };
  return { ok: true, data: (data ?? []) as CvRow[] };
}

export async function loadCvAction(id: string): Promise<ActionResult<CvRow>> {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { ok: false, error: "Nie jesteś zalogowany", code: "unauthenticated" };

  const { data, error } = await supabase
    .from("cvs")
    .select("id, data, effective_font_size, created_at, updated_at")
    .eq("id", id)
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Nie znaleziono CV", code: "not_found" };
  return { ok: true, data: data as CvRow };
}

export async function deleteCvAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { ok: false, error: "Nie jesteś zalogowany", code: "unauthenticated" };

  const { error } = await supabase
    .from("cvs")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);
  if (error) return { ok: false, error: error.message, code: "db" };
  revalidatePath("/konto/cv");
  return { ok: true, data: undefined };
}
