-- Phase 30: controlled disaster-recovery workflow
create table if not exists public.election_restore_requests(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete restrict,
 backup_id uuid not null references public.election_backups(id) on delete restrict,
 status text not null default 'pending' check(status in('pending','approved','executed','cancelled','failed')),
 requested_by uuid references public.admins(id) on delete set null,
 requested_at timestamptz not null default now(),
 reason text not null,
 approved_by uuid references public.admins(id) on delete set null,
 approved_at timestamptz,
 executed_by uuid references public.admins(id) on delete set null,
 executed_at timestamptz,
 pre_restore_backup_id uuid references public.election_backups(id) on delete set null,
 result_hash text,
 failure_reason text,
 unique(award_space_id,backup_id,status)
);
create index if not exists election_restore_requests_space_idx on public.election_restore_requests(award_space_id,requested_at desc);
alter table public.election_restore_requests enable row level security;
