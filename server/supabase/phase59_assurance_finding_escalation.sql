alter table public.award_spaces add column if not exists assurance_finding_due_alert_days integer not null default 3 check(assurance_finding_due_alert_days between 0 and 30);
alter table public.election_governance_assurance_findings add column if not exists escalation_level integer not null default 0 check(escalation_level between 0 and 3);
alter table public.election_governance_assurance_findings add column if not exists escalated_at timestamptz;
alter table public.election_governance_assurance_findings add column if not exists escalation_acknowledged_at timestamptz;
alter table public.election_governance_assurance_findings add column if not exists escalation_acknowledged_by uuid references public.admins(id) on delete set null;
create table if not exists public.election_governance_assurance_finding_escalations(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,finding_id uuid not null references public.election_governance_assurance_findings(id) on delete cascade,escalation_level integer not null check(escalation_level between 1 and 3),days_overdue integer not null default 0,reason text not null,created_at timestamptz not null default now());
create index if not exists election_assurance_finding_escalations_idx on public.election_governance_assurance_finding_escalations(award_space_id,finding_id,created_at desc);
alter table public.election_governance_assurance_finding_escalations enable row level security;
