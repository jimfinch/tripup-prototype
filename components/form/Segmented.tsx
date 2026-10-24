import { cn } from "@/lib/cn";

type SegmentedProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

// Row of pill choices, e.g. Close in: 30 min · 1 hr · 2 hrs · Custom.
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={cn(
            "tap-target flex h-10 flex-1 items-center justify-center rounded-pill text-label transition duration-150 active:scale-press",
            o === value
              ? "bg-gunmetal text-white"
              : "bg-off-white text-gunmetal",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
