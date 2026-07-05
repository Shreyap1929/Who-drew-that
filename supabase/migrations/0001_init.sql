-- Who Drew That? — base schema (rooms + players)
-- Run this in the Supabase SQL editor (or via the Supabase CLI).
-- Also enable "Anonymous sign-ins": Authentication -> Sign In / Providers -> Anonymous.

-- ------------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------------
create table if not exists public.rooms (
  code        text primary key,
  host_id     uuid not null,
  settings    jsonb not null default '{}'::jsonb,
  status      text not null default 'lobby'
              check (status in ('lobby', 'in_game', 'ended')),
  created_at  timestamptz not null default now()
);

create table if not exists public.players (
  id          uuid primary key,                       -- = auth.uid()
  room_code   text not null references public.rooms(code) on delete cascade,
  name        text not null,
  avatar_seed text not null default '',
  is_ready    boolean not null default false,
  is_host     boolean not null default false,
  score       integer not null default 0,
  joined_at   timestamptz not null default now()
);

create index if not exists players_room_code_idx on public.players (room_code);

-- ------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------
alter table public.rooms   enable row level security;
alter table public.players enable row level security;

-- v1 lobby policies: permissive for the anon role. Players are identified by a
-- client-generated UUID (no Supabase Auth), and lobby data is non-sensitive, so
-- we allow the anon key full access to rooms/players. Secret words (next session)
-- are written by an Edge Function with the service-role key and never exposed via
-- these tables, so relaxing lobby RLS does not weaken word secrecy.
-- Drop any earlier granular policies from a prior run:
drop policy if exists rooms_select on public.rooms;
drop policy if exists rooms_insert on public.rooms;
drop policy if exists rooms_update on public.rooms;
drop policy if exists rooms_delete on public.rooms;
drop policy if exists players_select on public.players;
drop policy if exists players_insert on public.players;
drop policy if exists players_update on public.players;
drop policy if exists players_delete on public.players;

drop policy if exists rooms_all on public.rooms;
create policy rooms_all on public.rooms
  for all to anon, authenticated using (true) with check (true);

drop policy if exists players_all on public.players;
create policy players_all on public.players
  for all to anon, authenticated using (true) with check (true);

-- ------------------------------------------------------------------
-- Realtime (postgres_changes for the lobby)
-- ------------------------------------------------------------------
alter table public.rooms   replica identity full;
alter table public.players replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'players'
  ) then
    alter publication supabase_realtime add table public.players;
  end if;
end $$;
