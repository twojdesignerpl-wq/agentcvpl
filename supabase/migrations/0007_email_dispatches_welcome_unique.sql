-- agentcv.pl — atomic dispatch dla welcome (P1.7)
-- Race condition w sendWelcome: SELECT wasSent → INSERT recordDispatch.
-- Dwóch równoległych callerów może minąć SELECT i wysłać 2× welcome.
-- Fix: partial UNIQUE dla kind='welcome' + zmiana flow na INSERT ON CONFLICT DO NOTHING.
--
-- Uwaga: pozostałe kind ('payment','plan_granted','pack_purchase') celowo BEZ unique
-- — user może mieć wielokrotne płatności/grants i każda z nich potrzebuje osobnego maila.

create unique index if not exists email_dispatches_welcome_uq
  on public.email_dispatches (user_id)
  where kind = 'welcome';

comment on index public.email_dispatches_welcome_uq is
  'P1.7: idempotency dla welcome maila — jeden welcome per user.';
