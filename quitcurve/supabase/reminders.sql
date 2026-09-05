-- QuitCurve reminder settings + send log
-- Run in Supabase SQL Editor after schema.sql
-- https://supabase.com/dashboard/project/_/sql

-- Per-user reminder preferences
create table if not exists public.reminder_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email_enabled boolean not null default false,
  sms_enabled boolean not null default false,
  phone_e164 text,
  timezone text not null default 'America/Toronto',
  preferred_hour smallint not null default 18
    check (preferred_hour >= 0 and preferred_hour <= 23),
  email_consent_at timestamptz,
  sms_consent_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.reminder_settings enable row level security;

create policy "Users can view own reminder settings"
  on public.reminder_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own reminder settings"
  on public.reminder_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reminder settings"
  on public.reminder_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One send record per user / channel / local calendar day (duplicate protection)
create table if not exists public.reminder_sends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel text not null check (channel in ('email', 'sms')),
  local_date date not null,
  sent_at timestamptz not null default now(),
  unique (user_id, channel, local_date)
);

alter table public.reminder_sends enable row level security;

-- Users can read their own send history (optional UI later)
create policy "Users can view own reminder sends"
  on public.reminder_sends for select
  using (auth.uid() = user_id);

-- Inserts are done by the service-role cron job only (no user insert policy)

create index if not exists reminder_sends_user_date_idx
  on public.reminder_sends (user_id, local_date);

create index if not exists reminder_settings_enabled_idx
  on public.reminder_settings (email_enabled, sms_enabled)
  where email_enabled = true or sms_enabled = true;
