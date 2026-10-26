import { TripStat, pluralise } from "@/components/trip/TripStat";
import { CountBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PEOPLE, type PersonId } from "@/data/seed";
import { formatPence } from "@/lib/money";

type TripHeaderCardProps = {
  name: string;
  dates: string;
  organiser: PersonId;
  paymentsDue: number;
  counts: { polls: number; itinerary: number; stays: number };
  settleTotal: number;
  settled?: boolean;
  onSettle?: () => void;
  onPolls?: () => void;
  settleClassName?: string;
};

// Hi-fi Trip view "Trip Card" (type=trip-header).
export function TripHeaderCard(props: TripHeaderCardProps) {
  const links = [
    { label: "Polls", count: props.counts.polls, href: undefined },
    { label: "Itinerary", count: props.counts.itinerary, href: "#itinerary" },
    { label: "Stays", count: props.counts.stays, href: "#stays" },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-md bg-gunmetal p-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-title-l text-white">{props.name}</h1>
          <p className="text-headline text-white/60">{props.dates}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-s text-white/60">
            Organised by{" "}
            <span className="text-white">
              {PEOPLE[props.organiser].firstName}
            </span>
          </p>
          {/* Hidden once everything's paid rather than "0 payments due". */}
          {props.paymentsDue > 0 && (
            <TripStat
              label={pluralise(
                props.paymentsDue,
                "payment due",
                "payments due",
              )}
              icon="card"
            />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {links.map((l) =>
          l.href ? (
            <Button
              key={l.label}
              theme="dark"
              href={l.href}
              className="flex-1"
              rightIcon={<CountBadge value={l.count} />}
            >
              {l.label}
            </Button>
          ) : (
            <Button
              key={l.label}
              theme="dark"
              onClick={props.onPolls}
              className="flex-1"
              rightIcon={<CountBadge value={l.count} />}
            >
              {l.label}
            </Button>
          ),
        )}
      </div>
      {props.settled ? (
        // Everything is paid: the Settle button becomes a settled state.
        <p className="flex h-16 items-center gap-4 rounded-pill bg-white py-1.5 pl-6 pr-1.5 text-title-s text-gunmetal">
          <span className="flex-1">All squared up</span>
          <span className="flex h-full w-13 items-center justify-center rounded-pill bg-gunmetal text-lime">
            <Icon name="check" width={18} />
          </span>
        </p>
      ) : (
        <Button
          theme="primary"
          size="xl"
          onClick={props.onSettle}
          className={props.settleClassName}
        >
          Settle trip {formatPence(props.settleTotal)}
        </Button>
      )}
    </section>
  );
}
