-- ============================================================
-- REQUIRED for SMS / Messenger short links
-- Paste into: Supabase → SQL Editor → Run
-- Project: moment (wpxfvzosoqsaxkwneapw)
-- ============================================================

-- Run in Supabase SQL Editor (MOMENT project)
-- Enables short /m/{id}?k=… share links for SMS & Messenger

create table if not exists public.share_links (
  id text primary key,
  access_key text not null,
  sealed text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

create index if not exists share_links_expires_at_idx
  on public.share_links (expires_at);

alter table public.share_links enable row level security;
-- No anon policies: only the service role (Next.js API) reads/writes.
