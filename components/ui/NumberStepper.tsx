"use client";

import { motion } from "framer-motion";
import RoughBox from "./RoughBox";

export interface NumberStepperProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  icon?: string;
  onChange: (v: number) => void;
  seed?: number;
}

export default function NumberStepper({
  label,
  hint,
  value,
  min,
  max,
  suffix,
  icon,
  onChange,
  seed = 3,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const Btn = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: string;
  }) => (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.85 }}
      onClick={onClick}
      disabled={disabled}
      className={`font-display grid h-9 w-9 place-items-center rounded-full border-[2.5px] border-ink text-xl leading-none ${
        disabled ? "opacity-30" : "cursor-pointer bg-white hover:bg-note-yellow"
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="relative px-4 py-3">
      <RoughBox fill="#ffffff" seed={seed} radius={12} strokeWidth={2} />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-lg leading-tight">
            {icon && <span className="mr-1">{icon}</span>}
            {label}
          </div>
          {hint && (
            <div className="font-hand text-sm text-ink-soft/70">{hint}</div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Btn onClick={dec} disabled={value <= min}>
            –
          </Btn>
          <div className="font-display w-14 text-center text-2xl tabular-nums">
            {value}
            {suffix && (
              <span className="ml-0.5 text-sm text-ink-soft">{suffix}</span>
            )}
          </div>
          <Btn onClick={inc} disabled={value >= max}>
            +
          </Btn>
        </div>
      </div>
    </div>
  );
}
