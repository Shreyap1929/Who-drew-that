"use client";

import { ensureAuth, getSupabase } from "./supabase/client";
import type { GameSettings } from "./game/settings";
import { normalizeSettings } from "./game/settings";
import { PLAYER_LIMITS } from "./game/constants";
import { generateRoomCode } from "./roomCode";
import type { Identity } from "./identity";

export type RoomResult =
  | { ok: true; code: string; uid: string }
  | { ok: false; error: string };

function requireClient() {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  return sb;
}

/** Create a room, insert the host player, return the room code. */
export async function createRoom(
  identity: Identity,
  settings: GameSettings,
): Promise<RoomResult> {
  const sb = requireClient();
  const uid = await ensureAuth();
  if (!uid) return { ok: false, error: "Could not sign in. Try again." };

  const clean = normalizeSettings(settings);

  // Retry a few times on the (very unlikely) code collision.
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateRoomCode();
    const { error } = await sb
      .from("rooms")
      .insert({ code, host_id: uid, settings: clean, status: "lobby" });
    if (error) {
      if (error.code === "23505") continue; // duplicate code -> retry
      return { ok: false, error: error.message };
    }
    const joined = await upsertPlayer(code, uid, identity, true);
    if (!joined.ok) return joined;
    return { ok: true, code, uid };
  }
  return { ok: false, error: "Couldn't find a free room code. Try again." };
}

/** Join an existing lobby by code. */
export async function joinRoom(
  code: string,
  identity: Identity,
): Promise<RoomResult> {
  const sb = requireClient();
  const uid = await ensureAuth();
  if (!uid) return { ok: false, error: "Could not sign in. Try again." };

  const { data: room, error } = await sb
    .from("rooms")
    .select("code,status")
    .eq("code", code)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!room) return { ok: false, error: "No room with that code." };
  if (room.status !== "lobby")
    return { ok: false, error: "That game has already started." };

  const { count } = await sb
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("room_code", code);
  // Allow rejoin (same uid) even at cap.
  if ((count ?? 0) >= PLAYER_LIMITS.SOFT_MAX) {
    const { data: existing } = await sb
      .from("players")
      .select("id")
      .eq("room_code", code)
      .eq("id", uid)
      .maybeSingle();
    if (!existing) return { ok: false, error: "This room is full." };
  }

  const joined = await upsertPlayer(code, uid, identity, false);
  if (!joined.ok) return joined;
  return { ok: true, code, uid };
}

async function upsertPlayer(
  code: string,
  uid: string,
  identity: Identity,
  isHost: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = requireClient();
  const { error } = await sb.from("players").upsert(
    {
      id: uid,
      room_code: code,
      name: identity.name.trim().slice(0, 20) || "Player",
      avatar_seed: identity.avatarSeed,
      is_host: isHost,
      is_ready: isHost, // host counts as ready
    },
    { onConflict: "id" },
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setReady(uid: string, ready: boolean): Promise<void> {
  const sb = requireClient();
  await sb.from("players").update({ is_ready: ready }).eq("id", uid);
}

export async function updateSettings(
  code: string,
  settings: GameSettings,
): Promise<void> {
  const sb = requireClient();
  await sb
    .from("rooms")
    .update({ settings: normalizeSettings(settings) })
    .eq("code", code);
}

export async function leaveRoom(uid: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("players").delete().eq("id", uid);
}

/** Host starts the game (session 1: flips status; game loop lands next session). */
export async function startGame(code: string): Promise<void> {
  const sb = requireClient();
  await sb.from("rooms").update({ status: "in_game" }).eq("code", code);
}
