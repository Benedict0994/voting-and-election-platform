create table if not exists public.election_governance_assurance_snapshots(
id uuid primary key default gen_random_uuid(),
award_space_id uuid not null references public.award_spaces(id) on delete cascade,
total_reviews integer not null default 0,
active_reviews integer not null default 0,
total_findings integer not null default 0,
open_findings integer not null default 0,
high_critical_findings integer not null default 0,
verified_findings integer not null default 0,
overdue_findings integer not null default 0,
closure_rate integer not null default 100 check(closure_rate between 0 and 100),
snapshot_data jsonb not null default '{}'::jsonb,
created_by uuid references public.admins(id) on delete set null,
created_at timestamptz not null default now()
);
create index if not exists election_governance_assurance_snapshots_idx on public.election_governance_assurance_snapshots(award_space_id,created_at desc);
alter table public.election_governance_assurance_snapshots enable row level security;
