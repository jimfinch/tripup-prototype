"use client";

import { Avatar } from "@/components/ui/Avatar";
import {
  BELCANTO_ATTENDEES,
  PEOPLE,
  type BillItem,
  type PersonId,
} from "@/data/seed";
import { itemPayers } from "@/lib/bill";
import { useHint } from "@/lib/hints";
import { cn } from "@/lib/cn";
import { formatPence } from "@/lib/money";

type BillItemCardProps = {
  item: BillItem;
  onToggle: (person: PersonId) => void;
};

// One line of the bill. Tapping an avatar excludes that person from the item
// (dimmed); the split label recalculates live.
export function BillItemCard({ item, onToggle }: BillItemCardProps) {
  const payers = itemPayers(item, BELCANTO_ATTENDEES);
  const each = payers.length ? Math.round(item.amount / payers.length) : 0;
  // Listed guests-first, as in the wireflow ("Ren & Nic excluded").
  const excluded = [...item.excluded]
    .sort(
      (a, b) => BELCANTO_ATTENDEES.indexOf(b) - BELCANTO_ATTENDEES.indexOf(a),
    )
    .map((p) => PEOPLE[p].firstName);
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
        Split {payers.length} ways - {formatPence(each)} each
        {excluded.length > 0 && ` - ${excluded.join(" & ")} excluded`}
      </p>
      <div className="flex flex-wrap gap-2">
        {BELCANTO_ATTENDEES.map((p) => {
          const out = item.excluded.includes(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => onToggle(p)}
              aria-pressed={!out}
              aria-label={`${PEOPLE[p].firstName}: ${out ? "excluded" : "included"} in ${item.label}`}
              className={cn(
                "tap-target rounded-pill transition active:scale-press",
                hintFor(p),
              )}
            >
              <Avatar id={p} dimmed={out} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
