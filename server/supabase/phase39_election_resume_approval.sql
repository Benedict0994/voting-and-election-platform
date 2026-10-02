-- Phase 39: multi-official election resumption approval
alter table public.award_spaces add column if not exists election_resume_approval_required integer not null default 2 check(election_resume_approval_required between 1 and 10);
create table if not exists public.election_resume_approvals(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 pause_incident_id uuid references public.election_incidents(id) on delete cascade,
 admin_id uuid not null references public.admins(id) on delete cascade,
 decision text not null check(decision in('approved','revoked')),
 note text,
 decided_at timestamptz not null default now(),
 unique(award_space_id,pause_incident_id,admin_id)
);
create index if not exists election_resume_approvals_space_idx on public.election_resume_approvals(award_space_id,pause_incident_id,decided_at);
alter table public.election_resume_approvals enable row level security;
