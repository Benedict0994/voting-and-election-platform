-- Phase 25: emergency election pause and controlled resume
alter table public.award_spaces add column if not exists election_paused_at timestamptz;
alter table public.award_spaces add column if not exists election_paused_by uuid references public.admins(id) on delete set null;
alter table public.award_spaces add column if not exists election_pause_reason text;
alter table public.award_spaces add column if not exists election_resumed_at timestamptz;
alter table public.award_spaces add column if not exists election_resumed_by uuid references public.admins(id) on delete set null;
alter table public.award_spaces add column if not exists election_is_paused boolean not null default false;
create table if not exists public.election_pause_history(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 action text not null check(action in('paused','resumed')),
 reason text,
 acted_by uuid references public.admins(id) on delete set null,
 acted_at timestamptz not null default now()
);
create index if not exists election_pause_history_space_idx on public.election_pause_history(award_space_id,acted_at desc);
alter table public.election_pause_history enable row level security;
