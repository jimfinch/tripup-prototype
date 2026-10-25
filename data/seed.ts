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
  | "maria"
  | "adam"
  | "even";

export type Person = {
  id: PersonId;
  name: string;
  firstName: string;
  // No photo in the Figma file: shown as initials.
  avatar: string | null;
};

const person = (id: PersonId, name: string, photo = true): Person => ({
  id,
  name,
  firstName: name.split(" ")[0],
  avatar: photo ? `/avatars/${id}.jpg` : null,
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
  // Intrepid travellers group members (Working page "Manage group").
  adam: person("adam", "Adam Bright", false),
  even: person("even", "Even Olson", false),
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
  // Sent to everyone coming: sentTo follows the trip's coming count.
  audience?: "coming";
  // Who created it; the creator (or trip organiser) can close it.
  creator?: PersonId;
  multipleChoice?: boolean;
  // Where the winner went, once closed.
  addedTo?: "Itinerary" | "Stays";
  closedOn?: string;
};

export type PollTrip = { id: string; label: string };

export const POLL_TRIPS: Record<string, PollTrip> = {
  lisbon: { id: "lisbon", label: "Lisbon trip, 17-24 Oct 2026" },
  vietnam: { id: "vietnam", label: "Vietnam trip, 2-16 Aug 2025" },
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
  audience: "coming",
  closesInMinutes: null,
  ariVote: null,
  status: "live",
};

const yesNo = (yes: number): PollOption[] => [
  { id: "yes", label: "Yes", votes: yes, voters: [] },
  { id: "no", label: "No", votes: 0, voters: [] },
];

// Closed polls (§6, Working "Trips closed polls" / "Closed polls view").
export const CLOSED_POLLS: Poll[] = [
  {
    id: "seafood",
    tripId: "lisbon",
    question: "Seafood night on the 22nd?",
    options: yesNo(6),
    sentTo: 6,
    closesInMinutes: null,
    ariVote: "yes",
    status: "closed",
    winner: "Yes",
    addedTo: "Itinerary",
    closedOn: "22 Oct 2026",
  },
  {
    id: "stay",
    tripId: "lisbon",
    question: "Where should we stay?",
    options: [
      { id: "pessoa", label: "Antiga Casa Pessoa", votes: 6, voters: [] },
      { id: "gloria", label: "Glória’s Terrace", votes: 0, voters: [] },
      { id: "castle", label: "Castle-View Penthouse", votes: 2, voters: [] },
    ],
    sentTo: 6,
    multipleChoice: true,
    closesInMinutes: null,
    ariVote: "pessoa",
    status: "closed",
    winner: "Antiga Casa Pessoa",
    addedTo: "Stays",
    closedOn: "2 Jan 2026",
  },
  {
    id: "hoian-eat",
    tripId: "vietnam",
    question: "Where to eat on Thursday night?",
    options: [],
    sentTo: 6,
    closesInMinutes: null,
    ariVote: null,
    status: "closed",
    winner: "Hoi An Riverside",
    addedTo: "Itinerary",
    closedOn: "14 Aug 2025",
  },
  {
    id: "hoian-stay",
    tripId: "vietnam",
    question: "Where should we stay in Hoi An?",
    options: [],
    sentTo: 6,
    closesInMinutes: null,
    ariVote: null,
    status: "closed",
    winner: "Dechiu",
    addedTo: "Stays",
    closedOn: "14 Aug 2025",
  },
];

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

// ---------------------------------------------------------------------------
// Groups (added value, §6 · Working "Home view - Group tab" / "Manage group")

export type GroupTrip = {
  name: string;
  dates: string;
  organiser: PersonId;
  faces: PersonId[];
};

export type Group = {
  id: string;
  name: string;
  createdBy: PersonId;
  faces: PersonId[];
  overflow: number;
  tripsTogether: number;
  mine: boolean;
  // Intrepid travellers starts without one, to show Add group image.
  image?: string;
};

const GROUP_FACES: PersonId[] = [
  "ari",
  "jaimie",
  "charlie",
  "ren",
  "aylin",
  "matteo",
];

export const GROUPS: Group[] = [
  {
    id: "intrepid",
    name: "Intrepid travellers",
    createdBy: "ari",
    faces: ["ari", "adam", "jaimie", "even", "nic"],
    overflow: 0,
    tripsTogether: 6,
    mine: true,
  },
  {
    id: "family",
    name: "Family",
    createdBy: "ari",
    faces: GROUP_FACES,
    overflow: 5,
    tripsTogether: 7,
    mine: true,
    image: "/groups/family.jpg",
  },
  {
    id: "beach",
    name: "Beach brigade",
    createdBy: "jon",
    faces: GROUP_FACES,
    overflow: 2,
    tripsTogether: 2,
    mine: false,
    image: "/groups/beach.jpg",
  },
  {
    id: "hens",
    name: "Hen dos",
    createdBy: "ren",
    faces: GROUP_FACES,
    overflow: 10,
    tripsTogether: 2,
    mine: false,
    image: "/groups/hens.jpg",
  },
];

// Intrepid travellers: who's joined (6 invited · 5 joined) and trips together.
export const INTREPID_MEMBERS: TripMember[] = [
  { id: "ari", status: "yes" },
  { id: "aylin", status: "pending" },
  { id: "adam", status: "yes" },
  { id: "jaimie", status: "yes" },
  { id: "even", status: "yes" },
  { id: "nic", status: "yes" },
];

export const INTREPID_TRIPS: GroupTrip[] = [
  {
    name: "Vietnam",
    dates: "2 - 16 Aug 2025",
    organiser: "jaimie",
    faces: ["ari", "adam", "jaimie", "even", "nic"],
  },
  {
    name: "Peru",
    dates: "4 - 25 May 2024",
    organiser: "jaimie",
    faces: ["ari", "adam", "jaimie", "even", "nic"],
  },
  {
    name: "Cuba",
    dates: "4 - 18 Feb 2023",
    organiser: "jaimie",
    faces: ["ari", "jaimie", "even", "nic"],
  },
];

// Photos offered by the mock photo picker when adding a group image. The
// designer's Intrepid travellers photo comes first; four photos fill the two
// rows beside the camera tile.
export const RECENT_PHOTOS = [
  "/groups/intrepid.jpg",
  "/trips/lisbon.jpg",
  "/trips/milan.jpg",
  "/trips/krakow.jpg",
];
