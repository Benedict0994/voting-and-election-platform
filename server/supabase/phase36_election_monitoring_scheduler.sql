-- Phase 36: automated election monitoring scheduler
alter table public.award_spaces add column if not exists election_monitoring_enabled boolean not null default true;
alter table public.award_spaces add column if not exists election_monitoring_interval_minutes integer not null default 5 check(election_monitoring_interval_minutes between 1 and 60);
alter table public.award_spaces add column if not exists election_last_monitored_at timestamptz;
create table if not exists public.election_monitoring_runs(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 status text not null check(status in('completed','partial','failed')),
 tasks jsonb not null default '[]'::jsonb,
 started_at timestamptz not null default now(),
 completed_at timestamptz,
 error text
);
create index if not exists election_monitoring_runs_space_idx on public.election_monitoring_runs(award_space_id,started_at desc);
alter table public.election_monitoring_runs enable row level security;
