-- agentcv.pl — Pro Pack credit atomic claim/refund
-- P0.4: 2 współbieżne pobrania ostatniego kredytu mogą oboje pass canDownload();
-- istniejący decrement_pack_credit chroni dekrement, ale flow "render → decrement"
-- daje race (oboje mają PDF, jeden płaci credit, drugi nie). Fix:
--   1. Nowa funkcja claim_pack_credit — atomic claim PRZED render. Zwraca claim_id.
--   2. Nowa funkcja refund_pack_credit(claim_id) — przywraca credit jeśli render fail
--      i claim < 5 min temu.
--   3. Tabela plan_credit_claims dla audit + refund window.

create table if not exists public.plan_credit_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_credit_id uuid not null references public.plan_credits(id) on delete cascade,
  created_at timestamptz not null default now(),
  refunded_at timestamptz
);
create index if not exists idx_plan_credit_claims_user_created
  on public.plan_credit_claims(user_id, created_at desc);
create index if not exists idx_plan_credit_claims_credit
  on public.plan_credit_claims(plan_credit_id);
alter table public.plan_credit_claims enable row level security;

-- Atomic claim: dekrementuj credit (FIFO, FOR UPDATE) + zapisz claim. Zwraca
-- (claim_id, credits_remaining) lub 0 wierszy jeśli brak dostępnych kredytów.
create or replace function public.claim_pack_credit(p_user_id uuid)
returns table(claim_id uuid, credits_remaining int)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_id uuid;
  new_remaining int;
  new_claim_id uuid;
begin
  select id into target_id
    from public.plan_credits
   where user_id = p_user_id
     and kind = 'pro_pack'
     and active = true
     and credits_remaining > 0
   order by granted_at asc
   limit 1
   for update;

  if target_id is null then
    return;
  end if;

  update public.plan_credits
     set credits_remaining = credits_remaining - 1
   where id = target_id
   returning credits_remaining into new_remaining;

  insert into public.plan_credit_claims (user_id, plan_credit_id)
  values (p_user_id, target_id)
  returning id into new_claim_id;

  claim_id := new_claim_id;
  credits_remaining := new_remaining;
  return next;
end $$;

-- Refund: przywróć credit jeśli claim < 5 min temu i nie był jeszcze refunded.
-- Zwraca true jeśli refund wykonany, false jeśli już za późno / już refunded.
create or replace function public.refund_pack_credit(p_claim_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_credit_id uuid;
  claim_age_seconds int;
begin
  select plan_credit_id, extract(epoch from (now() - created_at))::int
    into target_credit_id, claim_age_seconds
    from public.plan_credit_claims
   where id = p_claim_id
     and refunded_at is null
   for update;

  if target_credit_id is null then
    return false;
  end if;

  if claim_age_seconds > 300 then
    return false;
  end if;

  update public.plan_credits
     set credits_remaining = credits_remaining + 1
   where id = target_credit_id;

  update public.plan_credit_claims
     set refunded_at = now()
   where id = p_claim_id;

  return true;
end $$;

comment on table public.plan_credit_claims is 'Audit kazdego claimu Pro Pack credit. Refund window: 5 min od created_at.';
comment on function public.claim_pack_credit(uuid) is 'Atomic claim Pro Pack credit. FIFO + FOR UPDATE. Zwraca (claim_id, credits_remaining) lub 0 wierszy.';
comment on function public.refund_pack_credit(uuid) is 'Przywroc Pro Pack credit jesli claim < 5 min i nie refunded. Zwraca true/false.';
