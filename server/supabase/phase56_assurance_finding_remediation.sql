alter table public.election_governance_assurance_findings add column if not exists remediation_note text;
alter table public.election_governance_assurance_findings add column if not exists remediation_evidence text;
alter table public.election_governance_assurance_findings add column if not exists remediated_by uuid references public.admins(id) on delete set null;
alter table public.election_governance_assurance_findings add column if not exists verification_note text;
alter table public.election_governance_assurance_findings add column if not exists residual_risk text check(residual_risk in('low','medium','high','critical'));
create table if not exists public.election_governance_assurance_finding_reviews(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,finding_id uuid not null references public.election_governance_assurance_findings(id) on delete cascade,review_type text not null check(review_type in('remediation','verification','reopen')),note text not null,evidence_reference text,residual_risk text check(residual_risk in('low','medium','high','critical')),reviewed_by uuid references public.admins(id) on delete set null,reviewed_at timestamptz not null default now());
create index if not exists election_assurance_finding_reviews_idx on public.election_governance_assurance_finding_reviews(award_space_id,finding_id,reviewed_at desc);
alter table public.election_governance_assurance_finding_reviews enable row level security;
