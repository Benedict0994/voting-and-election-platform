-- Phase 19: election integrity incidents
create table if not exists public.election_incidents (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 incident_type text not null,
 severity text not null default 'medium' check(severity in ('low','medium','high','critical')),
 status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),
 title text not null,
 details jsonb not null default '{}'::jsonb,
 source text not null default 'system' check(source in ('system','official','observer')),
 reported_by uuid references public.admins(id) on delete set null,
 assigned_to uuid references public.admins(id) on delete set null,
 resolution_note text,
 reviewed_at timestamptz,
 resolved_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists election_incidents_space_created_idx on public.election_incidents(award_space_id,created_at desc);
create index if not exists election_incidents_status_idx on public.election_incidents(award_space_id,status,severity);
alter table public.election_incidents enable row level security;
