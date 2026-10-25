"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Pence } from "@/lib/money";

const plain = (p: Pence) => (p / 100).toFixed(2);

// Parses "82.15", "£82.15" or "1,050" into pence; null if it isn't a number.
const toPence = (text: string): Pence | null => {
  const n = Number(text.replace(/[£,\s]/g, ""));
  return text.trim() !== "" && Number.isFinite(n) && n >= 0
    ? Math.round(n * 100)
    : null;
};

type AmountFieldProps = {
  amount: Pence;
  label: string;
  // Editable amounts have a border; read-only ones (You are owed, Total)
  // keep the same pill with a transparent border so the figures line up.
  onChange?: (amount: Pence) => void;
};

// Figma "Input" (Activity view - Edit): a bordered pill, no fill, with a
// muted "£" before the amount. Commits on blur or Enter.
export function AmountField({ amount, label, onChange }: AmountFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? plain(amount);

  const commit = () => {
    const pence = draft === null ? null : toPence(draft);
    if (pence !== null && pence !== amount) onChange?.(pence);
    setDraft(null);
  };

  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-0.5 rounded-pill border px-4 text-headline text-gunmetal",
        onChange
          ? "border-gunmetal/25 focus-within:border-gunmetal"
          : "border-transparent",
      )}
    >
      <span className="text-ink-muted">£</span>
      {onChange ? (
        // The hidden copy sizes the input to its text, so "£" stays snug.
        <span className="inline-grid">
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 whitespace-pre"
          >
            {text || " "}
          </span>
          <input
            aria-label={label}
            inputMode="decimal"
            size={1}
            value={text}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="col-start-1 row-start-1 w-full min-w-0 bg-transparent outline-none"
          />
        </span>
      ) : (
        <span aria-label={label}>
          {new Intl.NumberFormat("en-GB", {
            minimumFractionDigits: 2,
          }).format(amount / 100)}
        </span>
      )}
    </span>
  );
}
