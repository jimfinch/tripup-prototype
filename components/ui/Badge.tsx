import { cn } from "@/lib/cn";

// Figma "Pill Small": the NEW marker on a freshly added activity.
// Lime on the gunmetal date block, so it reads against it (the date block
// was lime before the today dot replaced it).
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded bg-lime px-2 text-micro text-gunmetal",
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
