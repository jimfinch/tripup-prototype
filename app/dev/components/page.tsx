"use client";

import { useState, type ReactNode } from "react";
import { AttendeeRow } from "@/components/group/AttendeeRow";
import { PayState } from "@/components/pay/PayState";
import { PollOptionRow } from "@/components/poll/PollOptionRow";
import { Screen } from "@/components/shell/Screen";
import { ActivityCard } from "@/components/trip/ActivityCard";
import { StayCard } from "@/components/trip/StayCard";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { CountBadge, NewBadge } from "@/components/ui/Badge";
import { Button, type ButtonTheme } from "@/components/ui/Button";
import { Check } from "@/components/ui/Check";
import { Icon, type IconName } from "@/components/ui/Icon";
import { InlineNotification } from "@/components/ui/InlineNotification";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toggle } from "@/components/ui/Toggle";
import { PEOPLE, type PersonId } from "@/data/seed";
import { cn } from "@/lib/cn";

// Hidden review page: every component and variant (CLAUDE.md §10, Phase 3).

const THEMES: ButtonTheme[] = [
  "dark",
  "outline",
  "secondary",
  "light",
  "primary",
];
const ICONS: IconName[] = [
  "plus",
  "arrow-right",
  "arrow-up-left",
  "caret",
  "check",
  "close",
  "search",
  "pencil",
  "people-add",
  "pending-user",
  "card",
  "credit-card",
  "dinner",
  "drinks",
  "receipt",
  "map-pin",
  "airplane",
  "lock",
  "kebab",
  "poll",
  "trash",
];

function Section({
  title,
  dark,
  children,
}: {
  title: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-caption-strong uppercase tracking-wide text-ink-muted">
        {title}
      </h2>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-md p-4",
          dark ? "bg-gunmetal" : "bg-lilac",
        )}
      >
        {children}
      </div>
    </section>
  );
}

const VOTE_SEQUENCE = [
  [1, 0, 0],
  [1, 0, 1],
  [1, 0, 2],
  [2, 0, 2],
  [3, 0, 2],
  [4, 0, 2],
];

