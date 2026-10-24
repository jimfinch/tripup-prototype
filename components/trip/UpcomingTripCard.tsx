import Image from "next/image";
import Link from "next/link";
import { AvatarStack } from "@/components/ui/Avatar";
import { PEOPLE, type UpcomingTrip } from "@/data/seed";

// Hi-fi Home "Trip Card" (type=upcoming).
export function UpcomingTripCard({ trip }: { trip: UpcomingTrip }) {
  const organiser =
    trip.organiser === "ari" ? "You" : PEOPLE[trip.organiser].firstName;
  return (
    <Link
      href={`/trips/${trip.id}/`}
      className="flex items-center gap-3 rounded-md bg-lilac p-4 transition-opacity active:opacity-80"
    >
      <span className="relative size-29 shrink-0 overflow-hidden rounded-sm">
        <Image
          src={trip.image}
          alt=""
          fill
          sizes="116px"
          className="object-cover"
        />
      </span>
      <span className="flex flex-1 flex-col justify-center gap-0.5">
        <span className="text-title-m text-gunmetal">{trip.name}</span>
        <span className="text-headline text-ink-muted">{trip.dates}</span>
        <AvatarStack
          ids={trip.avatars}
          overflow={trip.overflow}
          className="py-1"
        />
        <span className="text-body-s text-ink-muted">
          Organised by{" "}
          <span className="font-semibold text-gunmetal">{organiser}</span>
        </span>
      </span>
    </Link>
  );
}
