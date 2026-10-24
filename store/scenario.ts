import { create } from "zustand";
import {
  ACTIVITIES,
  BELCANTO,
  BELCANTO_ATTENDEES,
  BELCANTO_ITEMS,
  BELCANTO_STATUS,
  DINNER_POLL_DRAFT,
  FADO_POLL,
  LISBON_MEMBERS,
  LIVE_VOTES,
  STAY,
  type Activity,
  type BillItem,
  type CloseIn,
  type PersonId,
  type Poll,
  type Stay,
  type TripMember,
} from "@/data/seed";
import { getStep, PHONE_LABEL, type StepId } from "@/data/steps";
import { billShares } from "@/lib/bill";

// One in-memory store for the whole scenario (CLAUDE.md §6–7). A reload resets
// the demo. Every step can be rebuilt from scratch with `stateAtStep`, so the
// demo panel can jump anywhere and land in the right state.

type Toast = { id: number; message: string };

export type PayScope =
  | { kind: "settle" }
  | { kind: "activities" }
  | { kind: "stay" }
  | { kind: "activity"; id: string };

export type Sheet =
  | { kind: "invite" }
  | { kind: "createPoll" }
  | { kind: "vote"; pollId: string }
  | { kind: "pay"; scope: PayScope };

export type RenInvite = "none" | "adding" | "invited" | "accepted";

export type PollDraft = {
  question: string;
  options: string[];
  sendToGuests: boolean;
  closeAutomatically: boolean;
  closeIn: CloseIn;
  multipleAnswers: boolean;
};

export type Belcanto = {
  added: boolean;
  isNew: boolean;
  scanned: boolean;
  logged: boolean;
  items: BillItem[];
};

type Data = {
  step: StepId;
  members: TripMember[];
  renInvite: RenInvite;
  renGuest: boolean;
  polls: Poll[];
  liveVotes: number;
  activities: Activity[];
  stay: Stay;
  belcanto: Belcanto;
  settled: boolean;
  lastPayment: number | null;
  sheet: Sheet | null;
  focus: string | null;
};

type UI = {
  splash: boolean;
  sceneCard: string | null;
  toast: Toast | null;
};

type Actions = {
  goToStep: (step: StepId) => void;
  reset: () => void;
  dismissSplash: () => void;
  dismissSceneCard: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
  clearFocus: () => void;

  openTrip: () => void;
  openSheet: (sheet: Sheet) => void;
  closeSheet: () => void;

  inviteContact: (id: PersonId) => void;
  notInPrototype: () => void;
  startRenInvite: () => void;
  setRenGuest: (guest: boolean) => void;
  inviteRen: () => void;

  createPoll: (draft: PollDraft) => void;
  openNotification: () => void;
  addLiveVote: () => void;
  vote: (pollId: string, optionId: string) => void;
  closePoll: (pollId: string) => void;

  openBelcanto: () => void;
  scanReceipt: () => void;
  toggleExclude: (itemId: string, person: PersonId) => void;
  updateActivity: () => void;

  pay: (scope: PayScope) => void;
};

type State = Data & UI & Actions;

// ---------------------------------------------------------------------------
// Pure state builders

const INITIAL: Data = {
  step: 1,
  members: LISBON_MEMBERS,
  renInvite: "none",
  renGuest: false,
  polls: [FADO_POLL],
  liveVotes: 0,
  activities: ACTIVITIES,
  stay: STAY,
  belcanto: {
    added: false,
    isNew: false,
    scanned: false,
    logged: false,
    items: [],
  },
  settled: false,
  lastPayment: null,
  sheet: null,
  focus: null,
};

const withRen = (
  d: Data,
  status: TripMember["status"],
  guest: boolean,
): Data => ({
  ...d,
  members: [
    ...d.members.filter((m) => m.id !== "ren"),
    { id: "ren", status, guest },
  ],
  renGuest: guest,
});

const makeDinnerPoll = (d: Data, draft: PollDraft): Poll => ({
  id: "dinner",
  tripId: "lisbon",
  question: draft.question,
  options: draft.options.map((label, i) => ({
    id: `o${i}`,
    label,
    votes: 0,
    voters: [],
  })),
  // Sent to everyone coming (guests only if the toggle is on), Ari included.
  sentTo: d.members.filter(
    (m) => m.status === "yes" && (draft.sendToGuests || !m.guest),
  ).length,
  closesInMinutes: 120,
  ariVote: null,
  status: "live",
});

