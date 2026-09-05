-- QuitCurve puff logs (daily taper pacing)
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.puff_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  logged_at timestamptz not null default now(),
  count int not null default 1 check (count >= 1 and count <= 20)
);

alter table public.puff_logs enable row level security;

create policy "Users can manage own puff logs"
  on public.puff_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists puff_logs_user_logged_idx
  on public.puff_logs (user_id, logged_at);
