"use client";

import { Avatar } from "@/components/ui/Avatar";
import {
  BELCANTO_ATTENDEES,
  PEOPLE,
  type BillItem,
  type PersonId,
} from "@/data/seed";
import { splitLabel } from "@/lib/bill";
import { useHint } from "@/lib/hints";
import { cn } from "@/lib/cn";
import { formatPence } from "@/lib/money";

type BillItemCardProps = {
  item: BillItem;
  attendees?: PersonId[];
  // Organiser only; without it the card is read-only (no avatars).
  onToggle?: (person: PersonId) => void;
};

// One line of the bill. Tapping an avatar excludes that person from the item
// (dimmed); the split label recalculates live.
export function BillItemCard({
  item,
  attendees = BELCANTO_ATTENDEES,
  onToggle,
}: BillItemCardProps) {
  const hintNic = useHint("exclude-nic");
  const hintRen = useHint("exclude-ren");
  const hintFor = (p: PersonId) =>
    item.id === "wine"
      ? p === "nic"
        ? hintNic
        : p === "ren"
          ? hintRen
          : ""
      : "";

  return (
    <div className="flex flex-col gap-2 rounded-sm bg-white p-3">
      <p className="flex justify-between text-headline text-gunmetal">
        <span>{item.label}</span>
        <span>{formatPence(item.amount)}</span>
      </p>
      <p className="text-body-s text-ink-muted">
        {splitLabel(item, attendees)}
      </p>
      {onToggle && (
        // Fixed-width cells keep the avatars evenly spaced whatever the name
        // length; the first name tells the PM who's who.
        <div className="flex gap-1.5">
          {attendees.map((p) => {
            const out = item.excluded.includes(p);
            const name = p === "ari" ? "You" : PEOPLE[p].firstName;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onToggle(p)}
                aria-pressed={!out}
                aria-label={`${name}: ${out ? "excluded" : "included"} in ${item.label}`}
                className="tap-target flex w-10 flex-col items-center gap-1 transition active:scale-press"
              >
                <span className={cn("rounded-pill", hintFor(p))}>
                  <Avatar id={p} dimmed={out} />
                </span>
                <span
                  className={cn(
                    "max-w-full truncate text-micro text-gunmetal transition-opacity duration-150",
                    out && "opacity-30",
                  )}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
