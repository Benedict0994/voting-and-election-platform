-- Phase 38: emergency pause investigation and clearance
create table if not exists public.election_pause_investigations(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 incident_id uuid not null references public.election_incidents(id) on delete restrict,
 status text not null default 'open' check(status in('open','investigating','remediated','cleared')),
 root_cause text,
 corrective_action text,
 verification_note text,
 opened_at timestamptz not null default now(),
 opened_by uuid references public.admins(id) on delete set null,
 remediated_at timestamptz,
 remediated_by uuid references public.admins(id) on delete set null,
 cleared_at timestamptz,
 cleared_by uuid references public.admins(id) on delete set null,
 unique(award_space_id,incident_id)
);
create index if not exists election_pause_investigations_space_idx on public.election_pause_investigations(award_space_id,opened_at desc);
alter table public.election_pause_investigations enable row level security;
