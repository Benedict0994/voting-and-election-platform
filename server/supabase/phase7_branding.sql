-- Phase 7: branded award portals
alter table public.award_spaces add column if not exists logo_url text;
alter table public.award_spaces add column if not exists banner_url text;
alter table public.award_spaces add column if not exists primary_color text not null default '#0b1220';
alter table public.award_spaces add column if not exists accent_color text not null default '#f4b41a';
alter table public.award_spaces add column if not exists organizer_name text;
alter table public.award_spaces add column if not exists website_url text;
