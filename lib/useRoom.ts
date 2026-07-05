"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ensureAuth, getSupabase, isSupabaseConfigured } from "./supabase/client";
import type { PlayerRow, RoomRow } from "./supabase/types";

export interface UseRoomState {
  room: RoomRow | null;
  players: PlayerRow[];
  onlineIds: Set<string>;
  uid: string | null;
  me: PlayerRow | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
}

/**
 * Subscribe to a room's roster + status in realtime.
 * Source of truth is the DB; presence adds live online/offline dots.
 */
export function useRoom(code: string): UseRoomState {
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const refetchPlayers = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("players")
      .select("*")
      .eq("room_code", code)
      .order("joined_at", { ascending: true });
    if (data) setPlayers(data as PlayerRow[]);
  }, [code]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase isn't connected yet.");
      setLoading(false);
      return;
    }
    const sb = getSupabase()!;
    let cancelled = false;

    (async () => {
      const myId = await ensureAuth();
      if (cancelled) return;
      setUid(myId);

      const { data: roomData, error: roomErr } = await sb
        .from("rooms")
        .select("*")
        .eq("code", code)
        .maybeSingle();
      if (cancelled) return;
      if (roomErr) setError(roomErr.message);
      setRoom((roomData as RoomRow) ?? null);
      await refetchPlayers();
      setLoading(false);

      const channel = sb
        .channel(`room:${code}`, {
          config: { presence: { key: myId ?? "anon" } },
        })
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: `room_code=eq.${code}` },
          () => refetchPlayers(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
          (payload) => {
            if (payload.eventType === "DELETE") setRoom(null);
            else setRoom(payload.new as RoomRow);
          },
        )
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          setOnlineIds(new Set(Object.keys(state)));
        });

      channel.subscribe((status) => {
        if (status === "SUBSCRIBED" && myId) {
          channel.track({ uid: myId });
        }
      });
      channelRef.current = channel;
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        sb.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [code, refetchPlayers]);

  const me = uid ? players.find((p) => p.id === uid) ?? null : null;

  return {
    room,
    players,
    onlineIds,
    uid,
    me,
    loading,
    error,
    configured: isSupabaseConfigured,
  };
}
