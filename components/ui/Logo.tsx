"use client";

import { motion } from "framer-motion";

export default function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const big = size === "lg";
  return (
    <motion.h1
      initial={{ opacity: 0, y: -12, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 14 }}
      className={`font-display title-pop leading-[0.9] ${
        big ? "text-5xl sm:text-6xl" : "text-3xl"
      }`}
    >
      <span className="text-crayon-red">Who </span>
      <span className="text-crayon-blue">Drew </span>
      <span className="text-crayon-green">That</span>
      <span className="text-crayon-purple">?</span>
    </motion.h1>
  );
}