export default function ComponentsPage() {
  const [toggles, setToggles] = useState([true, false]);
  const [voteStep, setVoteStep] = useState(VOTE_SEQUENCE.length - 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [excluded, setExcluded] = useState<PersonId[]>(["nic", "ren"]);

  const votes = VOTE_SEQUENCE[voteStep].map(
    (v, i) => v + (selected === i ? 1 : 0),
  );
  const total = votes.reduce((a, b) => a + b, 0);
  const max = Math.max(...votes);
  const options = [
    "Belcanto",
    "O Velho Eurico (Traditional)",
    "Cervejaria Ramiro (Seafood)",
  ];

  return (
    <Screen tabBar className="bg-white">
      <div className="flex flex-col gap-8 px-4 pb-39 pt-status-bar">
        <header className="pt-6">
          <h1 className="text-title-l">Components</h1>
          <p className="mt-1 text-body-s text-ink-muted">
            Phase 3 review. Every variant from Sample System.
          </p>
        </header>

        <Section title="Type scale">
          <p className="text-display">Display 40/44</p>
          <p className="text-title-l">Title L 32/36</p>
          <p className="text-title-m">Title M 22/28</p>
          <p className="text-title-s">Title S 18/24</p>
          <p className="text-headline">Headline 16/22</p>
          <p className="text-body">Body 16/24</p>
          <p className="text-label">Label 14/20</p>
          <p className="text-body-s">Body S 14/20</p>
          <p className="text-body-s text-ink-muted">Body S, ink-muted</p>
          <p className="text-caption">Caption 12/16</p>
          <p className="text-caption-strong">Caption Strong 12/16</p>
          <p className="text-micro">Micro 10/12</p>
        </Section>

        <Section title="Colour">
          <div className="grid grid-cols-4 gap-2">
            {[
              ["bg-gunmetal", "Gunmetal"],
              ["bg-violet", "Violet"],
              ["bg-lime", "Lime"],
              ["bg-teal", "Teal"],
              ["bg-lilac border border-gunmetal/10", "Lilac"],
              ["bg-off-white border border-gunmetal/10", "Off white"],
              ["bg-white border border-gunmetal/10", "White"],
            ].map(([cls, name]) => (
              <div key={name} className="flex flex-col gap-1">
                <span className={cn("h-12 rounded-sm", cls)} />
                <span className="text-caption">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons · medium / large">
          {THEMES.map((theme) => (
            <div key={theme} className="flex flex-wrap items-center gap-2">
              <Button
                theme={theme}
                leftIcon={<Icon framed name="plus" />}
                rightIcon={<Icon framed name="arrow-right" size={20} />}
              >
                Pay
              </Button>
              {theme !== "outline" && (
                <Button
                  theme={theme}
                  size="lg"
                  leftIcon={<Icon framed name="plus" />}
                  rightIcon={<Icon framed name="arrow-right" />}
                >
                  New
                </Button>
              )}
              <span className="text-caption text-ink-muted">{theme}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              theme="light"
              disabled
              rightIcon={<Icon framed name="plus" size={20} />}
            >
              Add group
            </Button>
            <span className="self-center text-caption text-ink-muted">
              disabled
            </span>
          </div>
        </Section>

        <Section title="Buttons · extra large">
          {(["outline", "secondary", "light", "primary"] as ButtonTheme[]).map(
            (theme) => (
              <Button key={theme} theme={theme} size="xl">
                Settle trip £1,080.99
              </Button>
            ),
          )}
        </Section>

        <Section title="Buttons on dark" dark>
          <div className="flex gap-3">
            <Button
              theme="dark"
              fullWidth
              className="flex-1"
              rightIcon={<Icon framed name="arrow-right" size={20} />}
            >
              All polls
            </Button>
            <Button
              theme="primary"
              fullWidth
              className="flex-1"
              rightIcon={<Icon framed name="poll" size={20} />}
            >
              Vote
            </Button>
          </div>
          <div className="flex gap-2">
            {[
              ["Polls", 1],
              ["Itinerary", 4],
              ["Stays", 1],
            ].map(([label, n]) => (
              <Button
                key={label}
                theme="dark"
                className="flex-1"
                rightIcon={<CountBadge value={n as number} />}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button theme="primary" size="xl">
            Settle trip £1,080.99
          </Button>
        </Section>

        <Section title="Pay states">
          <div className="flex gap-2">
            <PayState paid={false} />
            <PayState paid />
          </div>
        </Section>

        <Section title="Badges, toggle, check">
          <div className="flex items-center gap-3">
            <NewBadge />
            <CountBadge value={5} />
            <Toggle
              label="Send poll to guests"
              checked={toggles[0]}
              onChange={(v) => setToggles([v, toggles[1]])}
            />
            <Toggle
              label="Close automatically"
              checked={toggles[1]}
              onChange={(v) => setToggles([toggles[0], v])}
            />
          </div>
          <div className="flex items-center gap-3">
            <Check state="yes" />
            <Check state="pending" />
            <Check state="selected" />
            <Check state="empty" />
          </div>
        </Section>

        <Section title="Avatars">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PEOPLE) as PersonId[]).map((id) => (
              <Avatar key={id} id={id} />
            ))}
          </div>
          <AvatarStack
            ids={["ari", "charlie", "jaimie", "matteo", "nic", "tim"]}
            overflow={1}
          />
          <p className="text-caption text-ink-muted">
            Tap to exclude from the wine (dimmed):
          </p>
          <div className="flex gap-2">
            {(
              [
                "ari",
                "charlie",
                "jaimie",
                "matteo",
                "nic",
                "tim",
                "ren",
              ] as PersonId[]
            ).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={!excluded.includes(id)}
                aria-label={`${PEOPLE[id].firstName}: ${excluded.includes(id) ? "excluded" : "included"}`}
                className="tap-target rounded-pill"
                onClick={() =>
                  setExcluded((x) =>
                    x.includes(id) ? x.filter((p) => p !== id) : [...x, id],
                  )
                }
              >
                <Avatar id={id} dimmed={excluded.includes(id)} />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Avatars on dark" dark>
          <AvatarStack
            ids={["ari", "charlie", "jaimie", "matteo", "nic", "tim"]}
            overflow={1}
            tone="dark"
          />
        </Section>

        <Section title="Icons">
          <div className="grid grid-cols-7 gap-3">
            {ICONS.map((name) => (
              <span
                key={name}
                title={name}
                className="flex h-6 items-center justify-center"
              >
                <Icon name={name} />
              </span>
            ))}
          </div>
        </Section>

        <section className="flex flex-col gap-3">
          <h2 className="text-caption-strong uppercase tracking-wide text-ink-muted">
            Cards
          </h2>
          <InlineNotification
            lines={["You’re invited to Dubrovnik", "with Steff +5 more"]}
            actionLabel="Accept Trip"
          />
          <SectionHeader title="Itinerary" href="#" />
          <div className="flex flex-col gap-2">
            <ActivityCard
              day={19}
              month="Oct"
              title="Tasca Baldracca"
              type="Dinner"
              time="19:00 - 21:00"
              coming={5}
              share={9249}
              paid
              connector
            />
            <ActivityCard
              day={24}
              month="Oct"
              title="Pigmeu"
              type="Drinks"
              time="13:00 - 14:30"
              coming={5}
              share={3099}
              paid={false}
            />
          </div>
          <SectionHeader title="Stays" meta="1 stay" />
          <StayCard
            from="17 Oct"
            to="24 Oct"
            nights={7}
            name="Antiga Casa Pessoa"
            beds={6}
            checkIn="15:00"
            coming={6}
            share={105000}
            paid={false}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-caption-strong uppercase tracking-wide text-ink-muted">
            Attendee rows
          </h2>
          <ul>
            <AttendeeRow id="ari" name="You" status="yes" />
            <AttendeeRow id="aylin" name="Aylin Kaya" status="pending" />
            <AttendeeRow
              id="ren"
              name="Ren Lindqvist"
              sublabel="Guest"
              status="pending"
            />
            <AttendeeRow
              id="jon"
              name="Jon Cohen"
              trailing={<Button theme="secondary">Add to trip</Button>}
            />
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-caption-strong uppercase tracking-wide text-ink-muted">
            Poll options (extrapolated from wireflow 06)
          </h2>
          <div className="flex flex-col gap-2">
            {options.map((label, i) => (
              <PollOptionRow
                key={label}
                label={label}
                votes={votes[i]}
                totalVotes={total}
                leading={votes[i] === max && max > 0}
                selected={selected === i}
                onSelect={() => setSelected(selected === i ? null : i)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button theme="secondary" onClick={() => setVoteStep(0)}>
              Restart votes
            </Button>
            <Button
              theme="light"
              onClick={() =>
                setVoteStep((s) => Math.min(s + 1, VOTE_SEQUENCE.length - 1))
              }
            >
              Next vote
            </Button>
          </div>
        </section>
      </div>
    </Screen>
  );
}
