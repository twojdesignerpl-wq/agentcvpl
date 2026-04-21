-- agentcv.pl — initial schema
-- Tabele: cvs, newsletter_subscribers.
-- Użytkownicy: Supabase auth.users (wbudowane). Plan trzymany w raw_app_meta_data.plan.
-- RLS: pełne — user widzi tylko swoje CV. Newsletter tylko INSERT (service-role odczytuje).

-- ═══════════════════════════════════════════════════════════════════════════
-- cvs — persistent CV storage per user (gdy user się zaloguje + opcjonalnie sync)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  effective_font_size numeric(4,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cvs_user_id on public.cvs(user_id);
create index if not exists idx_cvs_updated_at on public.cvs(updated_at desc);

alter table public.cvs enable row level security;

create policy "cvs_select_own"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "cvs_insert_own"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "cvs_update_own"
  on public.cvs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cvs_delete_own"
  on public.cvs for delete
  using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cvs_updated_at on public.cvs;
create trigger cvs_updated_at
  before update on public.cvs
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- newsletter_subscribers — email capture (footer, CTA)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_unique
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

-- Tylko service_role może czytać (admin dashboard w przyszłości).
-- Anon insert z API dozwolony, ale tylko przez /api/newsletter który używa service-role.
create policy "newsletter_no_public_access"
  on public.newsletter_subscribers for select
  using (false);

-- ═══════════════════════════════════════════════════════════════════════════
-- Komentarze / dokumentacja dla dev
-- ═══════════════════════════════════════════════════════════════════════════
comment on table public.cvs is 'CVs synced z lokalnego Zustand store po login (opt-in).';
comment on column public.cvs.data is 'Pełny CVData wg src/lib/cv/schema.ts (cvDataSchema)';
comment on table public.newsletter_subscribers is 'Newsletter (Pracuś tygodniowy). Source: footer/cta-final/etc.';
