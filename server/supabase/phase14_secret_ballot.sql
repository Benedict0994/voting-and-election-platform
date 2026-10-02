-- Phase 14: secret ballot and one-person-one-vote engine
-- Identity/eligibility stays in election_voters. Ballot choices live separately and contain no voter_id.
create table if not exists public.election_ballot_receipts (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 voter_id uuid not null references public.election_voters(id) on delete restrict,
 receipt_code text not null unique,
 cast_at timestamptz not null default now(),
 unique(award_space_id,voter_id)
);
create table if not exists public.election_ballots (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 receipt_code text not null unique,
 cast_at timestamptz not null default now()
);
create table if not exists public.election_ballot_choices (
 id uuid primary key default gen_random_uuid(),
 ballot_id uuid not null references public.election_ballots(id) on delete cascade,
 position_id uuid not null references public.election_positions(id) on delete restrict,
 candidate_id uuid not null references public.candidates(id) on delete restrict,
 created_at timestamptz not null default now(),
 unique(ballot_id,position_id,candidate_id)
);
create index if not exists election_ballots_space_idx on public.election_ballots(award_space_id,cast_at);
create index if not exists election_choices_position_idx on public.election_ballot_choices(position_id,candidate_id);
alter table public.election_ballot_receipts enable row level security;
alter table public.election_ballots enable row level security;
alter table public.election_ballot_choices enable row level security;

create or replace function public.cast_secret_ballot(
 p_award_space_id uuid,p_voter_id uuid,p_receipt_code text,p_choices jsonb
) returns uuid language plpgsql security definer set search_path=public as $$
declare b uuid; item jsonb; pos uuid; cand uuid; maxsel integer; n integer;
begin
 if exists(select 1 from election_ballot_receipts where award_space_id=p_award_space_id and voter_id=p_voter_id) then raise exception 'Voter has already cast a ballot'; end if;
 if not exists(select 1 from election_voters where id=p_voter_id and award_space_id=p_award_space_id and is_eligible=true and status='eligible') then raise exception 'Voter is not eligible'; end if;
 if not exists(select 1 from award_spaces where id=p_award_space_id and event_type='election' and lifecycle_stage='voting') then raise exception 'Voting is not open'; end if;
 for pos in select id from election_positions where award_space_id=p_award_space_id loop
   select count(*) into n from jsonb_array_elements(p_choices) x where (x->>'positionId')::uuid=pos;
   select max_selections into maxsel from election_positions where id=pos;
   if n>maxsel then raise exception 'Too many selections for a ballot position'; end if;
 end loop;
 for item in select * from jsonb_array_elements(p_choices) loop
   pos=(item->>'positionId')::uuid; cand=(item->>'candidateId')::uuid;
   if not exists(select 1 from candidates where id=cand and award_space_id=p_award_space_id and election_position_id=pos) then raise exception 'Invalid candidate selection'; end if;
 end loop;
 insert into election_ballot_receipts(award_space_id,voter_id,receipt_code) values(p_award_space_id,p_voter_id,p_receipt_code);
 insert into election_ballots(award_space_id,receipt_code) values(p_award_space_id,p_receipt_code) returning id into b;
 for item in select * from jsonb_array_elements(p_choices) loop
   insert into election_ballot_choices(ballot_id,position_id,candidate_id) values(b,(item->>'positionId')::uuid,(item->>'candidateId')::uuid);
 end loop;
 update election_voters set status='voted',voted_at=now(),updated_at=now() where id=p_voter_id;
 update election_voter_auth set session_hash=null,session_expires_at=now() where voter_id=p_voter_id and award_space_id=p_award_space_id;
 return b;
end $$;
