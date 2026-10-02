-- Phase 26: election disputes, complaints and resolution management
create table if not exists public.election_disputes(
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 reference_code text not null unique,
 category text not null check(category in('voter_access','ballot','candidate','conduct','result','integrity','other')),
 title text not null,
 description text not null,
 complainant_name text,
 complainant_email text,
 status text not null default 'open' check(status in('open','under_review','resolved','dismissed')),
 priority text not null default 'normal' check(priority in('low','normal','high','critical')),
 resolution text,
 submitted_by uuid references public.admins(id) on delete set null,
 assigned_to uuid references public.admins(id) on delete set null,
 resolved_by uuid references public.admins(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 resolved_at timestamptz
);
create index if not exists election_disputes_space_idx on public.election_disputes(award_space_id,status,created_at desc);
alter table public.election_disputes enable row level security;
create table if not exists public.election_dispute_notes(
 id uuid primary key default gen_random_uuid(),
 dispute_id uuid not null references public.election_disputes(id) on delete cascade,
 admin_id uuid references public.admins(id) on delete set null,
 note text not null,
 created_at timestamptz not null default now()
);
create index if not exists election_dispute_notes_idx on public.election_dispute_notes(dispute_id,created_at);
alter table public.election_dispute_notes enable row level security;
