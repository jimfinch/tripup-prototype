import Image from "next/image";
import Link from "next/link";
import { TripStat, pluralise } from "@/components/trip/TripStat";
import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PEOPLE, type PersonId, type Poll } from "@/data/seed";

type CurrentTripCardProps = {
  href: string;
  name: string;
  dates: string;
  image: string;
  organiser: PersonId;
  avatars: PersonId[];
  overflow: number;
  livePolls: number;
  paymentsDue: number;
  // The poll that needs Ari's vote, if any.
  poll?: Poll;
  pollsHref: string;
  onVote?: () => void;
};

// Hi-fi Home "Trip Card" (type=current, state=poll-visible).
export function CurrentTripCard(props: CurrentTripCardProps) {
  const { poll } = props;
  const voted = poll ? poll.options.reduce((n, o) => n + o.votes, 0) : 0;

  return (
    <article className="flex flex-col gap-5 rounded-md bg-gunmetal p-4">
      <Link
        href={props.href}
        className="flex flex-col gap-5 rounded-sm transition-opacity active:opacity-80"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-title-l text-white">{props.name}</h2>
            <p className="text-headline text-white/60">{props.dates}</p>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-3">
              <AvatarStack
                ids={props.avatars}
                overflow={props.overflow}
                tone="dark"
              />
              <p className="text-body-s text-white/60">
                Organised by{" "}
                <span className="text-white">
                  {PEOPLE[props.organiser].firstName}
                </span>
              </p>
            </div>
            <div className="flex flex-1 flex-col items-end justify-end gap-2.5">
              <TripStat
                label={pluralise(props.livePolls, "live poll", "live polls")}
                icon="poll"
              />
              <TripStat
                label={pluralise(
                  props.paymentsDue,
                  "payment due",
                  "payments due",
                )}
                icon="card"
              />
            </div>
          </div>
        </div>
        <div className="relative h-65 overflow-hidden rounded-sm">
          <Image
            src={props.image}
            alt=""
            fill
            priority
            sizes="366px"
            className="object-cover"
            style={{ objectPosition: "50% 70.6%" }}
          />
        </div>
      </Link>

      {poll && (
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="flex flex-col gap-0.5">
              <span className="h-0.75 w-2 rounded-xs bg-white/50" />
              <span className="h-0.75 w-4 rounded-xs bg-white/50" />
              <span className="h-0.75 w-2.75 rounded-xs bg-white/50" />
            </span>
            <h3 className="text-headline text-white">Needs your vote</h3>
          </div>
          <div className="flex flex-col gap-1 rounded-sm bg-white/10 p-3">
            <p className="text-headline text-lime">{poll.question}</p>
            <p className="text-body-s text-white/60">
              {poll.closesInMinutes === null
                ? "Poll doesn’t expire"
                : `Closes in ${poll.closesInMinutes} min`}
            </p>
            <p className="text-body-s text-white/60">
              {voted} of {poll.sentTo} voted - you haven’t voted
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              theme="dark"
              href={props.pollsHref}
              className="flex-1"
              rightIcon={<Icon framed name="arrow-right" size={20} />}
            >
              All polls
            </Button>
            <Button
              theme="primary"
              onClick={props.onVote}
              className="flex-1"
              rightIcon={<Icon framed name="poll" size={20} />}
            >
              Vote
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
