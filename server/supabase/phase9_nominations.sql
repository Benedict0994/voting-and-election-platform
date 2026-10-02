-- Phase 9: nomination stage
create table if not exists public.nominations (
 id uuid primary key default gen_random_uuid(),
 award_space_id uuid not null references public.award_spaces(id) on delete cascade,
 nominee_name text not null,
 category text not null,
 department text,
 bio text,
 image_url text,
 nominator_name text,
 nominator_email text,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 reviewed_by uuid references public.admins(id) on delete set null,
 reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists nominations_space_status_idx on public.nominations(award_space_id,status,created_at desc);
alter table public.settings add column if not exists nominations_open boolean not null default false;
alter table public.settings add column if not exists nominations_start timestamptz;
alter table public.settings add column if not exists nominations_end timestamptz;
alter table public.nominations enable row level security;
