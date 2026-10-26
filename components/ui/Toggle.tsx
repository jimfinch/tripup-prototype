"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

// Figma "Toggle": on = lime track with gunmetal knob (right); off = gunmetal
// track with a white knob (left), so off never reads as on.
export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "tap-target flex w-18 shrink-0 rounded-pill p-1 transition-colors duration-200",
        checked ? "justify-end bg-lime" : "justify-start bg-gunmetal",
        className,
      )}
    >
      <motion.span
        layout
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "h-6 w-knob rounded-pill",
          checked ? "bg-gunmetal" : "bg-white",
        )}
      />
    </button>
  );
}
