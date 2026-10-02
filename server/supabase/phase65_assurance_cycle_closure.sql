alter table public.election_governance_assurance_reports add column if not exists cycle_closed_at timestamptz;
alter table public.election_governance_assurance_reports add column if not exists cycle_closed_by uuid references public.admins(id) on delete set null;
alter table public.election_governance_assurance_reports add column if not exists cycle_closure_note text;
create table if not exists public.election_governance_assurance_cycle_closures(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,report_id uuid not null unique references public.election_governance_assurance_reports(id) on delete cascade,closure_note text not null,next_report_date date,closed_by uuid not null references public.admins(id),closed_at timestamptz not null default now());
create index if not exists assurance_cycle_closures_idx on public.election_governance_assurance_cycle_closures(award_space_id,closed_at desc);
alter table public.election_governance_assurance_cycle_closures enable row level security;
