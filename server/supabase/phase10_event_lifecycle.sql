-- Phase 10: event lifecycle
alter table public.award_spaces add column if not exists lifecycle_stage text not null default 'setup'
  check(lifecycle_stage in ('setup','nominations','voting','results','completed','archived'));
alter table public.award_spaces add column if not exists lifecycle_updated_at timestamptz not null default now();
create index if not exists award_spaces_lifecycle_idx on public.award_spaces(lifecycle_stage);
