"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plans/quotas";
import { sendPlanGranted } from "@/lib/email/send";

const grantSchema = z.object({
  userId: z.string().uuid(),
  plan: z.enum(["free", "pro", "unlimited"]),
  reason: z.string().min(3, "Powód wymagany (min 3 znaki)").max(500),
  notifyUser: z.boolean().optional(),
});

export type GrantResult =
  | { ok: true; plan: "free" | "pro" | "unlimited"; emailSent: boolean }
  | { ok: false; error: string };

export async function grantPlan(input: unknown): Promise<GrantResult> {
  const parsed = grantSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane" };
  }
  const g = await requireAdmin();
  if (!g.ok) return { ok: false, error: "forbidden" };

  const admin = createSupabaseServiceClient();
  const { data: target, error: fetchErr } = await admin.auth.admin.getUserById(parsed.data.userId);
  if (fetchErr || !target.user) {
    return { ok: false, error: "user_not_found" };
  }

  const fromPlan = getUserPlan(target.user);
  if (fromPlan === parsed.data.plan) {
    return { ok: false, error: `Użytkownik ma już plan ${parsed.data.plan}` };
  }

  const { error: upErr } = await admin.auth.admin.updateUserById(parsed.data.userId, {
    app_metadata: { ...(target.user.app_metadata ?? {}), plan: parsed.data.plan },
  });
  if (upErr) return { ok: false, error: upErr.message };

  await admin.from("plan_grants").insert({
    user_id: parsed.data.userId,
    email: target.user.email ?? "",
    from_plan: fromPlan,
    to_plan: parsed.data.plan,
    reason: parsed.data.reason,
    source: "admin",
    granted_by: g.user.id,
  });

  let emailSent = false;
  if (parsed.data.notifyUser !== false && target.user.email) {
    const result = await sendPlanGranted(
      { id: parsed.data.userId, email: target.user.email },
      parsed.data.plan,
      parsed.data.reason,
    );
    emailSent = result.ok;
  }

  revalidatePath(`/admin/users/${parsed.data.userId}`);
  revalidatePath("/admin/users");
  revalidatePath("/admin/grants");
  revalidatePath("/admin");
  return { ok: true, plan: parsed.data.plan, emailSent };
}
