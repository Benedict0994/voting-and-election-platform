-- Phase 32: automated election alerts and operational notifications
alter table public.notifications add column if not exists severity text not null default 'info' check(severity in('info','warning','critical'));
alter table public.notifications add column if not exists alert_key text;
alter table public.notifications add column if not exists acknowledged_at timestamptz;
alter table public.notifications add column if not exists acknowledged_by uuid references public.admins(id) on delete set null;
alter table public.notifications add column if not exists delivery_error text;
create index if not exists notifications_alert_idx on public.notifications(award_space_id,alert_key,created_at desc);
alter table public.award_spaces add column if not exists election_alert_email_enabled boolean not null default false;
alter table public.award_spaces add column if not exists election_alert_recipient text;
