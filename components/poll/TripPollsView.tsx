"use client";

import { ClosedPollRow } from "@/components/poll/ClosedPollRow";
import { PollCard } from "@/components/poll/PollCard";
import { PollsHeading } from "@/components/poll/PollsHeading";
import { useNewPoll } from "@/components/poll/usePollActions";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LISBON, TODAY } from "@/data/seed";
import { useScenario } from "@/store/scenario";

const closedToday = (closedOn?: string) =>
  closedOn === `${TODAY.day} ${TODAY.month} 2026`;

function TripTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-title-l text-gunmetal">{title}</h1>
      <p className="text-body-s text-ink-muted">
        {LISBON.name}, {LISBON.dates}
      </p>
    </div>
  );
}

// The Lisbon trip's polls (Working "Trips polls view"): live polls, including
// one that has just closed showing its winner, then links to closed polls.
export function TripPollsView() {
  const polls = useScenario((s) => s.polls).filter(
    (p) => p.tripId === LISBON.id,
  );
  const newPoll = useNewPoll();
  const live = polls.filter(
    (p) => p.status === "live" || closedToday(p.closedOn),
  );
  const closed = polls.filter(
    (p) => p.status === "closed" && !closedToday(p.closedOn),
  );

  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="pt-2">
          <BackButton href={`/trips/${LISBON.id}/`} />
        </div>
        <TripTitle title="Trip polls" />
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
          {live.map((p) => (
            <PollCard key={p.id} poll={p} />
          ))}
        </section>
        {closed.length > 0 && (
          <section className="flex flex-col gap-3 rounded-md bg-lilac p-4">
            <h2 className="text-title-m text-gunmetal">Closed polls</h2>
            {closed.map((p) => (
              <ClosedPollRow
                key={p.id}
                poll={p}
                href={`/trips/${LISBON.id}/polls/closed/`}
              />
            ))}
          </section>
        )}
      </div>
    </Screen>
  );
}

// The Lisbon trip's closed polls (Working "Trips closed polls").
export function TripClosedPollsView() {
  const polls = useScenario((s) => s.polls).filter(
    (p) => p.tripId === LISBON.id && p.status === "closed",
  );
  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="pt-2">
          <BackButton href={`/trips/${LISBON.id}/polls/`} />
        </div>
        <TripTitle title="Closed polls" />
        {polls.map((p) => (
          <PollCard key={p.id} poll={p} />
        ))}
      </div>
    </Screen>
  );
}
