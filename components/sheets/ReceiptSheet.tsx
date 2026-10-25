"use client";

import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { PEOPLE, type BillItem, type PersonId } from "@/data/seed";
import { splitLabel } from "@/lib/bill";
import { formatPence } from "@/lib/money";

export type ReceiptView = {
  label: string;
  item: BillItem;
  venue: string;
  date: string;
  time: string;
  payer: PersonId;
  attendees: PersonId[];
};

type ReceiptSheetProps = {
  receipt: ReceiptView | null;
  onClose: () => void;
};

// A scanned receipt, so anyone on the bill can check it against their share.
// No receipt photos exist in the design, so it's drawn from the bill itself.
export function ReceiptSheet({ receipt, onClose }: ReceiptSheetProps) {
  return (
    <Sheet
      open={!!receipt}
      onClose={onClose}
      title={receipt ? `${receipt.label} receipt` : ""}
    >
      {receipt && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-off-white p-4">
            <div className="flex flex-col gap-4 rounded-sm bg-white px-5 py-6 text-gunmetal shadow-avatar">
              <div className="flex flex-col items-center gap-1 text-center">
                <Icon framed name="receipt" className="text-ink-muted" />
                <p className="text-title-s">{receipt.venue}</p>
                <p className="text-body-s text-ink-muted">
                  {receipt.date} · {receipt.time}
                </p>
              </div>
              <ul className="flex flex-col gap-2 border-y border-dashed border-gunmetal/20 py-4 text-body-s">
                {receipt.item.lines.map((line) => (
                  <li key={line.label} className="flex justify-between gap-4">
                    <span>{line.label}</span>
                    <span>{formatPence(line.amount)}</span>
                  </li>
                ))}
              </ul>
              <p className="flex justify-between text-headline">
                <span>Total</span>
                <span>{formatPence(receipt.item.amount)}</span>
              </p>
              <p className="text-center text-caption text-ink-muted">
                Paid by{" "}
                {receipt.payer === "ari"
                  ? "you"
                  : PEOPLE[receipt.payer].firstName}
              </p>
            </div>
          </div>
          <p className="text-body-s text-ink-muted">
            {splitLabel(receipt.item, receipt.attendees)}
          </p>
        </div>
      )}
    </Sheet>
  );
}
