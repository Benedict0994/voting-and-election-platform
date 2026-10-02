-- Phase 29: election backup, recovery and disaster-readiness controls
create table if not exists public.election_backups(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete restrict,
 backup_type text not null default 'manual' check(backup_type in('manual','pre_open','pre_close','pre_archive')),
 status text not null default 'completed' check(status in('completed','verified','failed')),
 created_by uuid references public.admins(id) on delete set null,
 created_at timestamptz not null default now(),
 verified_at timestamptz,
 verified_by uuid references public.admins(id) on delete set null,
 snapshot jsonb not null,
 snapshot_hash text not null,
 record_counts jsonb not null default '{}'::jsonb,
 notes text
);
create index if not exists election_backups_space_idx on public.election_backups(award_space_id,created_at desc);
alter table public.election_backups enable row level security;
alter table public.award_spaces add column if not exists last_election_backup_at timestamptz;
alter table public.award_spaces add column if not exists last_election_backup_hash text;
