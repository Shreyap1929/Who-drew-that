import type { GameSettings } from "@/lib/game/settings";

export type RoomStatus = "lobby" | "in_game" | "ended";

export interface RoomRow {
  code: string;
  host_id: string;
  settings: GameSettings;
  status: RoomStatus;
  created_at: string;
}

export interface PlayerRow {
  id: string;
  room_code: string;
  name: string;
  avatar_seed: string;
  is_ready: boolean;
  is_host: boolean;
  score: number;
  joined_at: string;
}

// Minimal shape passed to supabase-js generics.
export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: RoomRow;
        Insert: Omit<RoomRow, "created_at"> & { created_at?: string };
        Update: Partial<RoomRow>;
      };
      players: {
        Row: PlayerRow;
        Insert: Omit<PlayerRow, "joined_at" | "score"> & {
          joined_at?: string;
          score?: number;
        };
        Update: Partial<PlayerRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
