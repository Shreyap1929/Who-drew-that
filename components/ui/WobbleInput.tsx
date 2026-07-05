"use client";

import type { InputHTMLAttributes } from "react";
import RoughBox from "./RoughBox";

export interface WobbleInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  seed?: number;
  fieldClassName?: string;
}

/** Text input wrapped in a hand-drawn rough border. */
export default function WobbleInput({
  label,
  seed = 5,
  className = "",
  fieldClassName = "",
  ...rest
}: WobbleInputProps) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="font-display mb-1.5 block text-lg text-ink-soft">
          {label}
        </span>
      )}
      <span className="relative block">
        <RoughBox fill="#ffffff" seed={seed} radius={12} strokeWidth={2.2} />
        <input
          className={`font-hand relative z-10 w-full bg-transparent px-4 py-2.5 text-xl text-ink placeholder:text-ink-soft/50 focus:outline-none ${fieldClassName}`}
          {...rest}
        />
      </span>
    </label>
  );
}
