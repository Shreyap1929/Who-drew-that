# Who Drew That? 🎨🕵️

A multiplayer **social-deduction drawing game**. Everyone shares one canvas and
sketches the secret word one stroke at a time — except the **imposter(s)**, who
got a different word (or none) and must fake it. Then everyone discusses, votes,
and the imposters are revealed. Repeat across rounds; highest score wins.

> **Status:** Session-1 foundation. The full pre-game flow (landing → settings →
> lobby with realtime presence + ready-up) is built. The in-game loop (drawing,
> discussion, voting, reveal, scoring) lands next.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Framer Motion** + **rough.js** (hand-drawn doodle UI)
- **Supabase** — Realtime (lobby presence + live strokes later), Postgres +
  Row-Level-Security (secure secret-word delivery), Anonymous Auth
- Deploys to **Vercel** (app) + **Supabase** (managed backend)

## Getting started

1. Install deps:
   ```bash
   npm install
   ```
2. Create a free **Supabase** project at https://supabase.com.
3. In the Supabase dashboard:
   - **SQL Editor** → run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   - **Authentication → Sign In / Providers** → enable **Anonymous sign-ins**.
4. Copy env and fill in your project URL + anon key:
   ```bash
   cp .env.example .env.local
   ```
5. Run it:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. To test multiplayer, open several tabs / an
   incognito window and join with the room code.

> Without Supabase env vars the UI still renders (great for design work) and
> shows a friendly "connect Supabase" note where multiplayer would kick in.

## Project layout

```
app/                 landing, /create (settings), /join, /room/[code] (lobby)
components/ui/        doodle design kit (RoughBox, StickyCard, DoodleButton, …)
lib/                  supabase client, room helpers, realtime hook, game config
supabase/migrations/ 0001_init.sql (rooms + players + RLS + realtime)
supabase/functions/  assign-roles (stub, next session)
```

## Roadmap (next session)

Drawing turns + live canvas broadcast · discussion chat · voting · reveal replay
· scoring · multi-round loop · `assign-roles` Edge Function + `assignments` RLS ·
disconnect/host-migration · Groq-powered dynamic word pairs · Vercel deploy.
