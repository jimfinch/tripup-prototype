// Scenario steps 01–10. Titles are the wireflow frame captions; clock values
// are read from each wireflow frame's status bar.

export type PhoneId = "ari" | "charlie";

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Step = {
  id: StepId;
  title: string;
  phone: PhoneId;
  clock: string;
  // Where jumping to this step lands. Updated as screens are built (Phase 5).
  route: string;
  // Shown in-frame when the story jumps (new phone, time skip).
  sceneCard?: string;
};

export const STEPS: readonly Step[] = [
  { id: 1, title: "Home view", phone: "ari", clock: "16:15", route: "/" },
  {
    id: 2,
    title: "Trip view",
    phone: "ari",
    clock: "16:15",
    route: "/trips/lisbon/",
  },
  {
    id: 3,
    title: "Invite Ren as a guest",
    phone: "ari",
    clock: "16:15",
    route: "/trips/lisbon/",
  },
  {
    id: 4,
    title: "Create poll",
    phone: "ari",
    clock: "16:30",
    route: "/trips/lisbon/",
  },
  {
    id: 5,
    title: "Notification",
    phone: "charlie",
    clock: "16:30",
    route: "/trips/lisbon/",
    sceneCard: "Charlie’s phone · 16:30",
  },
  {
    id: 6,
    title: "Vote, live results",
    phone: "ari",
    clock: "17:52",
    route: "/trips/lisbon/",
    sceneCard: "Back on Ari’s phone · 17:52",
  },
  {
    id: 7,
    title: "Poll closes, winner added",
    phone: "ari",
    clock: "17:53",
    route: "/trips/lisbon/",
  },
  {
    id: 8,
    title: "Log dinner, exclude wine",
    phone: "ari",
    clock: "22:15",
    route: "/trips/lisbon/",
    sceneCard: "Later that evening · 22:15",
  },
  {
    id: 9,
    title: "Settle trip",
    phone: "ari",
    clock: "22:15",
    route: "/trips/lisbon/",
  },
  {
    id: 10,
    title: "All squared up",
    phone: "ari",
    clock: "22:15",
    route: "/trips/lisbon/",
  },
];

export const getStep = (id: StepId): Step => STEPS[id - 1];

export const PHONE_LABEL: Record<PhoneId, string> = {
  ari: "Ari’s phone",
  charlie: "Charlie’s phone",
};
