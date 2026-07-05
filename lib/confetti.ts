"use client";

import confetti from "canvas-confetti";

const CRAYONS = ["#ff5a5f", "#ffcf3f", "#4ac29a", "#4a90e2", "#9b7bea", "#ff7eb6"];

/** A cheerful crayon-coloured burst. */
export function celebrate(): void {
  const base = { colors: CRAYONS, ticks: 200, scalar: 1.1 };
  confetti({ ...base, particleCount: 60, spread: 70, origin: { y: 0.7 } });
  confetti({ ...base, particleCount: 30, spread: 100, angle: 60, origin: { x: 0, y: 0.75 } });
  confetti({ ...base, particleCount: 30, spread: 100, angle: 120, origin: { x: 1, y: 0.75 } });
}
