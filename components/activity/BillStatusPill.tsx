import { Icon } from "@/components/ui/Icon";
import type { BillStatus } from "@/data/seed";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<BillStatus, string> = {
  bill: "Bill",
  paid: "Paid",
  owes: "Owes",
};

// Bill = paid the bill on the night · Paid = paid them back · Owes = still owes.
export function BillStatusPill({ status }: { status: BillStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-label",
        status === "owes"
          ? "bg-gunmetal/10 text-gunmetal"
          : "bg-white text-gunmetal",
      )}
    >
      {STATUS_LABEL[status]}
      {status === "bill" && <Icon framed name="receipt" size={16} />}
    </span>
  );
}
