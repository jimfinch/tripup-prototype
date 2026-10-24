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
