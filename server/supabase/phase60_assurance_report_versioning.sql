alter table public.award_spaces add column if not exists assurance_reporting_enabled boolean not null default true;
alter table public.award_spaces add column if not exists assurance_reporting_frequency text not null default 'quarterly' check(assurance_reporting_frequency in('monthly','quarterly','annual'));
alter table public.award_spaces add column if not exists assurance_next_report_date date;
alter table public.election_governance_assurance_reports add column if not exists report_version integer;
alter table public.election_governance_assurance_reports add column if not exists reporting_period_start date;
alter table public.election_governance_assurance_reports add column if not exists reporting_period_end date;
alter table public.election_governance_assurance_reports add column if not exists supersedes_report_id uuid references public.election_governance_assurance_reports(id) on delete set null;
create unique index if not exists election_assurance_report_version_idx on public.election_governance_assurance_reports(award_space_id,report_version) where report_version is not null;
