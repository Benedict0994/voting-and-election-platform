create table if not exists public.election_governance_assurance_reports(
id uuid primary key default gen_random_uuid(),
award_space_id uuid not null references public.award_spaces(id) on delete cascade,
report_snapshot jsonb not null,
status text not null default 'submitted' check(status in('submitted','approved','distributed')),
prepared_by uuid references public.admins(id) on delete set null,
prepared_at timestamptz not null default now(),
approved_by uuid references public.admins(id) on delete set null,
approved_at timestamptz,
approval_note text,
distributed_at timestamptz
);
create table if not exists public.election_governance_assurance_report_distributions(
id uuid primary key default gen_random_uuid(),
report_id uuid not null references public.election_governance_assurance_reports(id) on delete cascade,
recipient_name text not null,
recipient_role text,
recipient_email text,
distributed_by uuid references public.admins(id) on delete set null,
distributed_at timestamptz not null default now()
);
create index if not exists election_assurance_reports_idx on public.election_governance_assurance_reports(award_space_id,prepared_at desc);
alter table public.election_governance_assurance_reports enable row level security;
alter table public.election_governance_assurance_report_distributions enable row level security;
