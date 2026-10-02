-- Phase 13: secure voter authentication and OTP
create table if not exists public.election_voter_auth (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 voter_id uuid not null references public.election_voters(id) on delete cascade,
 otp_hash text not null,
 otp_expires_at timestamptz not null,
 attempts integer not null default 0,
 verified_at timestamptz,
 session_hash text,
 session_expires_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists election_voter_auth_lookup_idx on public.election_voter_auth(award_space_id,voter_id,created_at desc);
create index if not exists election_voter_auth_session_idx on public.election_voter_auth(session_hash) where session_hash is not null;
alter table public.election_voter_auth enable row level security;
