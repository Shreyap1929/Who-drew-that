"use client";

import StickyCard from "./StickyCard";

/** Friendly banner shown when Supabase env vars are missing. */
export default function OfflineNotice() {
  return (
    <StickyCard color="pink" tilt={-1.5} className="mx-auto max-w-md">
      <h3 className="font-display mb-2 text-2xl">🔌 Almost there!</h3>
      <p className="text-lg leading-snug">
        Multiplayer needs a Supabase connection. Copy{" "}
        <code className="rounded bg-black/10 px-1">.env.example</code> to{" "}
        <code className="rounded bg-black/10 px-1">.env.local</code>, add your
        project URL + anon key, run{" "}
        <code className="rounded bg-black/10 px-1">
          supabase/migrations/0001_init.sql
        </code>
        , then restart the dev server.
      </p>
    </StickyCard>
  );
}
