import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Kreator CV",
  description:
    "Wypełnij formularz i stwórz profesjonalne CV z asystentem AI Pracuś.",
};

// Sprawdzamy sesję na każdym renderze — gate auth musi być świeży.
export const dynamic = "force-dynamic";

export default async function KreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth gate — wejście do kreatora zawsze wymaga logowania (gdy Supabase skonfigurowany).
  // W dev bez env vars Supabase — brak gate (user dev-mode bez konta).
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      redirect("/zaloguj?next=/kreator");
    }
  }

  return <>{children}</>;
}
