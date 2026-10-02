-- Phase 44: incident resolution proposal and independent closure approval
alter table public.election_incidents add column if not exists resolution_proposed_at timestamptz;
alter table public.election_incidents add column if not exists resolution_proposed_by uuid references public.admins(id) on delete set null;
alter table public.election_incidents add column if not exists resolution_proposal text;
alter table public.election_incidents add column if not exists closure_approved_at timestamptz;
alter table public.election_incidents add column if not exists closure_approved_by uuid references public.admins(id) on delete set null;
create table if not exists public.election_incident_resolution_approvals(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,incident_id uuid not null references public.election_incidents(id) on delete cascade,admin_id uuid not null references public.admins(id) on delete cascade,decision text not null check(decision in('approved','rejected','revoked')),note text,decided_at timestamptz not null default now(),unique(incident_id,admin_id));
create index if not exists election_incident_resolution_approvals_idx on public.election_incident_resolution_approvals(award_space_id,incident_id,decided_at);
alter table public.election_incident_resolution_approvals enable row level security;
