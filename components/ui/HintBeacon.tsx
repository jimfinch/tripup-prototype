import { cn } from "@/lib/cn";

// Tap beacon for large targets (cards), where a ring would cut the card up:
// a small violet dot with a soft expanding pulse.
export function HintBeacon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 flex size-3.5",
        className,
      )}
    >
      <span className="hint-beacon-pulse absolute inset-0 rounded-pill bg-violet" />
      <span className="relative size-3.5 rounded-pill border-2 border-white bg-violet shadow-avatar" />
    </span>
  );
}
