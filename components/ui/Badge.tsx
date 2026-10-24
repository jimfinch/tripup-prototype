import { cn } from "@/lib/cn";

// Figma "Pill Small": the NEW marker on a freshly added activity.
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded bg-gunmetal px-2 text-micro text-lime",
        className,
      )}
    >
      NEW
    </span>
  );
}

// Figma "Count": number bubble inside the Polls / Itinerary / Stays buttons.
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
        "inline-flex size-6 items-center justify-center",
        className,
      )}
    >
      <span className="flex size-4 items-center justify-center rounded-pill bg-lilac text-micro text-gunmetal">
        {value}
      </span>
    </span>
  );
}
