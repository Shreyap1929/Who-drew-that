import { PLAYER_LIMITS, SETTING_BOUNDS, maxImpostersFor } from "./constants";

export interface GameSettings {
  imposterCount: number;
  turnDurationSec: number;
  drawingCycles: number;
  rounds: number;
  discussionSec: number;
  votingSec: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  imposterCount: SETTING_BOUNDS.imposterCount.default,
  turnDurationSec: SETTING_BOUNDS.turnDurationSec.default,
  drawingCycles: SETTING_BOUNDS.drawingCycles.default,
  rounds: SETTING_BOUNDS.rounds.default,
  discussionSec: SETTING_BOUNDS.discussionSec.default,
  votingSec: SETTING_BOUNDS.votingSec.default,
};

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/** Coerce any partial/untrusted object into valid, bounded settings. */
export function normalizeSettings(raw: Partial<GameSettings>): GameSettings {
  return {
    imposterCount: clamp(
      raw.imposterCount ?? DEFAULT_SETTINGS.imposterCount,
      SETTING_BOUNDS.imposterCount.min,
      SETTING_BOUNDS.imposterCount.max,
    ),
    turnDurationSec: clamp(
      raw.turnDurationSec ?? DEFAULT_SETTINGS.turnDurationSec,
      SETTING_BOUNDS.turnDurationSec.min,
      SETTING_BOUNDS.turnDurationSec.max,
    ),
    drawingCycles: clamp(
      raw.drawingCycles ?? DEFAULT_SETTINGS.drawingCycles,
      SETTING_BOUNDS.drawingCycles.min,
      SETTING_BOUNDS.drawingCycles.max,
    ),
    rounds: clamp(
      raw.rounds ?? DEFAULT_SETTINGS.rounds,
      SETTING_BOUNDS.rounds.min,
      SETTING_BOUNDS.rounds.max,
    ),
    discussionSec: clamp(
      raw.discussionSec ?? DEFAULT_SETTINGS.discussionSec,
      SETTING_BOUNDS.discussionSec.min,
      SETTING_BOUNDS.discussionSec.max,
    ),
    votingSec: clamp(
      raw.votingSec ?? DEFAULT_SETTINGS.votingSec,
      SETTING_BOUNDS.votingSec.min,
      SETTING_BOUNDS.votingSec.max,
    ),
  };
}

/**
 * Can a game actually start with these settings and this many players?
 * Enforced at "Start Game" time since player count is dynamic.
 */
export function canStartGame(
  playerCount: number,
  settings: GameSettings,
): { ok: boolean; reason?: string } {
  if (playerCount < PLAYER_LIMITS.MIN)
    return {
      ok: false,
      reason: `Need at least ${PLAYER_LIMITS.MIN} players to start.`,
    };
  const maxImp = maxImpostersFor(playerCount);
  if (settings.imposterCount > maxImp)
    return {
      ok: false,
      reason: `Too many imposters for ${playerCount} players (max ${maxImp}). Lower it or wait for more players.`,
    };
  return { ok: true };
}
