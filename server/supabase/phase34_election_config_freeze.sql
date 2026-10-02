-- Phase 34: election configuration freeze and approval invalidation
alter table public.award_spaces add column if not exists election_config_version integer not null default 1;
alter table public.award_spaces add column if not exists election_config_updated_at timestamptz;
alter table public.award_spaces add column if not exists election_config_frozen_at timestamptz;
alter table public.award_spaces add column if not exists election_config_frozen_by uuid references public.admins(id) on delete set null;
alter table public.award_spaces add column if not exists election_config_change_reason text;
alter table public.election_launch_approvals add column if not exists config_version integer not null default 1;
create table if not exists public.election_config_changes(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 config_version integer not null,
 change_type text not null,
 reason text,
 changed_by uuid references public.admins(id) on delete set null,
 changed_at timestamptz not null default now()
);
create index if not exists election_config_changes_space_idx on public.election_config_changes(award_space_id,config_version desc,changed_at desc);
alter table public.election_config_changes enable row level security;
