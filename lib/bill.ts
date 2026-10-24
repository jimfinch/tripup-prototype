import type { BillItem, PersonId } from "@/data/seed";
import type { Pence } from "@/lib/money";

// Splits an amount between people in integer pence. Leftover pence go to the
// first people in list order, so the parts always add up to the amount.
export function splitPence(
  amount: Pence,
  people: PersonId[],
): Map<PersonId, Pence> {
  const shares = new Map<PersonId, Pence>();
  if (people.length === 0) return shares;
  const base = Math.floor(amount / people.length);
  let remainder = amount - base * people.length;
  for (const p of people) {
    shares.set(p, base + (remainder > 0 ? 1 : 0));
    remainder = Math.max(0, remainder - 1);
  }
  return shares;
}

export const itemPayers = (item: BillItem, attendees: PersonId[]) =>
  attendees.filter((p) => !item.excluded.includes(p));

// Each attendee's total share of the bill across all items.
export function billShares(
  items: BillItem[],
  attendees: PersonId[],
): Map<PersonId, Pence> {
  const totals = new Map<PersonId, Pence>(attendees.map((p) => [p, 0]));
  for (const item of items) {
    for (const [p, share] of splitPence(
      item.amount,
      itemPayers(item, attendees),
    )) {
      totals.set(p, (totals.get(p) ?? 0) + share);
    }
  }
  return totals;
}
