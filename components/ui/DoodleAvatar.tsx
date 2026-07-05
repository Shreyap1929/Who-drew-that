"use client";

// Deterministic hand-drawn doodle face from a seed string.
// Same seed -> same face, so avatars are stable across clients.

const BG = [
  "#ff5a5f",
  "#ffcf3f",
  "#4ac29a",
  "#4a90e2",
  "#9b7bea",
  "#ff7eb6",
  "#2fb8c6",
  "#ff8c66",
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function DoodleAvatar({
  seed,
  size = 56,
  className = "",
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const h = hash(seed || "?");
  const bg = BG[h % BG.length];
  const eyeStyle = h % 3; // dot / line / sleepy
  const mouthStyle = (h >> 3) % 4; // smile / grin / o / flat
  const rosy = (h >> 5) % 2 === 0;

  const eye = (cx: number) => {
    if (eyeStyle === 0)
      return <circle cx={cx} cy={42} r={4} fill="#2b2a28" />;
    if (eyeStyle === 1)
      return (
        <line
          x1={cx - 4}
          y1={42}
          x2={cx + 4}
          y2={42}
          stroke="#2b2a28"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    return (
      <path
        d={`M${cx - 5} 43 Q${cx} 38 ${cx + 5} 43`}
        stroke="#2b2a28"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  const mouth = () => {
    if (mouthStyle === 0)
      return (
        <path
          d="M38 60 Q50 70 62 60"
          stroke="#2b2a28"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      );
    if (mouthStyle === 1)
      return (
        <path
          d="M38 58 Q50 72 62 58 Z"
          stroke="#2b2a28"
          strokeWidth={2.5}
          fill="#2b2a28"
          strokeLinejoin="round"
        />
      );
    if (mouthStyle === 2)
      return <circle cx={50} cy={62} r={5} fill="#2b2a28" />;
    return (
      <line
        x1={40}
        y1={62}
        x2={60}
        y2={62}
        stroke="#2b2a28"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="player avatar"
    >
      <circle
        cx={50}
        cy={50}
        r={44}
        fill={bg}
        stroke="#2b2a28"
        strokeWidth={4}
      />
      {rosy && (
        <>
          <circle cx={30} cy={58} r={6} fill="#ffffff" opacity={0.35} />
          <circle cx={70} cy={58} r={6} fill="#ffffff" opacity={0.35} />
        </>
      )}
      {eye(38)}
      {eye(62)}
      {mouth()}
    </svg>
  );
}
