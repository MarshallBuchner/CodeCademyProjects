-- QuitCurve Supabase schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Quit plans (one active plan per user)
create table if not exists public.user_plans (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  device text not null,
  frequency text not null,
  nicotine_strength text not null,
  weekly_spend numeric not null,
  pace text not null,
  start_date timestamptz not null,
  slip_count int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_plans enable row level security;

create policy "Users can manage own plan"
  on public.user_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Craving logs
create table if not exists public.craving_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  logged_at timestamptz not null default now(),
  intensity int not null check (intensity between 1 and 5),
  trigger_label text,
  managed boolean not null default true,
  note text
);

alter table public.craving_logs enable row level security;

create policy "Users can manage own cravings"
  on public.craving_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Daily check-ins
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  checkin_date date not null,
  mood text not null,
  stayed_on_plan boolean not null,
  note text,
  unique (user_id, checkin_date)
);

alter table public.daily_checkins enable row level security;

create policy "Users can manage own checkins"
  on public.daily_checkins for all
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
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
