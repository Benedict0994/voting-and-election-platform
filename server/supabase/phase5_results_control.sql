-- AwardVote Phase 5: results control centre
alter table public.settings add column if not exists results_mode text not null default 'live'
  check(results_mode in ('live','hidden','percentage','ranking','publish_after_close','scheduled'));
alter table public.settings add column if not exists results_publish_at timestamptz;
alter table public.settings add column if not exists results_show_vote_totals boolean not null default true;
alter table public.settings add column if not exists results_show_percentages boolean not null default true;
