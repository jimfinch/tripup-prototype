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

export type PollOption = { id: string; label: string; votes: number };

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
};

export const FADO_POLL: Poll = {
  id: "fado",
  tripId: "lisbon",
  question: "Fado in Alfama after dinner?",
  options: [
    { id: "yes", label: "Yes", votes: 5 },
    { id: "no", label: "No", votes: 0 },
  ],
  sentTo: 6,
  closesInMinutes: null,
  ariVote: null,
  status: "live",
};
