"use client";

import { useEffect } from "react";
import { PollCard } from "@/components/poll/PollCard";
import { Sheet } from "@/components/ui/Sheet";
import { LIVE_VOTES } from "@/data/seed";
import { useHint } from "@/lib/hints";
import { useScenario } from "@/store/scenario";

const VOTE_INTERVAL_MS = 600;
// Let the "Back on Ari's phone" scene card clear first.
const FIRST_VOTE_DELAY_MS = 1400;

// Vote now sheet (wireflow 06), built on the shared PollCard. On step 06 the
// other votes animate in live and the lead changes hands; Ari's vote is the
// last, which closes the poll.
export function VoteSheet({ pollId, open }: { pollId: string; open: boolean }) {
  const poll = useScenario((s) => s.polls.find((p) => p.id === pollId));
  const step = useScenario((s) => s.step);
  const liveVotes = useScenario((s) => s.liveVotes);
  const addLiveVote = useScenario((s) => s.addLiveVote);
  const closeSheet = useScenario((s) => s.closeSheet);
  const hintBelcanto = useHint("vote-belcanto");

  const live =
    step === 6 && pollId === "dinner" && liveVotes < LIVE_VOTES.length;
  useEffect(() => {
    if (!open || !live) return;
    const t = setTimeout(
      addLiveVote,
      liveVotes === 0 ? FIRST_VOTE_DELAY_MS : VOTE_INTERVAL_MS,
    );
    return () => clearTimeout(t);
  }, [open, live, liveVotes, addLiveVote]);

  return (
    <Sheet open={open && !!poll} onClose={closeSheet} title="Vote now">
      {poll && (
        <div className="pt-4">
          <PollCard
            poll={poll}
            bare
            optionClassName={(label) =>
              label === "Belcanto" ? hintBelcanto : undefined
            }
          />
        </div>
      )}
    </Sheet>
  );
}
