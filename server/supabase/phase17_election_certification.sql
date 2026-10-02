-- Phase 17: election results certification and immutable snapshot
alter table public.award_spaces add column if not exists election_certified boolean not null default false;
alter table public.award_spaces add column if not exists election_certified_at timestamptz;
alter table public.award_spaces add column if not exists election_certified_by uuid references public.admins(id) on delete set null;
alter table public.award_spaces add column if not exists election_certificate_code text unique;

create table if not exists public.election_result_certificates (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null unique references public.award_spaces(id) on delete restrict,
 certificate_code text not null unique,
 certified_by uuid references public.admins(id) on delete set null,
 ballots_cast integer not null,
 results_snapshot jsonb not null,
 results_hash text not null,
 certified_at timestamptz not null default now()
);
alter table public.election_result_certificates enable row level security;
