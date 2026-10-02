-- Phase 42: incident ownership and response-team workflow
alter table public.election_incidents add column if not exists assignment_note text;
alter table public.election_incidents add column if not exists assigned_at timestamptz;
alter table public.election_incidents add column if not exists assigned_by uuid references public.admins(id) on delete set null;
alter table public.election_incidents add column if not exists response_started_at timestamptz;
create table if not exists public.election_incident_assignments(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,incident_id uuid not null references public.election_incidents(id) on delete cascade,assignee_id uuid references public.admins(id) on delete set null,assigned_by uuid references public.admins(id) on delete set null,action text not null check(action in('assigned','reassigned','unassigned','accepted')),note text,created_at timestamptz not null default now());
create index if not exists election_incident_assignments_idx on public.election_incident_assignments(award_space_id,incident_id,created_at desc);
alter table public.election_incident_assignments enable row level security;
