import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { POLL_TRIPS, type Poll } from "@/data/seed";

type ClosedPollRowProps = {
  poll: Poll;
  // Cross-trip list: trip label and closed date (Working "Closed polls view").
  detailed?: boolean;
  href?: string;
  onOpen?: () => void;
};

// One closed poll in a list: "'Belcanto' won · in Itinerary" → its detail.
export function ClosedPollRow({
  poll,
  detailed,
  href,
  onOpen,
}: ClosedPollRowProps) {
  const content = (
    <>
      <span className="flex flex-1 flex-col gap-0.5">
        {detailed && (
          <span className="text-body-s text-ink-muted">
            {POLL_TRIPS[poll.tripId]?.label}
          </span>
        )}
        <span className="text-headline text-gunmetal">{poll.question}</span>
        <span className="text-body-s text-ink-muted">
          <span className="font-semibold text-gunmetal">‘{poll.winner}’</span>{" "}
          won
          {poll.addedTo && ` · in ${poll.addedTo}`}
        </span>
        {detailed && poll.closedOn && (
          <span className="text-body-s text-ink-muted">
            Poll closed on the{" "}
            <span className="font-semibold text-gunmetal">{poll.closedOn}</span>
          </span>
        )}
      </span>
      <Icon framed name="arrow-right" className="self-end text-gunmetal" />
    </>
  );
  // White rows sit inside a lilac group; on their own (detailed) they're lilac cards.
  const cls = `flex items-center gap-3 rounded-md p-4 text-left transition active:scale-press ${
    detailed ? "bg-lilac" : "bg-white"
  }`;
  return href ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onOpen} className={cls}>
      {content}
    </button>
  );
}
