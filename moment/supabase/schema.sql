-- MOMENT Supabase schema
-- Run in SQL Editor: https://supabase.com/dashboard/project/_/sql

create extension if not exists "pgcrypto";

-- ============================================================
-- Profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- Moments (user's own)
-- ============================================================
create table if not exists public.moments (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  place_name text not null,
  place_subtitle text,
  lat double precision not null,
  lng double precision not null,
  note text not null default '',
  media jsonb not null default '[]'::jsonb,
  location_locked boolean not null default true,
  time_locked boolean not null default false,
  unlock_at timestamptz,
  annual_tradition boolean not null default false,
  created_at timestamptz not null default now(),
  unlocked_at timestamptz,
  saved boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists moments_user_id_idx on public.moments (user_id);

alter table public.moments enable row level security;

create policy "Users can manage own moments"
  on public.moments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Shared Moments (sender → recipient via email)
-- ============================================================
create table if not exists public.shared_moments (
  id uuid primary key default gen_random_uuid(),
  moment_id text not null references public.moments (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  sender_name text not null default '',
  recipient_email text not null,
  recipient_name text not null default '',
  recipient_id uuid references public.profiles (id) on delete set null,
  claimed_at timestamptz,
  unlocked_at timestamptz,
  passcode text,
  created_at timestamptz not null default now()
);

create index if not exists shared_moments_recipient_email_idx
  on public.shared_moments (lower(recipient_email));
create index if not exists shared_moments_recipient_id_idx
  on public.shared_moments (recipient_id);
create index if not exists shared_moments_sender_id_idx
  on public.shared_moments (sender_id);

alter table public.shared_moments enable row level security;

create policy "Sender can manage own shares"
  on public.shared_moments for all
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

create policy "Recipient can view/claim shares addressed to them"
  on public.shared_moments for select
  using (
    auth.uid() = recipient_id
    or lower(recipient_email) = lower((select email from auth.users where id = auth.uid()))
  );

create policy "Recipient can update to claim/unlock"
  on public.shared_moments for update
  using (
    auth.uid() = recipient_id
    or lower(recipient_email) = lower((select email from auth.users where id = auth.uid()))
  )
  with check (
    auth.uid() = recipient_id
    or lower(recipient_email) = lower((select email from auth.users where id = auth.uid()))
  );

-- Auto-claim pending shares when a user signs up / matches by email
create or replace function public.claim_shares_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.shared_moments
  set recipient_id = new.id,
      claimed_at = coalesce(claimed_at, now())
  where lower(recipient_email) = lower(coalesce(new.email, ''))
    and recipient_id is null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_claim_shares on auth.users;
create trigger on_auth_user_claim_shares
  after insert on auth.users
  for each row execute function public.claim_shares_for_user();

-- ============================================================
-- Storage bucket for media (photos / videos)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit)
  values ('moment-media', 'moment-media', false, 52428800)
  on conflict (id) do nothing;

create policy "Users can upload own media"
  on storage.objects for insert
  with check (
    bucket_id = 'moment-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can read own media"
  on storage.objects for select
  using (
    bucket_id = 'moment-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Recipients can read shared media"
  on storage.objects for select
  using (
    bucket_id = 'moment-media'
    and exists (
      select 1 from public.shared_moments sm
      join public.moments m on m.id = sm.moment_id
      where m.user_id::text = (storage.foldername(name))[1]
        and (sm.recipient_id = auth.uid()
             or lower(sm.recipient_email) = lower((select email from auth.users where id = auth.uid())))
    )
  );

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'friend'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
