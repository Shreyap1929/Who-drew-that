"use client";

import { motion } from "framer-motion";

// Faint hand-drawn scribbles scattered behind content for playful depth.
const DOODLES = [
  { d: "M10 40 Q40 5 70 40 T130 40", top: "8%", left: "6%", color: "#ff5a5f", rotate: -8 },
  { d: "M0 20 L20 0 L40 20 L20 40 Z", top: "16%", left: "84%", color: "#4a90e2", rotate: 12 },
  { d: "M10 30 C10 10 40 10 40 30 C40 50 10 50 10 30", top: "70%", left: "10%", color: "#4ac29a", rotate: 6 },
  { d: "M0 0 L30 30 M30 0 L0 30", top: "78%", left: "82%", color: "#9b7bea", rotate: -10 },
  { d: "M0 15 Q15 -5 30 15 Q45 35 60 15", top: "44%", left: "90%", color: "#ffcf3f", rotate: 4 },
  { d: "M0 20 A20 20 0 1 1 40 20 A20 20 0 1 1 0 20", top: "40%", left: "3%", color: "#ff7eb6", rotate: 0 },
];

export default function DoodleBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {DOODLES.map((doodle, i) => (
        <motion.svg
          key={i}
          width={110}
          height={70}
          viewBox="0 0 140 50"
          className="absolute"
          style={{ top: doodle.top, left: doodle.left }}
          initial={{ opacity: 0, scale: 0.6, rotate: doodle.rotate }}
          animate={{
            opacity: 0.28,
            scale: 1,
            rotate: [doodle.rotate, doodle.rotate + 6, doodle.rotate],
          }}
          transition={{
            opacity: { duration: 0.8, delay: i * 0.12 },
            rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <path
            d={doodle.d}
            fill="none"
            stroke={doodle.color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}
