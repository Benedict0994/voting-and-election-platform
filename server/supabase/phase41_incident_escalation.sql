-- Phase 41: election incident escalation and governance response levels
alter table public.election_incidents add column if not exists escalation_level integer not null default 1 check(escalation_level between 1 and 4);
alter table public.election_incidents add column if not exists escalated_at timestamptz;
alter table public.election_incidents add column if not exists escalation_reason text;
alter table public.election_incidents add column if not exists response_due_at timestamptz;
alter table public.election_incidents add column if not exists escalation_acknowledged_at timestamptz;
alter table public.election_incidents add column if not exists escalation_acknowledged_by uuid references public.admins(id) on delete set null;
create table if not exists public.election_incident_escalations(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,incident_id uuid not null references public.election_incidents(id) on delete cascade,from_level integer not null,to_level integer not null,reason text not null,source text not null check(source in('automatic','official')),escalated_by uuid references public.admins(id) on delete set null,created_at timestamptz not null default now());
create index if not exists election_incident_escalations_idx on public.election_incident_escalations(award_space_id,incident_id,created_at desc);
alter table public.election_incident_escalations enable row level security;
