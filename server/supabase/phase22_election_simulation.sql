-- Phase 22: isolated election dry-run simulations
create table if not exists public.election_simulations (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 created_by uuid references public.admins(id) on delete set null,
 status text not null default 'active' check(status in ('active','completed','discarded')),
 test_voters integer not null default 0,
 test_ballots integer not null default 0,
 started_at timestamptz not null default now(),
 completed_at timestamptz,
 discarded_at timestamptz,
 notes text
);
create index if not exists election_simulations_space_idx on public.election_simulations(award_space_id,started_at desc);
alter table public.election_simulations enable row level security;
