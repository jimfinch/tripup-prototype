"use client";

import { useEffect, useState } from "react";
import { PollOptionRow } from "@/components/poll/PollOptionRow";
import { AvatarStack } from "@/components/ui/Avatar";
import { Sheet } from "@/components/ui/Sheet";
import { LIVE_VOTES } from "@/data/seed";
import { useHint } from "@/lib/hints";
import {
  formatCloses,
  leadingOption,
  totalVotes,
  useScenario,
} from "@/store/scenario";

const VOTE_INTERVAL_MS = 600;
// Let the "Back on Ari's phone" scene card clear first.
const FIRST_VOTE_DELAY_MS = 1400;

// Vote now sheet (wireflow 06). On step 06 the other votes animate in live and
// the lead changes hands; Ari's vote is the last, which closes the poll.
export function VoteSheet({ pollId, open }: { pollId: string; open: boolean }) {
  const s = useScenario();
  const poll = s.polls.find((p) => p.id === pollId);
  const hintBelcanto = useHint("vote-belcanto");
  const [showVoters, setShowVoters] = useState(false);

  const live =
    s.step === 6 && pollId === "dinner" && s.liveVotes < LIVE_VOTES.length;
  const { addLiveVote, liveVotes } = s;
  useEffect(() => {
    if (!open || !live) return;
    const t = setTimeout(
      addLiveVote,
      liveVotes === 0 ? FIRST_VOTE_DELAY_MS : VOTE_INTERVAL_MS,
    );
    return () => clearTimeout(t);
  }, [open, live, liveVotes, addLiveVote]);

  if (!poll) return null;
  const total = totalVotes(poll);
  const leader = total > 0 ? leadingOption(poll) : null;
  const leaderIsUnique =
    leader && poll.options.filter((o) => o.votes === leader.votes).length === 1;
  // The creator (Ari, for the dinner poll) or the trip organiser can close it.
  const canClose = pollId === "dinner" && poll.status === "live";

  return (
    <Sheet open={open} onClose={s.closeSheet} title="Vote now">
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-title-m text-gunmetal">{poll.question}</p>
          <p className="text-body-s text-ink-muted">
            {formatCloses(poll)} - {total} of {poll.sentTo} voted
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {poll.options.map((o) => (
            <div key={o.id} className="flex flex-col gap-2">
              <PollOptionRow
                label={o.label}
                votes={o.votes}
                totalVotes={total}
                leading={!!leaderIsUnique && leader?.id === o.id}
                selected={poll.ariVote === o.id}
                disabled={!!poll.ariVote || poll.status === "closed"}
                onSelect={() => s.vote(poll.id, o.id)}
                className={o.label === "Belcanto" ? hintBelcanto : undefined}
              />
              {showVoters && o.voters.length > 0 && (
                <AvatarStack ids={o.voters} className="pl-2" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {canClose ? (
            <button
              type="button"
              onClick={() => s.closePoll(poll.id)}
              className="tap-target text-label text-gunmetal transition-opacity active:opacity-60"
            >
              Close poll
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-expanded={showVoters}
            onClick={() => setShowVoters((v) => !v)}
            className="tap-target text-label text-gunmetal transition-opacity active:opacity-60"
          >
            {showVoters ? "Hide votes" : "View votes"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
