"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import {
  BELCANTO,
  BELCANTO_ATTENDEES,
  BELCANTO_STATUS,
  LISBON,
  PEOPLE,
} from "@/data/seed";
import {
  ASK_LABEL,
  SUGGESTIONS,
  matchIntent,
  type AssistantIntent,
  type AssistantTurn,
} from "@/lib/assistant";
import { cn } from "@/lib/cn";
import { formatPence } from "@/lib/money";
import {
  selectBillShares,
  selectOwedToAri,
  selectSettleTotal,
  totalVotes,
  useScenario,
} from "@/store/scenario";

const TRIP = `/trips/${LISBON.id}/`;
const BELCANTO_ROUTE = `${TRIP}activities/${BELCANTO.id}/`;
// A beat of "thinking" before each answer.
const REPLY_MS = 700;

// "Charlie, Nic and Ren".
const listNames = (names: string[]) =>
  names.length > 1
    ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`
    : (names[0] ?? "");

// Ask TripUp (Working "AI assistant - Suggestions" / "- Answer"): replaces
// Search in the tab bar. It answers from the trip's data and every answer
// ends in the existing UI (a sheet or screen), where Ari confirms anything
// that affects the group or money.
export function AssistantSheet() {
  const open = useScenario((s) => s.assistantOpen);
  const thread = useScenario((s) => s.assistantThread);
  const close = useScenario((s) => s.closeAssistant);
  const ask = useScenario((s) => s.ask);
  const notInPrototype = useScenario((s) => s.notInPrototype);
  const [draft, setDraft] = useState("");

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    ask(matchIntent(text), text);
    setDraft("");
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Ask TripUp"
      fill
      scrollKey={thread.length}
      footer={
        <div className="flex flex-col gap-2.5">
          <form
            onSubmit={send}
            className="flex items-center gap-2 rounded-pill border border-gunmetal/25 py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-gunmetal"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask TripUp anything…"
              aria-label="Ask TripUp"
              className="min-w-0 flex-1 bg-transparent text-body-s text-gunmetal outline-none placeholder:text-ink-muted focus-visible:ring-0"
            />
            <button
              type="button"
              aria-label="Dictate"
              onClick={notInPrototype}
              className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-gunmetal/5 text-gunmetal transition active:scale-press"
            >
              <Icon name="mic" size={20} />
            </button>
            <button
              type="submit"
              aria-label="Send"
              className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-lime text-gunmetal transition active:scale-press disabled:opacity-40"
              disabled={!draft.trim()}
            >
              <Icon name="arrow-right" size={20} className="-rotate-90" />
            </button>
          </form>
          <p className="text-center text-caption text-ink-muted">
            TripUp checks with you before changing anything for the group.
          </p>
        </div>
      }
    >
      {thread.length === 0 ? (
        <Welcome onAsk={ask} />
      ) : (
        <div className="flex flex-col gap-4 pt-2">
          {thread.map((turn, i) => (
            <Exchange key={i} turn={turn} />
          ))}
        </div>
      )}
    </Sheet>
  );
}

function Welcome({ onAsk }: { onAsk: (intent: AssistantIntent) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <AssistantMark large />
        <h3 className="text-title-l text-gunmetal">Hi Ari, how can I help?</h3>
        <p className="text-body-s text-ink-muted">
          Ask about your trips, polls and payments. I’ll take you straight to
          the right place.
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <p className="text-body-s text-ink-muted">Try asking</p>
        {SUGGESTIONS.map((intent) => (
          <button
            key={intent}
            type="button"
            onClick={() => onAsk(intent)}
            className="flex items-center gap-2 rounded-pill border border-gunmetal/25 py-3.5 pl-5 pr-4 text-left text-label text-gunmetal transition active:scale-press"
          >
            <span className="flex-1">{ASK_LABEL[intent]}</span>
            <Icon
              framed
              name="arrow-right"
              size={20}
              className="text-ink-muted"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Gunmetal disc with the lime Ask sparkle (56 px on the welcome, 28 px
// beside answers).
function AssistantMark({ large = false }: { large?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-pill bg-gunmetal text-lime",
        large ? "size-14" : "size-7",
      )}
    >
      <Icon name="sparkle" size={large ? 24 : 16} />
    </span>
  );
}

function Exchange({ turn }: { turn: AssistantTurn }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), REPLY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="ml-10 self-end rounded-bubble rounded-br-bubble-tail bg-gunmetal px-4 py-3 text-label text-white">
        {turn.text}
      </p>
      <div className="flex items-start gap-2.5">
        <AssistantMark />
        <div className="flex min-w-0 flex-1 flex-col gap-3" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {ready ? (
              <motion.div
                key="reply"
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Reply intent={turn.intent} />
              </motion.div>
            ) : (
              <motion.p
                key="typing"
                className="flex h-7 items-center gap-1"
                aria-label="TripUp is typing"
                exit={{ opacity: 0 }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-pulse rounded-pill bg-gunmetal/40"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// The answer for each question, from the live scenario state.
function Reply({ intent }: { intent: AssistantIntent }) {
  const router = useRouter();
  const s = useScenario();
  const settleTotal = selectSettleTotal(s);
  const owed = selectOwedToAri(s);
  const shares = selectBillShares(s);
  const owers = BELCANTO_ATTENDEES.filter((p) => BELCANTO_STATUS[p] === "owes");
  const owerNames = listNames(owers.map((p) => PEOPLE[p].firstName));
  const dinner = s.polls.find((p) => p.id === "dinner");
  const fado = s.polls.find((p) => p.id === "fado");

  // Hand off to the existing UI: close, go to the screen, open its sheet.
  const go = (route: string, then?: () => void) => {
    s.closeAssistant();
    then?.();
    router.push(route);
  };
  const openPay = (scope: "settle" | "stay") =>
    go(TRIP, () => s.openSheet({ kind: "pay", scope: { kind: scope } }));
  const openBelcanto = () => go(BELCANTO_ROUTE, s.openBelcanto);
  const openDinnerPoll = () =>
    go(TRIP, () => s.openSheet({ kind: "vote", pollId: "dinner" }));

  switch (intent) {
    case "owe": {
      if (settleTotal === 0)
        return (
          <Text>You’re all squared up for Lisbon. Nothing left to pay.</Text>
        );
      const rows = [
        ...(s.stay.paid
          ? []
          : [{ label: `Stay - ${s.stay.name}`, amount: s.stay.share }]),
        ...s.activities
          .filter((a) => !a.paid && !a.shell)
          .map((a) => ({ label: `${a.type} - ${a.title}`, amount: a.share })),
        ...(owed > 0
          ? [{ label: `Owed to you - ${BELCANTO.title}`, amount: -owed }]
          : []),
      ];
      return (
        <>
          <Text>
            You owe {formatPence(settleTotal)} for Lisbon.
            {owed > 0 &&
              ` What ${owerNames} owe you for ${BELCANTO.title} has already been taken off.`}
          </Text>
          <div className="flex flex-col gap-2.5 rounded-answer border border-gunmetal/25 p-4 text-body-s">
            {rows.map((r) => (
              <p key={r.label} className="flex justify-between gap-2">
                <span className="text-ink-muted">{r.label}</span>
                <span className="text-label text-gunmetal">
                  {r.amount < 0
                    ? `−${formatPence(-r.amount)}`
                    : formatPence(r.amount)}
                </span>
              </p>
            ))}
            <span aria-hidden className="h-px bg-gunmetal/10" />
            <p className="flex justify-between text-label text-gunmetal">
              You pay<span>{formatPence(settleTotal)}</span>
            </p>
          </div>
          <Button theme="light" size="xl" onClick={() => openPay("settle")}>
            Settle trip {formatPence(settleTotal)}
          </Button>
          <FollowUps>
            {!s.stay.paid && (
              <Chip onClick={() => openPay("stay")}>Pay the stay only</Chip>
            )}
            <Chip onClick={() => s.ask("owed")}>{ASK_LABEL.owed}</Chip>
          </FollowUps>
        </>
      );
    }

    case "owed":
      if (owed > 0) {
        const each = owers.map(
          (p) => `${PEOPLE[p].firstName} (${formatPence(shares.get(p) ?? 0)})`,
        );
        return (
          <>
            <Text>
              {listNames(each)} owe you {formatPence(owed)} for {BELCANTO.title}
              . When you settle, they’ll pay Jaimie instead, so everyone settles
              in one go.
            </Text>
            <Button theme="light" size="xl" onClick={openBelcanto}>
              View {BELCANTO.title}
            </Button>
          </>
        );
      }
      return (
        <Text>
          {s.belcanto.logged
            ? `Nobody now. You’ve settled Lisbon, so ${owerNames} pay Jaimie for ${BELCANTO.title}.`
            : "Nobody owes you anything for Lisbon yet. When you pay a bill for the group, I’ll keep track of who owes you."}
        </Text>
      );

    case "fado": {
      if (!fado) return null;
      const yes = fado.options.find((o) => o.id === "yes")?.votes ?? 0;
      const total = totalVotes(fado);
      return (
        <>
          <Text>
            {fado.ariVote
              ? `Everyone’s voted on ‘${fado.question}’ - ${total} of ${fado.sentTo}.`
              : `Just you. ${total} of ${fado.sentTo} have voted on ‘${fado.question}’ and ${yes === total ? `all ${total} said Yes` : `${yes} said Yes`}.`}
          </Text>
          <Button theme="light" size="xl" onClick={() => go("/polls/")}>
            {fado.ariVote ? "View poll" : "Vote now"}
          </Button>
        </>
      );
    }

    case "poll":
      if (dinner?.status === "live")
        return (
          <>
            <Text>
              There’s already a dinner poll for tonight: ‘{dinner.question}’ -{" "}
              {totalVotes(dinner)} of {dinner.sentTo} voted.
            </Text>
            <Button theme="light" size="xl" onClick={openDinnerPoll}>
              View poll
            </Button>
          </>
        );
      if (dinner)
        return (
          <>
            <Text>
              Tonight’s dinner poll has closed. ‘{dinner.winner}’ won and it’s
              in the itinerary.
            </Text>
            <Button theme="light" size="xl" onClick={openBelcanto}>
              View {BELCANTO.title}
            </Button>
          </>
        );
      return (
        <>
          <Text>
            I’ve drafted a dinner poll for tonight at 18:30 with Belcanto, O
            Velho Eurico and Cervejaria Ramiro. Check it before it goes to the
            group.
          </Text>
          <Button
            theme="light"
            size="xl"
            onClick={() =>
              go(TRIP, () => {
                // The poll comes after Ren's invite in the story.
                if (s.step < 4) s.goToStep(4);
                s.openSheet({ kind: "createPoll" });
              })
            }
          >
            Review poll
          </Button>
        </>
      );

    case "belcanto":
      if (s.belcanto.added)
        return (
          <>
            <Text>Here’s Belcanto in your Lisbon itinerary.</Text>
            <button
              type="button"
              onClick={openBelcanto}
              className="flex items-center gap-3 rounded-answer border border-gunmetal/25 p-4 text-left transition active:scale-press"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-gunmetal text-lime">
                <Icon name="dinner" size={20} />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-headline text-gunmetal">
                  {BELCANTO.title}
                </span>
                <span className="text-body-s text-ink-muted">
                  {BELCANTO.type} · {BELCANTO.day} {BELCANTO.month},{" "}
                  {BELCANTO.time} · Lisbon
                </span>
              </span>
              <Icon framed name="arrow-right" size={20} />
            </button>
          </>
        );
      if (dinner)
        return (
          <>
            <Text>
              Belcanto is one of the options in tonight’s dinner poll, ‘
              {dinner.question}’.
            </Text>
            <Button theme="light" size="xl" onClick={openDinnerPoll}>
              View poll
            </Button>
          </>
        );
      return (
        <>
          <Text>
            Belcanto isn’t in any of your trips yet. Want to put it to the
            group?
          </Text>
          <FollowUps>
            <Chip onClick={() => s.ask("poll")}>{ASK_LABEL.poll}</Chip>
          </FollowUps>
        </>
      );

    case "unknown":
      return (
        <>
          <Text>
            In this prototype I can only answer a few example questions. Try one
            of these:
          </Text>
          <FollowUps>
            {SUGGESTIONS.map((i) => (
              <Chip key={i} onClick={() => s.ask(i)}>
                {ASK_LABEL[i]}
              </Chip>
            ))}
          </FollowUps>
        </>
      );
  }
}

function Text({ children }: { children: ReactNode }) {
  return <p className="text-body text-gunmetal">{children}</p>;
}

function FollowUps({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-pill border border-gunmetal/25 px-3.5 py-2.5 text-caption-strong text-gunmetal transition active:scale-press"
    >
      {children}
    </button>
  );
}