const applyLiveVote = (d: Data): Data => {
  const next = LIVE_VOTES[d.liveVotes];
  if (!next) return d;
  return {
    ...d,
    liveVotes: d.liveVotes + 1,
    polls: d.polls.map((p) =>
      p.id !== "dinner"
        ? p
        : {
            ...p,
            closesInMinutes: 38,
            options: p.options.map((o, i) =>
              i === next.option
                ? {
                    ...o,
                    votes: o.votes + 1,
                    voters: [...o.voters, next.voter],
                  }
                : o,
            ),
          },
    ),
  };
};

const applyVote = (d: Data, pollId: string, optionId: string): Data => ({
  ...d,
  polls: d.polls.map((p) =>
    p.id !== pollId || p.ariVote
      ? p
      : {
          ...p,
          ariVote: optionId,
          options: p.options.map((o) =>
            o.id === optionId
              ? {
                  ...o,
                  votes: o.votes + 1,
                  voters: [...o.voters, "ari" as PersonId],
                }
              : o,
          ),
        },
  ),
});

export const totalVotes = (p: Poll) =>
  p.options.reduce((n, o) => n + o.votes, 0);

export const formatCloses = (p: Poll) => {
  if (p.status === "closed") return "Closed";
  if (p.closesInMinutes === null) return "Poll doesn’t expire";
  const m = p.closesInMinutes;
  if (m >= 60 && m % 60 === 0)
    return `Closes in ${m / 60} ${m === 60 ? "hr" : "hrs"}`;
  return `Closes in ${m} min`;
};

export const leadingOption = (p: Poll) =>
  p.options.reduce(
    (best, o) => (o.votes > best.votes ? o : best),
    p.options[0],
  );

const applyClosePoll = (d: Data, pollId: string): Data => {
  const poll = d.polls.find((p) => p.id === pollId);
  if (!poll || poll.status === "closed") return d;
  const winner = leadingOption(poll);
  let next: Data = {
    ...d,
    sheet: null,
    polls: d.polls.map((p) =>
      p.id === pollId ? { ...p, status: "closed", winner: winner.label } : p,
    ),
  };
  // The dinner poll adds its winner to the itinerary as an activity shell.
  if (pollId === "dinner" && winner.label === BELCANTO.title) {
    next = {
      ...next,
      focus: "belcanto",
      belcanto: { ...next.belcanto, added: true, isNew: true },
      activities: [
        ...next.activities,
        {
          id: BELCANTO.id,
          day: BELCANTO.day,
          month: BELCANTO.month,
          title: BELCANTO.title,
          type: BELCANTO.type,
          time: BELCANTO.time,
          coming: totalVotes(poll),
          share: 0,
          paid: false,
          shell: true,
        },
      ],
    };
  }
  return next;
};

const applyScan = (d: Data): Data => ({
  ...d,
  belcanto: { ...d.belcanto, scanned: true, items: BELCANTO_ITEMS },
});

const applyExclude = (d: Data, itemId: string, person: PersonId): Data => ({
  ...d,
  belcanto: {
    ...d.belcanto,
    items: d.belcanto.items.map((it) =>
      it.id !== itemId
        ? it
        : {
            ...it,
            excluded: it.excluded.includes(person)
              ? it.excluded.filter((p) => p !== person)
              : [...it.excluded, person],
          },
    ),
  },
});

const applyUpdateActivity = (d: Data): Data => {
  const ariShare =
    billShares(d.belcanto.items, BELCANTO_ATTENDEES).get("ari") ?? 0;
  return {
    ...d,
    sheet: null,
    belcanto: {
      ...d.belcanto,
      isNew: false,
      logged: d.belcanto.items.length > 0,
    },
    activities: d.activities.map((a) =>
      a.id === BELCANTO.id
        ? {
            ...a,
            shell: false,
            share: ariShare,
            // Ari paid the bill on the night, so her own share is settled.
            paid: ariShare > 0,
            coming: BELCANTO_ATTENDEES.length,
          }
        : a,
    ),
  };
};

const covers = (scope: PayScope, a: Activity) =>
  scope.kind === "settle" ||
  scope.kind === "activities" ||
  (scope.kind === "activity" && scope.id === a.id);

