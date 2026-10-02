-- Phase 23: multi-official election launch approval
create table if not exists public.election_launch_approvals (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 admin_id uuid not null references public.admins(id) on delete cascade,
 decision text not null check(decision in ('approved','revoked')),
 note text,
 decided_at timestamptz not null default now(),
 unique(award_space_id,admin_id)
);
create index if not exists election_launch_approvals_space_idx on public.election_launch_approvals(award_space_id,decision,decided_at);
alter table public.election_launch_approvals enable row level security;

alter table public.award_spaces add column if not exists launch_approval_required integer not null default 2 check(launch_approval_required between 1 and 10);
alter table public.award_spaces add column if not exists launch_approved_at timestamptz;
