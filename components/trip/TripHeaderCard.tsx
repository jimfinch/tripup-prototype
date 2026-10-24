import { TripStat, pluralise } from "@/components/trip/TripStat";
import { CountBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PEOPLE, type PersonId } from "@/data/seed";
import { formatPence } from "@/lib/money";

type TripHeaderCardProps = {
  name: string;
  dates: string;
  organiser: PersonId;
  paymentsDue: number;
  counts: { polls: number; itinerary: number; stays: number };
  settleTotal: number;
  onSettle?: () => void;
};

// Hi-fi Trip view "Trip Card" (type=trip-header).
export function TripHeaderCard(props: TripHeaderCardProps) {
  const links = [
    { label: "Polls", count: props.counts.polls, href: "#polls" },
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
          <TripStat
            label={pluralise(props.paymentsDue, "payment due", "payments due")}
            icon="card"
          />
        </div>
      </div>
      <div className="flex gap-2">
        {links.map((l) => (
          <Button
            key={l.label}
            theme="dark"
            href={l.href}
            className="flex-1"
            rightIcon={<CountBadge value={l.count} />}
          >
            {l.label}
          </Button>
        ))}
      </div>
      <Button theme="primary" size="xl" onClick={props.onSettle}>
        Settle trip {formatPence(props.settleTotal)}
      </Button>
    </section>
  );
}
