"use client";

// The player's chosen name + doodle-avatar seed, persisted locally so it
// survives navigation and refreshes. (Their Supabase uid is separate.)

const KEY = "wdt.identity";
const PID_KEY = "wdt.pid";

export interface Identity {
  name: string;
  avatarSeed: string;
}

/**
 * A stable per-browser player id (UUID). We don't use Supabase Auth for v1,
 * so this is the identity RLS-permissive rows are keyed on. Survives refresh.
 */
export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let pid = localStorage.getItem(PID_KEY);
  if (!pid) {
    pid = crypto.randomUUID();
    localStorage.setItem(PID_KEY, pid);
  }
  return pid;
}

export function randomAvatarSeed(): string {
  // Avoid Math.random restrictions? crypto is available in the browser.
  const arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  return `${arr[0].toString(36)}${arr[1].toString(36)}`;
}

export function getIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Identity;
    if (parsed && typeof parsed.name === "string") return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function saveIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(identity));
}
