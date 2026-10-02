-- Phase 37: automatic critical-incident pause safeguards
alter table public.award_spaces add column if not exists election_auto_pause_enabled boolean not null default true;
alter table public.award_spaces add column if not exists election_auto_paused_at timestamptz;
alter table public.award_spaces add column if not exists election_auto_pause_incident_id uuid references public.election_incidents(id) on delete set null;
alter table public.award_spaces add column if not exists election_auto_pause_requires_owner_resume boolean not null default true;