const applyPay = (d: Data, scope: PayScope, amount: number): Data => ({
  ...d,
  sheet: null,
  lastPayment: amount,
  settled: scope.kind === "settle" ? true : d.settled,
  activities: d.activities.map((a) =>
    !a.paid && !a.shell && covers(scope, a) ? { ...a, paid: true } : a,
  ),
  stay:
    scope.kind === "settle" || scope.kind === "stay"
      ? { ...d.stay, paid: true }
      : d.stay,
});

const FINAL_BELCANTO_EXCLUSIONS: [string, PersonId][] = [
  ["wine", "nic"],
  ["wine", "ren"],
];

// Rebuilds the scenario as it stands at the start of a step.
export function stateAtStep(step: StepId): Data {
  let d: Data = { ...INITIAL, step };
  if (step === 1 || step === 2) return d;
  if (step === 3) return { ...d, sheet: { kind: "invite" } };

  d = { ...withRen(d, "yes", true), renInvite: "accepted" };
  if (step === 4) return { ...d, sheet: { kind: "createPoll" } };

  d = { ...d, polls: [...d.polls, makeDinnerPoll(d, DINNER_POLL_DRAFT)] };
  if (step === 5) return d;
  if (step === 6) return { ...d, sheet: { kind: "vote", pollId: "dinner" } };

  for (let i = 0; i < LIVE_VOTES.length; i++) d = applyLiveVote(d);
  d = applyClosePoll(applyVote(d, "dinner", "o0"), "dinner");
  if (step === 7) return d;

  d = { ...d, focus: null };
  if (step === 8) return d;

  d = applyScan(d);
  for (const [item, person] of FINAL_BELCANTO_EXCLUSIONS)
    d = applyExclude(d, item, person);
  d = applyUpdateActivity(d);
  if (step === 9) return d;

  return applyPay(d, { kind: "settle" }, selectSettleTotal(d));
}

// ---------------------------------------------------------------------------
// Store

let toastId = 0;
let timers: ReturnType<typeof setTimeout>[] = [];
const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

// On a real phone the fake status bar is hidden (the OS draws its own), so the
// story's phone and clock are announced with a scene card after the splash.
const isPhoneViewport = () =>
  typeof window !== "undefined" &&
  !window.matchMedia("(min-width: 431px)").matches;

const sceneCardFor = (step: StepId) => getStep(step).sceneCard ?? null;

