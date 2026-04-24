-- agentcv.pl — plans enforcement + email inbox + admin
-- Odzwierciedla schemat prod zaaplikowany przez Supabase Studio (4 migracje historyczne:
-- admin_panel_foundation, email_inbox, pro_pack_credits + seed adminów).
-- Ten plik służy ONBOARDINGOWI deweloperów na świeżym Supabase (localhost, preview).
-- Na prod: no-op dzięki IF NOT EXISTS / OR REPLACE.
--
-- Obiekty:
--   public.usage_logs        — audit pobrań/AI per user
--   public.plan_credits      — Pro Pack credits (one-time 19 zł = 10 credits)
--   public.plan_grants       — audit każdej zmiany planu (Stripe + admin)
--   public.admins            — hybrid guard (ADMIN_EMAILS env OR wpis tutaj OR app_metadata.role)
--   public.emails            — inbox (Resend inbound + outbound history)
--   public.email_dispatches  — idempotencja welcome/payment/plan_granted
--   public.is_admin(uid)     — hybrid admin check
--   public.decrement_pack_credit(p_user_id) — atomic FIFO dekrement

-- ═══════════════════════════════════════════════════════════════════════════
-- usage_logs
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
do $$ begin
  if not exists (select 1 from pg_constraint where conname='usage_logs_action_check') then
    alter table public.usage_logs add constraint usage_logs_action_check
      check (action in ('pdf','docx','ai_chat','ai_cv','job_match'));
  end if;
end $$;
create index if not exists idx_usage_logs_user_created on public.usage_logs(user_id, created_at desc);
create index if not exists idx_usage_logs_action_created on public.usage_logs(action, created_at desc);
alter table public.usage_logs enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- plan_credits — Pro Pack (one-time, kredyty nie wygasają ale kolumna expires_at zostaje w razie przyszłych kampanii)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.plan_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'pro_pack',
  credits_remaining int not null check (credits_remaining >= 0),
  credits_granted int not null check (credits_granted > 0),
  stripe_session_id text unique,
  stripe_customer_id text,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  active boolean not null default true
);
create index if not exists idx_plan_credits_user_active on public.plan_credits(user_id, active, credits_remaining);
alter table public.plan_credits enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- plan_grants — audit
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.plan_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  from_plan text,
  to_plan text not null,
  reason text,
  source text not null,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);
do $$ begin
  if not exists (select 1 from pg_constraint where conname='plan_grants_source_check') then
    alter table public.plan_grants add constraint plan_grants_source_check
      check (source in ('stripe','admin','system'));
  end if;
end $$;
create index if not exists idx_plan_grants_user_granted on public.plan_grants(user_id, granted_at desc);
alter table public.plan_grants enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- admins — dokładna struktura prod (granted_at + granted_by, bez created_at)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- emails — inbox (Resend inbound + outbound history)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  direction text not null check (direction in ('inbound','outbound')),
  resend_email_id text,
  resend_inbound_id text,
  thread_id uuid,
  in_reply_to text,
  message_id text,
  from_email text,
  from_name text,
  to_email text,
  cc text,
  subject text,
  text_body text,
  html_body text,
  raw_headers jsonb,
  attachments jsonb,
  read_at timestamptz,
  archived_at timestamptz,
  received_at timestamptz not null default now(),
  sent_by uuid references auth.users(id)
);
create index if not exists idx_emails_thread on public.emails(thread_id, received_at desc);
create index if not exists idx_emails_from_email on public.emails(from_email, received_at desc);
create index if not exists idx_emails_direction on public.emails(direction, received_at desc);
alter table public.emails enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- email_dispatches — idempotencja (resend_email_id unique)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.email_dispatches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind text not null,
  resend_email_id text,
  sent_at timestamptz not null default now()
);
create index if not exists idx_email_dispatches_user_kind on public.email_dispatches(user_id, kind);
alter table public.email_dispatches enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- is_admin(uid) — hybrid: admins table OR auth.users.raw_app_meta_data.role='admin'
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable security definer
set search_path = public, auth
as $$
  select exists(select 1 from public.admins where user_id = uid)
      or coalesce(
           (select raw_app_meta_data->>'role' = 'admin'
            from auth.users where id = uid),
           false);
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- decrement_pack_credit(p_user_id) — atomic FIFO dekrement Pro Pack credit
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function public.decrement_pack_credit(p_user_id uuid)
returns int
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_id uuid;
  new_remaining int;
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
  if target_id is null then return -1; end if;
  update public.plan_credits
     set credits_remaining = credits_remaining - 1
   where id = target_id
   returning credits_remaining into new_remaining;
  return new_remaining;
end $$;

comment on table public.usage_logs is 'Audit pobrań/AI per user. countUsage w src/lib/plans/usage.ts liczy z tej tabeli.';
comment on table public.plan_credits is 'Pro Pack (one-time 19 zł, 10 credits). Kredyty nie wygasają (expires_at zawsze null dla pro_pack).';
comment on table public.plan_grants is 'Audit każdej zmiany planu — source: stripe/admin/system.';
comment on table public.emails is 'Inbox + outbound history (Resend). direction=inbound|outbound.';
comment on table public.email_dispatches is 'Idempotencja transactional emails (welcome/payment/plan_granted).';
comment on function public.decrement_pack_credit(uuid) is 'Atomic FIFO dekrement 1 credit z Pro Pack. Wywołane PO udanym eksporcie.';
