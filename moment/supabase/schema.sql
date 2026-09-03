-- MOMENT Supabase schema
-- Run in SQL Editor: https://supabase.com/dashboard/project/_/sql

create extension if not exists "pgcrypto";

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

-- Auto-create profile on signup
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

-- Optional: media storage bucket (create in dashboard if you want large video)
-- insert into storage.buckets (id, name, public) values ('moment-media', 'moment-media', false);
