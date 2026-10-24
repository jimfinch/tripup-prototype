// All mock data (CLAUDE.md §6). People first; trips, polls and bills are
// added in Phase 5.

export type PersonId =
  | "ari"
  | "charlie"
  | "jaimie"
  | "matteo"
  | "nic"
  | "tim"
  | "aylin"
  | "ren"
  | "steff"
  | "jon"
  | "tristan"
  | "maria";

export type Person = {
  id: PersonId;
  name: string;
  firstName: string;
  avatar: string;
};

const person = (id: PersonId, name: string): Person => ({
  id,
  name,
  firstName: name.split(" ")[0],
  avatar: `/avatars/${id}.jpg`,
});

export const PEOPLE: Record<PersonId, Person> = {
  ari: person("ari", "Ari Cohen"),
  charlie: person("charlie", "Charlie Brooke"),
  jaimie: person("jaimie", "Jaimie Garcia"),
  matteo: person("matteo", "Matteo Lorenzo"),
  nic: person("nic", "Nic Noble"),
  tim: person("tim", "Tim Lee"),
  aylin: person("aylin", "Aylin Kaya"),
  ren: person("ren", "Ren Lindqvist"),
  steff: person("steff", "Steff Sanchez"),
  jon: person("jon", "Jon Cohen"),
  tristan: person("tristan", "Tristan Thomas"),
  maria: person("maria", "Maria Cortez"),
};

// ---------------------------------------------------------------------------
// Trips

export type TripMember = {
  id: PersonId;
  status: "yes" | "pending";
  guest?: boolean;
};

export type UpcomingTrip = {
  id: string;
  name: string;
  dates: string;
  image: string;
  organiser: PersonId;
  avatars: PersonId[];
  overflow: number;
};

export const LISBON = {
  id: "lisbon",
  name: "Lisbon",
  dates: "17-24 Oct 2026",
  organiser: "jaimie" as PersonId,
  image: "/trips/lisbon.jpg",
  // Faces on the Home trip card, as in the hi-fi frame.
  cardAvatars: [
    "ari",
    "jaimie",
    "charlie",
    "ren",
    "aylin",
    "matteo",
  ] as PersonId[],
};

// Ari's view of who's on the Lisbon trip before Ren is invited (§6).
export const LISBON_MEMBERS: TripMember[] = [
  { id: "ari", status: "yes" },
  { id: "charlie", status: "yes" },
  { id: "jaimie", status: "yes" },
  { id: "matteo", status: "yes" },
  { id: "nic", status: "yes" },
  { id: "tim", status: "yes" },
  { id: "aylin", status: "pending" },
];

// Faces, organisers and overflow follow the hi-fi Home frame and wireflow.
const UPCOMING_FACES: PersonId[] = [
  "ari",
  "jaimie",
  "charlie",
  "ren",
  "aylin",
  "matteo",
];

export const UPCOMING_TRIPS: UpcomingTrip[] = [
  {
    id: "milan",
    name: "Milan",
    dates: "11 - 13 Dec 2026",
    image: "/trips/milan.jpg",
    organiser: "charlie",
    avatars: UPCOMING_FACES,
    overflow: 0,
  },
  {
    id: "krakow",
    name: "Kraków",
    dates: "5 - 7 Feb 2027",
    image: "/trips/krakow.jpg",
    organiser: "ari",
    avatars: UPCOMING_FACES,
    overflow: 3,
  },
  {
    id: "sardinia",
    name: "Sardinia",
    dates: "5 - 12 June 2027",
    image: "/trips/sardinia.jpg",
    organiser: "nic",
    avatars: UPCOMING_FACES,
    overflow: 1,
  },
];

// The scenario takes place on the last night of the Lisbon trip.
export const TODAY = { day: 24, month: "Oct" };

export const PENDING_INVITE = {
  tripId: "dubrovnik",
  name: "Dubrovnik",
  lines: ["You’re invited to Dubrovnik", "with Steff +5 more"] as [
    string,
    string,
  ],
};

// ---------------------------------------------------------------------------
// Lisbon itinerary and stay. Amounts are Ari's share, in pence.

export type ActivityType = "Dinner" | "Lunch" | "Drinks";

export type Activity = {
  id: string;
  day: number;
  month: string;
  title: string;
  type: ActivityType;
  time: string;
  coming: number;
  share: number;
  paid: boolean;
  // Added by a poll and not yet filled in by its organiser.
  shell?: boolean;
};

export const ACTIVITIES: Activity[] = [
  {
    id: "tasca",
    day: 19,
    month: "Oct",
    title: "Tasca Baldracca",
    type: "Dinner",
    time: "19:00 - 21:00",
    coming: 5,
    share: 9249,
    paid: true,
  },
  {
    id: "eurico",
    day: 20,
    month: "Oct",
    title: "O Velho Eurico",
    type: "Lunch",
    time: "12:00 - 13:30",
    coming: 6,
    share: 6000,
    paid: true,
  },
  {
    id: "ramiro",
    day: 22,
    month: "Oct",
    title: "Cervejaria Ramiro",
    type: "Dinner",
    time: "19:30 - 21:15",
    coming: 6,
    share: 11050,
    paid: true,
  },
  {
    id: "pigmeu",
    day: 24,
    month: "Oct",
    title: "Pigmeu",
    type: "Drinks",
    time: "13:00 - 14:30",
    coming: 5,
    share: 3099,
    paid: false,
  },
];

