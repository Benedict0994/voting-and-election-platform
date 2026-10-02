-- Phase 21: permanent election archive and preservation record
alter table public.award_spaces add column if not exists election_archived_at timestamptz;
alter table public.award_spaces add column if not exists election_archived_by uuid references public.admins(id) on delete set null;
alter table public.award_spaces add column if not exists election_archive_hash text;

create table if not exists public.election_archives (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null unique references public.award_spaces(id) on delete restrict,
 archived_by uuid references public.admins(id) on delete set null,
 archive_hash text not null,
 archive_snapshot jsonb not null,
 archived_at timestamptz not null default now()
);
alter table public.election_archives enable row level security;
