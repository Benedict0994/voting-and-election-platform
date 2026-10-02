-- AwardVote Phase 4: stronger audit trail metadata and tamper resistance
alter table public.audit_logs add column if not exists actor_role text;
alter table public.audit_logs add column if not exists ip_hash text;
alter table public.audit_logs add column if not exists user_agent text;
alter table public.audit_logs add column if not exists request_id text;
create index if not exists audit_logs_action_idx on public.audit_logs(award_space_id,action,created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(award_space_id,entity_type,entity_id,created_at desc);

-- Audit rows are append-only through the application service role.
-- No client-side RLS policies are created for insert/update/delete.
