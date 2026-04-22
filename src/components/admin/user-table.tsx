"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";

export type AdminUserRow = {
  id: string;
  email: string;
  plan: "free" | "pro" | "unlimited";
  role: "admin" | "user";
  createdAt: string;
  lastSignInAt: string | null;
};

const PLAN_COLORS: Record<AdminUserRow["plan"], string> = {
  free: "bg-[color:color-mix(in_oklab,var(--ink-muted)_18%,transparent)] text-[color:var(--ink-soft)]",
  pro: "bg-[color:var(--saffron)]/25 text-ink",
  unlimited: "bg-[color:var(--jade)]/25 text-[color:var(--jade)]",
};

export function UserTable({ users }: { users: AdminUserRow[] }) {
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | AdminUserRow["plan"]>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (planFilter !== "all" && u.plan !== planFilter) return false;
      if (!q) return true;
      return u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    });
  }, [users, query, planFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={14}
            weight="bold"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po e-mailu lub ID…"
            className="w-full rounded-full border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white py-2 pl-9 pr-4 text-[14px] placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--ink)] focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "free", "pro", "unlimited"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlanFilter(p)}
              className={`mono-label rounded-full px-3 py-1.5 text-[0.6rem] transition-colors ${
                planFilter === p
                  ? "bg-ink text-cream"
                  : "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)] hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]"
              }`}
            >
              {p === "all" ? "Wszystkie" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[color:var(--cream-soft)] text-[color:var(--ink-muted)]">
            <tr>
              <th className="mono-label px-4 py-3 text-[0.58rem] font-semibold">E-mail</th>
              <th className="mono-label px-4 py-3 text-[0.58rem] font-semibold">Plan</th>
              <th className="mono-label hidden px-4 py-3 text-[0.58rem] font-semibold sm:table-cell">
                Rola
              </th>
              <th className="mono-label hidden px-4 py-3 text-[0.58rem] font-semibold lg:table-cell">
                Ost. login
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[color:var(--ink-muted)]">
                  Brak użytkowników spełniających kryteria.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[color:var(--cream-soft)]/50">
                  <td className="max-w-[280px] truncate px-4 py-3 font-medium">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`mono-label inline-flex rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold ${PLAN_COLORS[u.plan]}`}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-[color:var(--ink-muted)] sm:table-cell">
                    {u.role === "admin" ? (
                      <span className="mono-label rounded-full bg-[color:var(--saffron)]/20 px-2 py-0.5 text-[0.58rem] text-ink">
                        admin
                      </span>
                    ) : (
                      "user"
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-[12px] text-[color:var(--ink-muted)] lg:table-cell">
                    {u.lastSignInAt
                      ? new Date(u.lastSignInAt).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-[color:var(--saffron)]"
                    >
                      Zarządzaj
                      <ArrowRight size={12} weight="bold" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] text-[color:var(--ink-muted)]">
        Wyświetlono {filtered.length} z {users.length} użytkowników
      </p>
    </div>
  );
}
