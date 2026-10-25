"use client";

import { ClosedPollRow } from "@/components/poll/ClosedPollRow";
import { PollCard } from "@/components/poll/PollCard";
import { PollsHeading } from "@/components/poll/PollsHeading";
import { useNewPoll } from "@/components/poll/usePollActions";
import { Screen } from "@/components/shell/Screen";
import { BackButton as BackLink } from "@/components/ui/BackButton";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useScenario } from "@/store/scenario";

// Polls tab: live polls across trips, each labelled with its trip (Working
// "Polls view"), then View closed polls.
export function AllPollsView() {
  const polls = useScenario((s) => s.polls);
  const newPoll = useNewPoll();
  const live = polls.filter((p) => p.status === "live");

  return (
    <Screen tabBar bottomGlow className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <h1 className="pt-4 text-center text-title-m text-gunmetal">
          All polls
        </h1>
        <Button
          theme="light"
          size="xl"
          onClick={newPoll}
          rightIcon={<Icon name="plus" />}
        >
          New poll
        </Button>
        <section className="flex flex-col gap-3">
          <PollsHeading title="Live polls" />
          {live.length > 0 ? (
            live.map((p) => <PollCard key={p.id} poll={p} showTrip large />)
          ) : (
            <p className="rounded-md bg-lilac p-4 text-body-s text-ink-muted">
              No live polls right now.
            </p>
          )}
        </section>
        <div className="flex justify-end">
          <Button
            theme="secondary"
            href="/polls/closed/"
            rightIcon={<Icon framed name="arrow-right" size={20} />}
          >
            View closed polls
          </Button>
        </div>
      </div>
    </Screen>
  );
}

// "22 Oct 2026" → sortable timestamp (newest closed polls first).
const closedTime = (d?: string) => (d ? Date.parse(d) : 0);

// Cross-trip closed polls (Working "Closed polls view"), with Archive.
export function AllClosedPollsView() {
  const polls = useScenario((s) => s.polls);
  const notInPrototype = useScenario((s) => s.notInPrototype);
  const closed = polls
    .filter((p) => p.status === "closed")
    .sort((a, b) => closedTime(b.closedOn) - closedTime(a.closedOn));

  return (
    <Screen tabBar bottomGlow className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <ClosedHeader
          title="Closed polls"
          backHref="/polls/"
          onMenu={notInPrototype}
        />
        <section className="flex flex-col gap-3">
          <PollsHeading title="Closed polls" />
          {closed.map((p) =>
            p.tripId === "lisbon" ? (
              <ClosedPollRow
                key={p.id}
                poll={p}
                detailed
                href="/trips/lisbon/polls/closed/"
              />
            ) : (
              <ClosedPollRow
                key={p.id}
                poll={p}
                detailed
                onOpen={notInPrototype}
              />
            ),
          )}
        </section>
        <div className="flex justify-end">
          <Button
            theme="secondary"
            onClick={notInPrototype}
            rightIcon={<Icon framed name="arrow-right" size={20} />}
          >
            Archive
          </Button>
        </div>
      </div>
    </Screen>
  );
}

function ClosedHeader({
  title,
  backHref,
  onMenu,
}: {
  title: string;
  backHref: string;
  onMenu: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <BackLink href={backHref} />
      <h1 className="text-title-m text-gunmetal">{title}</h1>
      <button
        type="button"
        onClick={onMenu}
        aria-label="Poll options"
        className="tap-target flex size-10 items-center justify-center rounded-pill text-gunmetal transition active:scale-press"
      >
        <Icon framed name="kebab" />
      </button>
    </div>
  );
}
