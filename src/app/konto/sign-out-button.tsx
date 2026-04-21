"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="tap-target inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <SignOut size={14} weight="regular" />
      {loading ? "Wylogowuję…" : "Wyloguj się"}
    </button>
  );
}
