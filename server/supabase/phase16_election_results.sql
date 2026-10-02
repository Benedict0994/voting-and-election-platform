-- Phase 16: sealed election results and controlled release
alter table public.award_spaces add column if not exists election_results_released boolean not null default false;
alter table public.award_spaces add column if not exists election_results_released_at timestamptz;
alter table public.award_spaces add column if not exists election_results_released_by uuid references public.admins(id) on delete set null;