export type Stay = {
  id: string;
  from: string;
  to: string;
  nights: number;
  name: string;
  beds: number;
  checkIn: string;
  coming: number;
  share: number;
  paid: boolean;
};

export const STAY: Stay = {
  id: "pessoa",
  from: "17 Oct",
  to: "24 Oct",
  nights: 7,
  name: "Antiga Casa Pessoa",
  beds: 6,
  checkIn: "15:00",
  coming: 6,
  share: 105000,
  paid: false,
};

// ---------------------------------------------------------------------------
// Polls

export type PollOption = {
  id: string;
  label: string;
  votes: number;
  voters: PersonId[];
};

export type Poll = {
  id: string;
  tripId: string;
  question: string;
  options: PollOption[];
  sentTo: number;
  // Minutes until it closes; null = no expiry.
  closesInMinutes: number | null;
  ariVote: string | null;
  status: "live" | "closed";
  winner?: string;
};

export const FADO_POLL: Poll = {
  id: "fado",
  tripId: "lisbon",
  question: "Fado in Alfama after dinner?",
  options: [
    {
      id: "yes",
      label: "Yes",
      votes: 5,
      voters: ["charlie", "jaimie", "matteo", "nic", "tim"],
    },
    { id: "no", label: "No", votes: 0, voters: [] },
  ],
  sentTo: 6,
  closesInMinutes: null,
  ariVote: null,
  status: "live",
};

// ---------------------------------------------------------------------------
// The dinner poll Ari creates at step 04 (form pre-filled for the demo).

export const DINNER_POLL_DRAFT = {
  question: "Where should we eat tonight?",
  date: "Today",
  time: "18:30",
  options: [
    "Belcanto",
    "O Velho Eurico (Traditional)",
    "Cervejaria Ramiro (Seafood)",
  ],
  sendToGuests: true,
  closeAutomatically: true,
  closeIn: "2 hrs" as const,
  multipleAnswers: false,
};

export const CLOSE_IN_OPTIONS = ["30 min", "1 hr", "2 hrs", "Custom"] as const;
export type CloseIn = (typeof CLOSE_IN_OPTIONS)[number];

// Votes arriving live at step 06, ~600 ms apart (option index per vote). The
// lead changes hands: Ramiro leads, then ties, then Belcanto pulls ahead to
// Belcanto 4 · Eurico 0 · Ramiro 2.
export const LIVE_VOTES: { option: number; voter: PersonId }[] = [
  { option: 2, voter: "charlie" },
  { option: 0, voter: "jaimie" },
  { option: 2, voter: "ren" },
  { option: 0, voter: "matteo" },
  { option: 0, voter: "tim" },
  { option: 0, voter: "nic" },
];

// ---------------------------------------------------------------------------
// Belcanto, added by the poll at step 07 and logged at step 08.

export const BELCANTO = {
  id: "belcanto",
  title: "Belcanto",
  day: 24,
  month: "Oct",
  date: "24 Oct 2026",
  time: "18:30",
  type: "Dinner" as ActivityType,
  address: "Rua Serpa Pinto 10A, 1200-445 Lisboa, Portugal",
};

// Order of the share list on the bill (wireflow 08).
export const BELCANTO_ATTENDEES: PersonId[] = [
  "ari",
  "charlie",
  "jaimie",
  "matteo",
  "nic",
  "ren",
  "tim",
];

export type BillStatus = "bill" | "paid" | "owes";

// Bill = Ari paid the bill; Paid = already paid Ari back; Owes = still owes Ari.
export const BELCANTO_STATUS: Record<string, BillStatus> = {
  ari: "bill",
  charlie: "owes",
  jaimie: "paid",
  matteo: "paid",
  nic: "owes",
  ren: "owes",
  tim: "paid",
};

export type BillItem = {
  id: string;
  label: string;
  amount: number;
  excluded: PersonId[];
};

export const BELCANTO_ITEMS: BillItem[] = [
  { id: "food", label: "Food & soft drinks", amount: 41209, excluded: [] },
  { id: "wine", label: "Wine: 3 bottles", amount: 11640, excluded: [] },
];

// ---------------------------------------------------------------------------
// Settling (§6). The consolidated transfer goes to Jaimie.

export const SETTLE = {
  payee: "jaimie" as PersonId,
  transfersInsteadOf: 5,
  consolidatedNote:
    "Charlie, Ren and Nic will pay Jaimie what they owe you for Belcanto, so everyone settles in one go.",
  card: "7492",
};

export const SETTLED_SUMMARY = {
  transfers: "5 instead of 23",
  done: "3 of 5 transfers done",
  others: [
    { label: "Nic paid Jaimie", amount: 110887 },
    { label: "Ren paid Jaimie", amount: 5887 },
  ],
  more: "+ 2 more",
};
