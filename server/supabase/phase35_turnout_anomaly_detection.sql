-- Phase 35: turnout anomaly detection
create table if not exists public.election_turnout_scans(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 status text not null check(status in('normal','warning','critical')),
 anomalies jsonb not null default '[]'::jsonb,
 metrics jsonb not null default '{}'::jsonb,
 scanned_by uuid references public.admins(id) on delete set null,
 scanned_at timestamptz not null default now()
);
create index if not exists election_turnout_scans_space_idx on public.election_turnout_scans(award_space_id,scanned_at desc);
alter table public.election_turnout_scans enable row level security;
