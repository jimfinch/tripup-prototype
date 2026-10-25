"use client";

import { useState } from "react";
import { PollOptionRow } from "@/components/poll/PollOptionRow";
import { AvatarStack } from "@/components/ui/Avatar";
import { POLL_TRIPS, type Poll } from "@/data/seed";
import { cn } from "@/lib/cn";
import {
  formatCloses,
  leadingOption,
  totalVotes,
  useScenario,
} from "@/store/scenario";

type PollCardProps = {
  poll: Poll;
  // "Lisbon trip, 17-24 Oct 2026" on the cross-trip All polls page.
  showTrip?: boolean;
  // Larger question, as on the All polls page.
  large?: boolean;
  // Card chrome; the vote sheet renders the poll without it.
  bare?: boolean;
  optionClassName?: (label: string) => string | undefined;
};

// The one poll component (CLAUDE.md §8): vote, live results, View votes and
// Close poll behave the same on the trip view, polls pages and the vote sheet.
export function PollCard({
  poll,
  showTrip,
  large,
  bare,
  optionClassName,
}: PollCardProps) {
  const vote = useScenario((s) => s.vote);
  const closePoll = useScenario((s) => s.closePoll);
  const notInPrototype = useScenario((s) => s.notInPrototype);
  const [showVoters, setShowVoters] = useState(false);

  const total = totalVotes(poll);
  const closed = poll.status === "closed";
  const leader = total > 0 ? leadingOption(poll) : null;
  const uniqueLeader =
    leader && poll.options.filter((o) => o.votes === leader.votes).length === 1;
  // The poll's creator (or the trip organiser) can close it; Ari created the dinner poll.
  const canClose = !closed && poll.creator === "ari";
  const everyone = total >= poll.sentTo;

  return (
    <article
      className={cn("flex flex-col gap-4", !bare && "rounded-md bg-lilac p-4")}
    >
      <header className="flex flex-col gap-1">
        {showTrip && (
          <p className="text-body-s text-ink-muted">
            {POLL_TRIPS[poll.tripId]?.label}
          </p>
        )}
        <h3
          className={cn(
            "text-gunmetal",
            large || bare ? "text-title-m" : "text-title-s",
          )}
        >
          {poll.question}
        </h3>
        <p className="text-body-s text-ink-muted">
          {closed ? (
            <>
              Closed{everyone && " - everyone voted"}
              {poll.multipleChoice ? " - multiple choice" : " - "}
              {poll.multipleChoice && <br />}
              <span className="font-semibold text-gunmetal">
                {poll.winner} won
              </span>
            </>
          ) : (
            `${formatCloses(poll)} - ${total} of ${poll.sentTo} voted`
          )}
        </p>
      </header>

      {poll.options.length > 0 && (
        <div className="flex flex-col gap-2">
          {poll.options.map((o) => {
            const isWinner = closed && o.label === poll.winner;
            return (
              <div key={o.id} className="flex flex-col gap-2">
                <PollOptionRow
                  label={o.label}
                  votes={o.votes}
                  totalVotes={total}
                  leading={
                    closed ? isWinner : !!uniqueLeader && leader?.id === o.id
                  }
                  selected={closed ? isWinner : poll.ariVote === o.id}
                  dimmed={closed && !isWinner}
                  disabled={closed || !!poll.ariVote}
                  onSelect={() => vote(poll.id, o.id)}
                  className={optionClassName?.(o.label)}
                />
                {showVoters && o.voters.length > 0 && (
                  <AvatarStack ids={o.voters} className="pl-2" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <footer className="flex justify-between">
        {canClose ? (
          <button
            type="button"
            onClick={() => closePoll(poll.id)}
            className={LINK}
          >
            Close poll
          </button>
        ) : closed ? (
          <button type="button" onClick={notInPrototype} className={LINK}>
            Archive poll
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          aria-expanded={showVoters}
          onClick={() => setShowVoters((v) => !v)}
          className={LINK}
        >
          {showVoters ? "Hide votes" : "View votes"}
        </button>
      </footer>
    </article>
  );
}

const LINK =
  "tap-target text-label text-gunmetal transition-opacity active:opacity-60";
