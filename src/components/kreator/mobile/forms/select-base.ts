export const MOBILE_SELECT_BASE =
  "w-full min-h-[44px] rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] px-3 py-2 text-[14px] font-medium text-ink outline-none appearance-none transition-colors focus:border-[color:var(--ink)] focus:bg-white";

export function yearOptions(fromMin = 1970): string[] {
  const current = new Date().getFullYear();
  const out: string[] = [];
  for (let y = current + 1; y >= fromMin; y -= 1) out.push(String(y));
  return out;
}
