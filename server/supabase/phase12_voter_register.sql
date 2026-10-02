-- Phase 12: election voter register and eligibility
create table if not exists public.election_voters (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 voter_code text not null,
 full_name text not null,
 email text,
 phone text,
 group_name text,
 external_id text,
 is_eligible boolean not null default true,
 status text not null default 'eligible' check(status in ('eligible','suspended','voted')),
 ballot_issued_at timestamptz,
 voted_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(award_space_id,voter_code)
);
create unique index if not exists election_voters_external_unique on public.election_voters(award_space_id,external_id) where external_id is not null;
create index if not exists election_voters_space_status_idx on public.election_voters(award_space_id,status,created_at desc);
create index if not exists election_voters_group_idx on public.election_voters(award_space_id,group_name);
alter table public.election_voters enable row level security;
