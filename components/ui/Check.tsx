import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type CheckState = "yes" | "pending" | "selected" | "empty";

// Figma "Check": 30 px status circle. "yes" and "pending" come from the
// attendee list; "selected" / "empty" are its use as a poll radio.
// Pending is the bare icon (no circle), kept in a 30 px slot so rows align.
export function Check({
  state,
  className,
}: {
  state: CheckState;
  className?: string;
}) {
  if (state === "pending") {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-7.5 shrink-0 items-center justify-center text-gunmetal",
          className,
        )}
      >
        <Icon name="pending-user" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7.5 shrink-0 items-center justify-center rounded-pill border transition-colors duration-150",
        state === "selected"
          ? "border-gunmetal bg-gunmetal text-white"
          : "border-gunmetal/10 bg-white text-gunmetal",
        className,
      )}
    >
      {state !== "empty" && <Icon name="check" width={16} />}
    </span>
  );
}
