-- AwardVote Phase 3: fraud and integrity monitoring
create table if not exists public.integrity_alerts (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 vote_id uuid references public.votes(id) on delete cascade,
 candidate_id uuid references public.candidates(id) on delete set null,
 alert_type text not null,
 severity text not null check (severity in ('low','medium','high','critical')),
 status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
 title text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 reviewed_at timestamptz,
 reviewed_by uuid references public.admins(id) on delete set null,
 resolution_note text
);
create index if not exists integrity_alerts_space_status_idx on public.integrity_alerts(award_space_id,status,created_at desc);
create unique index if not exists integrity_alerts_vote_type_unique on public.integrity_alerts(vote_id,alert_type) where vote_id is not null;
alter table public.integrity_alerts enable row level security;

create or replace function public.detect_vote_integrity_alerts()
returns trigger language plpgsql security definer set search_path=public as $$
declare recent_same_ip integer; recent_same_voter integer; recent_candidate integer;
begin
 if new.payment_reference is null then return new; end if;
 if new.quantity >= 250 then
  insert into integrity_alerts(award_space_id,vote_id,candidate_id,alert_type,severity,title,details)
  values(new.award_space_id,new.id,new.candidate_id,'large_vote_purchase',case when new.quantity>=500 then 'high' else 'medium' end,'Large vote purchase',jsonb_build_object('quantity',new.quantity,'reference',new.payment_reference)) on conflict do nothing;
 end if;
 if new.ip_hash is not null then
  select count(*) into recent_same_ip from votes where award_space_id=new.award_space_id and ip_hash=new.ip_hash and created_at>=now()-interval '10 minutes';
  if recent_same_ip>=8 then insert into integrity_alerts(award_space_id,vote_id,candidate_id,alert_type,severity,title,details) values(new.award_space_id,new.id,new.candidate_id,'ip_velocity','high','High transaction velocity from one network',jsonb_build_object('transactions_10m',recent_same_ip)) on conflict do nothing; end if;
 end if;
 select count(*) into recent_same_voter from votes where award_space_id=new.award_space_id and voter_hash=new.voter_hash and created_at>=now()-interval '10 minutes';
 if recent_same_voter>=6 then insert into integrity_alerts(award_space_id,vote_id,candidate_id,alert_type,severity,title,details) values(new.award_space_id,new.id,new.candidate_id,'voter_velocity','high','Repeated transactions from one voter token',jsonb_build_object('transactions_10m',recent_same_voter)) on conflict do nothing; end if;
 select count(*) into recent_candidate from votes where award_space_id=new.award_space_id and candidate_id=new.candidate_id and created_at>=now()-interval '5 minutes';
 if recent_candidate>=30 then insert into integrity_alerts(award_space_id,vote_id,candidate_id,alert_type,severity,title,details) values(new.award_space_id,new.id,new.candidate_id,'candidate_burst','medium','Unusual voting burst for candidate',jsonb_build_object('transactions_5m',recent_candidate)) on conflict do nothing; end if;
 return new;
end $$;
drop trigger if exists trg_detect_vote_integrity on public.votes;
create trigger trg_detect_vote_integrity after insert on public.votes for each row execute function public.detect_vote_integrity_alerts();
