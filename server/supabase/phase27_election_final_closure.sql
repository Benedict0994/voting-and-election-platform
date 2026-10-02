-- Phase 27: post-election challenge period and final closure
alter table public.award_spaces add column if not exists challenge_period_hours integer not null default 72 check(challenge_period_hours between 0 and 720);
alter table public.award_spaces add column if not exists challenge_period_started_at timestamptz;
alter table public.award_spaces add column if not exists challenge_period_ends_at timestamptz;
alter table public.award_spaces add column if not exists election_final_closed_at timestamptz;
alter table public.award_spaces add column if not exists election_final_closed_by uuid references public.admins(id) on delete set null;
create table if not exists public.election_final_closures(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null unique references public.award_spaces(id) on delete restrict,
 closed_by uuid references public.admins(id) on delete set null,
 closed_at timestamptz not null default now(),
 statement text not null,
 open_disputes_at_close integer not null default 0,
 certificate_code text,
 final_hash text not null
);
alter table public.election_final_closures enable row level security;
