-- Phase 40: post-resumption monitoring
alter table public.award_spaces add column if not exists election_probation_enabled boolean not null default true;
alter table public.award_spaces add column if not exists election_probation_minutes integer not null default 30 check(election_probation_minutes between 5 and 240);
alter table public.award_spaces add column if not exists election_probation_until timestamptz;
alter table public.award_spaces add column if not exists election_probation_started_at timestamptz;
alter table public.award_spaces add column if not exists election_probation_incident_id uuid references public.election_incidents(id) on delete set null;
create table if not exists public.election_probation_checks(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,incident_id uuid references public.election_incidents(id) on delete set null,status text not null check(status in('healthy','warning','critical')),metrics jsonb not null default '{}'::jsonb,findings jsonb not null default '[]'::jsonb,checked_at timestamptz not null default now());
create index if not exists election_probation_checks_space_idx on public.election_probation_checks(award_space_id,checked_at desc);
alter table public.election_probation_checks enable row level security;
