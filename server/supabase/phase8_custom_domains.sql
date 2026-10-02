-- Phase 8: custom domains
alter table public.award_spaces add column if not exists custom_domain text;
alter table public.award_spaces add column if not exists domain_status text not null default 'not_configured';
alter table public.award_spaces add column if not exists domain_verification_token text;
alter table public.award_spaces add column if not exists domain_verified_at timestamptz;
create unique index if not exists award_spaces_custom_domain_unique on public.award_spaces(lower(custom_domain)) where custom_domain is not null;
