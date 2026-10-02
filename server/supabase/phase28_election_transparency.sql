-- Phase 28: public election transparency settings
alter table public.award_spaces add column if not exists public_transparency_enabled boolean not null default false;
alter table public.award_spaces add column if not exists public_transparency_published_at timestamptz;
