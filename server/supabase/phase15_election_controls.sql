-- Phase 15: election opening, closing and ballot lock controls
alter table public.award_spaces add column if not exists ballot_locked boolean not null default false;
alter table public.award_spaces add column if not exists ballot_locked_at timestamptz;
alter table public.award_spaces add column if not exists election_opened_at timestamptz;
alter table public.award_spaces add column if not exists election_closed_at timestamptz;
