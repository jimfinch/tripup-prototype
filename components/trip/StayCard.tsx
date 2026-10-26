import { PayState } from "@/components/pay/PayState";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatPence, type Pence } from "@/lib/money";

export type StayCardProps = {
  from: string;
  to: string;
  nights: number;
  name: string;
  beds: number;
  checkIn: string;
  coming: number;
  share: Pence;
  paid: boolean;
  onPay?: () => void;
};

// Figma "Stay Card": lime while Ari's share is unpaid, lilac once paid.
export function StayCard({
  from,
  to,
  nights,
  name,
  beds,
  checkIn,
  coming,
  share,
  paid,
  onPay,
}: StayCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-md text-gunmetal transition-colors duration-300",
        paid ? "bg-lilac" : "bg-lime",
      )}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-gunmetal/10 px-4 py-2 text-headline">
            {from}
          </span>
          <Icon framed name="arrow-right" size={20} />
          <span className="rounded-sm bg-gunmetal/10 px-4 py-2 text-headline">
            {to}
          </span>
        </div>
        <p className="text-body-s text-ink-muted">{nights} nights</p>
      </div>
      <div aria-hidden className="mx-3 h-px bg-gunmetal/15" />
      <div className="flex justify-between p-3">
        <div className="flex flex-col justify-center gap-0.5">
          <h3 className="text-headline">{name}</h3>
          <p className="text-body-s text-ink-muted">{beds} Beds</p>
          <p className="text-body-s text-ink-muted">Check in {checkIn}</p>
          <p className="text-body-s text-ink-muted">{coming} coming</p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <p className="text-headline">{formatPence(share)}</p>
          <PayState paid={paid} onPay={onPay} />
        </div>
      </div>
    </article>
  );
}
