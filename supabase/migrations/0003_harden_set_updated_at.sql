-- Hardening: set_updated_at miała mutable search_path (Supabase advisor WARN
-- function_search_path_mutable). Pin do 'public' — zero ryzyka szukania w innych
-- schematach (search_path injection mitigation dla SECURITY DEFINER functions).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
