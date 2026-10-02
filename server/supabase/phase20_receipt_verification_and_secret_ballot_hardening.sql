-- Phase 20: harden secret ballot privacy and add public receipt verification
-- IMPORTANT: voter receipt codes must never be stored on anonymous ballot rows.

-- Sever the legacy shared receipt-code link for any ballots already cast.
update public.election_ballots
set receipt_code = 'ANON-' || encode(gen_random_bytes(16),'hex');

-- Anonymous ballot timestamps are not required for turnout (receipt timestamps provide turnout).
-- Remove precise ballot timestamps to reduce timing correlation with voter participation records.
alter table public.election_ballots alter column cast_at drop not null;
update public.election_ballots set cast_at = null;

create or replace function public.cast_secret_ballot(
 p_award_space_id uuid,p_voter_id uuid,p_receipt_code text,p_choices jsonb
) returns uuid language plpgsql security definer set search_path=public as $$
declare b uuid; item jsonb; pos uuid; cand uuid; maxsel integer; n integer; anon_code text;
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
 anon_code='ANON-' || encode(gen_random_bytes(16),'hex');
 insert into election_ballot_receipts(award_space_id,voter_id,receipt_code) values(p_award_space_id,p_voter_id,p_receipt_code);
 insert into election_ballots(award_space_id,receipt_code,cast_at) values(p_award_space_id,anon_code,null) returning id into b;
 for item in select * from jsonb_array_elements(p_choices) loop
   insert into election_ballot_choices(ballot_id,position_id,candidate_id) values(b,(item->>'positionId')::uuid,(item->>'candidateId')::uuid);
 end loop;
 update election_voters set status='voted',voted_at=now(),updated_at=now() where id=p_voter_id;
 update election_voter_auth set session_hash=null,session_expires_at=now() where voter_id=p_voter_id and award_space_id=p_award_space_id;
 return b;
end $$;

revoke all on function public.cast_secret_ballot(uuid,uuid,text,jsonb) from public;
revoke execute on function public.cast_secret_ballot(uuid,uuid,text,jsonb) from anon,authenticated;
grant execute on function public.cast_secret_ballot(uuid,uuid,text,jsonb) to service_role;
