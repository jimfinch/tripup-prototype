"use client";

import { motion } from "framer-motion";
import { Check } from "@/components/ui/Check";
import { cn } from "@/lib/cn";

type PollOptionRowProps = {
  label: string;
  votes: number;
  // Votes cast so far; each bar is its share of the total.
  totalVotes: number;
  leading: boolean;
  selected: boolean;
  onSelect?: () => void;
  disabled?: boolean;
};

// Vote option with a live results bar (wireflow 06, styled with hi-fi tokens).
// The bar width and leader highlight animate as votes arrive.
export function PollOptionRow({
  label,
  votes,
  totalVotes,
  leading,
  selected,
  onSelect,
  disabled,
}: PollOptionRowProps) {
  const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "relative flex h-12 w-full items-center justify-between overflow-hidden rounded-sm border p-2 text-left transition duration-150 active:scale-press disabled:active:scale-100",
        selected ? "border-gunmetal" : "border-gunmetal/15",
      )}
    >
      <motion.span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 transition-colors duration-300",
          leading ? "bg-violet/25" : "bg-off-white",
        )}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <span className="relative flex items-center gap-2">
        <Check state={selected ? "selected" : "empty"} />
        <span className="text-headline text-gunmetal">{label}</span>
      </span>
      <span
        className={cn(
          "relative text-body-s transition-colors duration-300",
          leading ? "text-gunmetal" : "text-ink-muted",
        )}
      >
        {votes} {votes === 1 ? "vote" : "votes"}
      </span>
    </button>
  );
}
