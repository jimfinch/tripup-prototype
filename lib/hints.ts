import { useScenario } from "@/store/scenario";

// The guided layer: at each moment one element moves the story on, and it
// gets a soft pulsing ring. It never blocks other taps.

export type HintId =
  | "lisbon-card"
  | "invite"
  | "add-ren"
  | "ren-guest"
  | "invite-ren"
  | "close-sheet"
  | "new-poll"
  | "create-poll"
  | "notification"
  | "vote-belcanto"
  | "close-poll"
  | "belcanto-card"
  | "scan"
  | "exclude-nic"
  | "exclude-ren"
  | "leave-activity"
  | "settle"
  | "settle-confirm"
  | "back-to-trip";

type HintState = ReturnType<typeof useScenario.getState>;

export function currentHint(s: HintState): HintId | null {
  switch (s.step) {
    case 1:
      return "lisbon-card";
    case 2:
      return s.sheet?.kind === "invite" ? null : "invite";
    case 3:
      if (s.sheet?.kind !== "invite")
        return s.renInvite === "accepted" ? "new-poll" : "invite";
      if (s.renInvite === "none") return "add-ren";
      if (s.renInvite === "adding")
        return s.renGuest ? "invite-ren" : "ren-guest";
      if (s.renInvite === "accepted") return "close-sheet";
      return null;
    case 4:
      return s.sheet?.kind === "createPoll" ? "create-poll" : "new-poll";
    case 5:
      return "notification";
    case 6: {
      const dinner = s.polls.find((p) => p.id === "dinner");
      const allIn = s.liveVotes >= 6;
      if (s.sheet?.kind !== "vote" || !allIn) return null;
      return dinner?.ariVote ? "close-poll" : "vote-belcanto";
    }
    case 7:
      return "belcanto-card";
    case 8: {
      if (!s.belcanto.scanned) return "scan";
      const wine = s.belcanto.items.find((i) => i.id === "wine");
      if (!wine?.excluded.includes("nic")) return "exclude-nic";
      if (!wine?.excluded.includes("ren")) return "exclude-ren";
      return "leave-activity";
    }
    case 9:
      if (s.sheet?.kind !== "pay") return "settle";
      // The settle sheet rings Settle, or Pay with if no method is picked.
      return s.sheet.scope.kind === "settle" ? "settle-confirm" : null;
    case 10:
      return "back-to-trip";
  }
}

// True when tap hints are on and `id` is the next thing to tap.
export function useHintActive(id: HintId) {
  return useScenario((s) => s.guides && currentHint(s) === id);
}

// Ring class for buttons and other compact targets.
export function useHint(id: HintId) {
  return useHintActive(id) ? "hint-ring" : "";
}
