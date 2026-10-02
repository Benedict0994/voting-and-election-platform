-- Phase 11: dual-mode platform foundation
-- Keeps commercial award voting separate from organizational election rules.
alter table public.award_spaces add column if not exists event_type text not null default 'award'
  check (event_type in ('award','election'));
alter table public.award_spaces add column if not exists election_kind text
  check (election_kind is null or election_kind in ('organization','association','student','company','church','club','union','other'));

create table if not exists public.election_positions (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 name text not null,
 description text,
 max_selections integer not null default 1 check(max_selections > 0),
 display_order integer not null default 0,
 created_at timestamptz not null default now(),
 unique(award_space_id,name)
);
create index if not exists election_positions_space_idx on public.election_positions(award_space_id,display_order);
alter table public.election_positions enable row level security;

alter table public.candidates add column if not exists election_position_id uuid references public.election_positions(id) on delete set null;
create index if not exists candidates_election_position_idx on public.candidates(award_space_id,election_position_id);
