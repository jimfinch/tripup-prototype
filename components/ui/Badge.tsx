import { cn } from "@/lib/cn";

// Figma activity card "Label": the NEW pill under the date block of an
// activity added in the last 24 hours, as wide as the block.
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-5 w-18 items-center justify-center rounded-pill bg-gunmetal px-2 text-micro text-white",
        className,
      )}
    >
      NEW
    </span>
  );
}

// Figma "Count": number bubble inside the Polls / Itinerary / Stays buttons
// (sits in the button's 20 px icon slot).
export function CountBadge({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-5 items-center justify-center",
        className,
      )}
    >
      <span className="flex size-4 items-center justify-center rounded-pill bg-lilac text-micro text-gunmetal">
        {value}
      </span>
    </span>
  );
}
