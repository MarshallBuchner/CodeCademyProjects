-- ============================================================
-- Read receipts: notify sender when a shared Moment is unlocked
-- Paste into: Supabase → SQL Editor → Run (MOMENT project)
-- Safe to re-run (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ============================================================

create table if not exists public.share_links (
  id text primary key,
  access_key text not null,
  sealed text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

alter table public.share_links
  add column if not exists opened_at timestamptz,
  add column if not exists opened_notified_at timestamptz,
  add column if not exists sender_email text,
  add column if not exists recipient_name text,
  add column if not exists place_name text,
  add column if not exists title text;

create index if not exists share_links_expires_at_idx
  on public.share_links (expires_at);

alter table public.share_links enable row level security;
-- No anon policies: only the service role (Next.js API) reads/writes.
