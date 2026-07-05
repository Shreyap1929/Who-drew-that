"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPlayerId } from "../identity";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when env vars are present so the UI can degrade gracefully offline. */
export const isSupabaseConfigured = Boolean(URL && ANON);

// Untyped client for v1: we cast query results to the row types in
// `./types` ourselves. Swap in generated types (supabase gen types) later.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(URL!, ANON!, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 20 } },
    });
  }
  return client;
}

/**
 * Return this browser's stable player id. v1 doesn't use Supabase Auth
 * (anonymous sign-ins may be disabled); we key rows on a local UUID instead.
 * Kept async so call sites don't change when real auth is added later.
 */
export async function ensureAuth(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  return getPlayerId() || null;
}
