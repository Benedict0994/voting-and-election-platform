-- Phase 47: preventive action overdue alerts and management escalation
alter table public.election_preventive_actions add column if not exists escalation_level integer not null default 0 check(escalation_level between 0 and 3);
alter table public.election_preventive_actions add column if not exists escalated_at timestamptz;
alter table public.election_preventive_actions add column if not exists last_overdue_alert_at timestamptz;
alter table public.election_preventive_actions add column if not exists management_acknowledged_at timestamptz;
alter table public.election_preventive_actions add column if not exists management_acknowledged_by uuid references public.admins(id) on delete set null;
create table if not exists public.election_preventive_action_escalations(id uuid primary key default gen_random_uuid(),award_space_id uuid not null references public.award_spaces(id) on delete cascade,action_id uuid not null references public.election_preventive_actions(id) on delete cascade,from_level integer not null,to_level integer not null,days_overdue integer not null,reason text not null,created_at timestamptz not null default now());
create index if not exists election_preventive_action_escalations_idx on public.election_preventive_action_escalations(award_space_id,action_id,created_at desc);
alter table public.election_preventive_action_escalations enable row level security;
