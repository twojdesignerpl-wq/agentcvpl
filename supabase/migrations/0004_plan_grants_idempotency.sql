-- agentcv.pl — plan_grants idempotency
-- P0.2: Stripe wysyła event 2× przy network blip → audit dubluje wiersze.
-- Dodajemy webhook_event_id (Stripe `evt_xxx`) + UNIQUE INDEX dla idempotencji.
-- Webhook handler używa upsert (on_conflict do_nothing) lub łapie code 23505.

alter table public.plan_grants
  add column if not exists webhook_event_id text;

create unique index if not exists plan_grants_webhook_event_id_uq
  on public.plan_grants (webhook_event_id)
  where webhook_event_id is not null;

comment on column public.plan_grants.webhook_event_id is
  'Stripe event.id dla idempotencji webhook. NULL dla wpisów ręcznych (admin/system).';
