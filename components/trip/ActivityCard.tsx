import { PayState } from "@/components/pay/PayState";
import { formatPence, type Pence } from "@/lib/money";
import { cn } from "@/lib/cn";

export type ActivityCardProps = {
  day: number;
  month: string;
  title: string;
  type: string;
  time: string;
  coming: number;
  // Ari's share.
  share: Pence;
  paid: boolean;
  // Vertical timeline line under the date (all but the last card).
  connector?: boolean;
  onPay?: () => void;
};

// Figma "Activity Card" (linked-itinerary). The date block turns lime when
// Ari still owes her share — lime marks "needs your action".
export function ActivityCard({
  day,
  month,
  title,
  type,
  time,
  coming,
  share,
  paid,
  connector = false,
  onPay,
}: ActivityCardProps) {
  return (
    <article className="flex min-h-27 gap-2">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className={cn(
            "flex size-18 flex-col items-center justify-center rounded-sm p-2 text-center text-headline",
            paid ? "bg-gunmetal text-lime" : "bg-lime text-gunmetal",
          )}
        >
          <span>{day}</span>
          <span>{month}</span>
        </div>
        {connector && <span aria-hidden className="w-px flex-1 bg-violet" />}
      </div>
      <div className="flex flex-1 gap-3 rounded-sm bg-lilac p-3">
        <div className="flex flex-1 flex-col justify-center gap-0.5">
          <h3 className="text-headline text-gunmetal">{title}</h3>
          <p className="text-body-s text-ink-muted">{type}</p>
          <p className="text-body-s text-ink-muted">{time}</p>
          <p className="text-body-s text-ink-muted">{coming} coming</p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <p className="text-headline text-gunmetal">{formatPence(share)}</p>
          <PayState paid={paid} onPay={onPay} />
        </div>
      </div>
    </article>
  );
}