export const useScenario = create<State>((set, get) => {
  // Moves the story forward (never back) and shows the step's scene card.
  const advance = (step: StepId, extra: Partial<State> = {}) => {
    if (get().step >= step) return set(extra);
    set({ step, sceneCard: sceneCardFor(step), ...extra });
  };

  return {
    ...INITIAL,
    splash: true,
    sceneCard: null,
    toast: null,

    goToStep: (step) => {
      clearTimers();
      set({ ...stateAtStep(step), sceneCard: sceneCardFor(step), toast: null });
      if (step === 7) get().showToast("‘Belcanto’ won - added to itinerary");
    },
    reset: () => {
      clearTimers();
      set({ ...INITIAL, splash: true, sceneCard: null, toast: null });
    },
    dismissSplash: () => {
      const { phone, clock } = getStep(get().step);
      set({
        splash: false,
        sceneCard: isPhoneViewport()
          ? `${PHONE_LABEL[phone]} · ${clock}`
          : null,
      });
    },
    dismissSceneCard: () => set({ sceneCard: null }),
    showToast: (message) => set({ toast: { id: ++toastId, message } }),
    dismissToast: () => set({ toast: null }),
    clearFocus: () => set({ focus: null }),

    openTrip: () => advance(2),
    openSheet: (sheet) => {
      if (sheet.kind === "invite") return advance(3, { sheet });
      if (sheet.kind === "createPoll") return advance(4, { sheet });
      set({ sheet });
    },
    closeSheet: () => set({ sheet: null }),

    // Other contacts can be invited too; they stay Pending (not in the story).
    inviteContact: (id) => {
      const s = get();
      if (s.members.some((m) => m.id === id)) return;
      set({ members: [...s.members, { id, status: "pending" }] });
    },
    // Feedback for controls whose feature isn't part of the prototype.
    notInPrototype: () => get().showToast("Not part of this prototype"),
    startRenInvite: () => set({ renInvite: "adding" }),
    setRenGuest: (renGuest) => set({ renGuest }),
    inviteRen: () => {
      const s = get();
      set({ ...withRen(s, "pending", s.renGuest), renInvite: "invited" });
      // Ren accepts straight after (§5), so from step 04 she counts as a guest.
      later(() => {
        const now = get();
        if (now.renInvite !== "invited") return;
        set({ ...withRen(now, "yes", now.renGuest), renInvite: "accepted" });
        get().showToast("Ren accepted your invite");
      }, 1600);
    },

    createPoll: (draft) => {
      const s = get();
      set({
        polls: [
          ...s.polls.filter((p) => p.id !== "dinner"),
          makeDinnerPoll(s, draft),
        ],
        sheet: null,
      });
      advance(5);
    },
    openNotification: () => {
      // Back on Ari's phone: the votes come in live on the vote sheet.
      advance(6, { sheet: { kind: "vote", pollId: "dinner" }, liveVotes: 0 });
    },
    addLiveVote: () => {
      set(applyLiveVote(get()));
      const poll = get().polls.find((p) => p.id === "dinner");
      if (poll && poll.status === "live" && totalVotes(poll) >= poll.sentTo) {
        later(() => get().closePoll("dinner"), 700);
      }
    },
    vote: (pollId, optionId) => {
      set(applyVote(get(), pollId, optionId));
      const poll = get().polls.find((p) => p.id === pollId);
      // A poll closes as soon as everyone it was sent to has voted.
      if (poll && poll.status === "live" && totalVotes(poll) >= poll.sentTo) {
        later(() => get().closePoll(pollId), 700);
      }
    },
    closePoll: (pollId) => {
      set(applyClosePoll(get(), pollId));
      if (pollId === "dinner") {
        advance(7);
        get().showToast("‘Belcanto’ won - added to itinerary");
      }
    },

    openBelcanto: () => advance(8, { focus: null }),
    scanReceipt: () => set(applyScan(get())),
    toggleExclude: (itemId, person) => set(applyExclude(get(), itemId, person)),
    updateActivity: () => {
      set(applyUpdateActivity(get()));
      advance(9);
    },

    pay: (scope) => {
      const s = get();
      set(applyPay(s, scope, selectPayTotal(s, scope)));
      if (scope.kind === "settle") advance(10);
    },
  };
});

export const useCurrentStep = () => getStep(useScenario((s) => s.step));

// ---------------------------------------------------------------------------
// Selectors

type Readable = Data;

export const selectLivePolls = (s: Readable) =>
  s.polls.filter((p) => p.status === "live");

export const selectPaymentsDue = (s: Readable) =>
  s.activities.filter((a) => !a.paid && !a.shell).length +
  (s.stay.paid ? 0 : 1);

export const selectUnpaidActivityTotal = (s: Readable) =>
  s.activities
    .filter((a) => !a.paid && !a.shell)
    .reduce((sum, a) => sum + a.share, 0);

export const selectBillShares = (s: Readable) =>
  billShares(s.belcanto.items, BELCANTO_ATTENDEES);

// What others still owe Ari for Belcanto (the "Owes" rows), once it's logged.
export const selectOwedToAri = (s: Readable) => {
  if (!s.belcanto.logged || s.settled) return 0;
  const shares = selectBillShares(s);
  return BELCANTO_ATTENDEES.filter((p) => BELCANTO_STATUS[p] === "owes").reduce(
    (sum, p) => sum + (shares.get(p) ?? 0),
    0,
  );
};

export const selectSettleTotal = (s: Readable) =>
  Math.max(
    0,
    selectUnpaidActivityTotal(s) +
      (s.stay.paid ? 0 : s.stay.share) -
      selectOwedToAri(s),
  );

export const selectPayTotal = (s: Readable, scope: PayScope) => {
  switch (scope.kind) {
    case "settle":
      return selectSettleTotal(s);
    case "activities":
      return selectUnpaidActivityTotal(s);
    case "stay":
      return s.stay.paid ? 0 : s.stay.share;
    case "activity":
      return s.activities.find((a) => a.id === scope.id && !a.paid)?.share ?? 0;
  }
};

export const selectTripTotal = (s: Readable) =>
  s.activities.reduce((sum, a) => sum + a.share, 0) + s.stay.share;
