-- Phase 33: election scheduling and automatic open/close controls
alter table public.award_spaces add column if not exists election_scheduled_open_at timestamptz;
alter table public.award_spaces add column if not exists election_scheduled_close_at timestamptz;
alter table public.award_spaces add column if not exists election_auto_open_enabled boolean not null default false;
alter table public.award_spaces add column if not exists election_auto_close_enabled boolean not null default false;
alter table public.award_spaces add column if not exists election_schedule_timezone text not null default 'UTC';
create table if not exists public.election_schedule_runs(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 action text not null check(action in('open','close')),
 status text not null check(status in('executed','blocked','skipped')),
 scheduled_for timestamptz not null,
 processed_at timestamptz not null default now(),
 detail text,
 unique(award_space_id,action,scheduled_for,status)
);
create index if not exists election_schedule_runs_space_idx on public.election_schedule_runs(award_space_id,processed_at desc);
alter table public.election_schedule_runs enable row level security;
