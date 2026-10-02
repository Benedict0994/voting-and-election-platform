-- Phase 18: election officials, returning officers and observers
-- Extend event team roles for election governance.
alter table public.admin_award_spaces drop constraint if exists admin_award_spaces_role_check;
alter table public.admin_award_spaces add constraint admin_award_spaces_role_check
  check (role in ('owner','admin','finance','viewer','returning_officer','election_officer','observer'));

create table if not exists public.election_official_assignments (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 admin_id uuid not null references public.admins(id) on delete cascade,
 title text,
 assigned_by uuid references public.admins(id) on delete set null,
 created_at timestamptz not null default now(),
 unique(award_space_id,admin_id)
);
create index if not exists election_official_assignments_space_idx on public.election_official_assignments(award_space_id,created_at);
alter table public.election_official_assignments enable row level security;
