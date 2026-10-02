-- Phase 31: election system health and operational monitoring
create table if not exists public.election_health_checks(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 overall_status text not null check(overall_status in('healthy','warning','critical')),
 checks jsonb not null default '[]'::jsonb,
 checked_by uuid references public.admins(id) on delete set null,
 checked_at timestamptz not null default now()
);
create index if not exists election_health_checks_space_idx on public.election_health_checks(award_space_id,checked_at desc);
alter table public.election_health_checks enable row level security;
