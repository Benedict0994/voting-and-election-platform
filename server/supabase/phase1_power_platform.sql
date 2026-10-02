-- AwardVote Power Platform Phase 1 migration
-- Adds multi-event ownership, configurable pricing and reconciliation metadata.

create table if not exists public.admin_award_spaces (
  admin_id uuid not null references public.admins(id) on delete cascade,
  award_space_id uuid not null references public.award_spaces(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','finance','viewer')),
  created_at timestamptz not null default now(),
  primary key (admin_id, award_space_id)
);

insert into public.admin_award_spaces(admin_id, award_space_id, role)
select id, award_space_id, 'owner' from public.admins
on conflict (admin_id, award_space_id) do nothing;

alter table public.admin_award_spaces enable row level security;

alter table public.settings add column if not exists vote_price_minor integer not null default 100 check(vote_price_minor > 0);
alter table public.settings add column if not exists currency text not null default 'GHS';
alter table public.settings add column if not exists vote_packages jsonb not null default '[{"votes":10,"amount_minor":1000},{"votes":50,"amount_minor":5000},{"votes":100,"amount_minor":10000}]'::jsonb;

alter table public.votes add column if not exists payment_channel text;
alter table public.votes add column if not exists provider_status text;
alter table public.votes add column if not exists last_reconciled_at timestamptz;
alter table public.votes add column if not exists provider_paid_at timestamptz;
create index if not exists votes_payment_status_idx on public.votes(award_space_id,status,created_at desc);
create index if not exists votes_payment_channel_idx on public.votes(award_space_id,payment_channel,created_at desc);
