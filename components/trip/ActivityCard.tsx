import { PayState } from "@/components/pay/PayState";
import { NewBadge } from "@/components/ui/Badge";
import { TODAY } from "@/data/seed";
import { HintBeacon } from "@/components/ui/HintBeacon";
import { Icon } from "@/components/ui/Icon";
import { formatPence, type Pence } from "@/lib/money";
import { cn } from "@/lib/cn";

export type ActivityCardProps = {
  id?: string;
  day: number;
  month: string;
  title: string;
  type: string;
  time: string;
  coming: number;
  // Ari's share.
  share: Pence;
  paid: boolean;
  // Added by a poll and still waiting for its details (wireflow 07).
  shell?: boolean;
  isNew?: boolean;
  // Vertical timeline line under the date (all but the last card).
  connector?: boolean;
  onPay?: () => void;
  // Opens the activity; the whole card becomes the tap target.
  onOpen?: () => void;
  // Tap hint: a beacon on the card (a ring would cut the card up).
  beacon?: boolean;
  className?: string;
};

// Figma "Activity Card" (linked-itinerary): 112 px, sized by its content; the
// itinerary list spaces cards 8 px apart. The date block is lime for
// activities happening today (both 24 Oct cards in the scenario); payment
// state is shown by the Pay share / Paid button.
export function ActivityCard({
  id,
  day,
  month,
  title,
  type,
  time,
  coming,
  share,
  paid,
  shell = false,
  isNew = false,
  connector = false,
  onPay,
  onOpen,
  beacon = false,
  className,
}: ActivityCardProps) {
  const today = day === TODAY.day && month === TODAY.month;
  return (
    <article
      id={id ? `activity-${id}` : undefined}
      className="flex scroll-mt-24 items-start gap-2"
    >
      <div className="flex shrink-0 flex-col items-center gap-2 self-stretch">
        <div
          className={cn(
            "relative flex size-18 flex-col items-center justify-center rounded-sm p-2 text-center text-headline",
            today ? "bg-lime text-gunmetal" : "bg-gunmetal text-lime",
          )}
        >
          {isNew && <NewBadge className="absolute -left-1.5 -top-2.5" />}
          <span>{day}</span>
          <span>{month}</span>
        </div>
        {connector && <span aria-hidden className="w-px flex-1 bg-violet" />}
      </div>
      <div
        className={cn(
          "relative flex flex-1 items-start gap-3 rounded-sm bg-lilac p-3 transition",
          onOpen && "active:scale-press",
          className,
        )}
      >
        {beacon && <HintBeacon className="right-4 top-4" />}
        <div className="flex flex-1 flex-col gap-0.5">
          <h3 className="text-headline text-gunmetal">
            {onOpen ? (
              <button
                type="button"
                onClick={onOpen}
                className="text-left after:absolute after:inset-0 after:rounded-sm"
              >
                {title}
              </button>
            ) : (
              title
            )}
          </h3>
          {!shell && <p className="text-body-s text-ink-muted">{type}</p>}
          <p className="text-body-s text-ink-muted">{time}</p>
          <p className="text-body-s text-ink-muted">{coming} coming</p>
          {shell && (
            <p className="flex items-center gap-1.5 text-body-s text-ink-muted">
              <Icon framed name="pencil" size={20} />
              Add activity details
            </p>
          )}
        </div>
        {!shell && (
          <div className="relative z-10 flex flex-col items-end justify-between self-stretch">
            <p className="text-headline text-gunmetal">{formatPence(share)}</p>
            <PayState paid={paid} onPay={onPay} />
          </div>
        )}
      </div>
    </article>
  );
}
