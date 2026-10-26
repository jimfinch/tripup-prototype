// Ask TripUp (Working "AI assistant" frames): the questions this demo can
// answer. Answers are worked out from the scenario store and hand off to the
// existing screens and sheets, rather than replacing them.

export type AssistantIntent =
  "owe" | "fado" | "poll" | "belcanto" | "owed" | "unknown";

// One question in the conversation: what was asked, and what it matched.
export type AssistantTurn = { intent: AssistantIntent; text: string };

export const ASK_LABEL: Record<AssistantIntent, string> = {
  owe: "What do I owe for Lisbon?",
  fado: "Who hasn’t voted on Fado?",
  poll: "Start a dinner poll for tonight",
  belcanto: "Find Belcanto",
  owed: "Who owes me?",
  unknown: "",
};

// "Try asking", as in the Suggestions frame.
export const SUGGESTIONS: AssistantIntent[] = [
  "owe",
  "fado",
  "poll",
  "belcanto",
];

// A typed question, matched to the nearest example by keyword. No model runs
// in the prototype.
export function matchIntent(text: string): AssistantIntent {
  const q = text.toLowerCase();
  if (/\bowes? me\b|\bowed\b/.test(q)) return "owed";
  if (/\b(owe|pay|settle|cost|spent)\b/.test(q)) return "owe";
  if (/\b(fado|vote|voted)\b/.test(q)) return "fado";
  if (/\b(belcanto|find)\b/.test(q)) return "belcanto";
  if (/\b(poll|dinner|eat)\b/.test(q)) return "poll";
  return "unknown";
}
