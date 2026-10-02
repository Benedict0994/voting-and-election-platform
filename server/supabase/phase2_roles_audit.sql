-- AwardVote Phase 2: team roles and immutable audit trail
create table if not exists public.audit_logs (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 admin_id uuid references public.admins(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id text,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists audit_logs_space_created_idx on public.audit_logs(award_space_id,created_at desc);
alter table public.audit_logs enable row level security;

-- Existing event owners remain owners. Supported roles:
-- owner: full control/team management
-- admin: nominees/settings/events
-- finance: payments/reconciliation/audit
-- viewer: read-only reporting
