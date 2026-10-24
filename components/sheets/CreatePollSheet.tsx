"use client";

import { useState } from "react";
import { Segmented } from "@/components/form/Segmented";
import { TextField } from "@/components/form/TextField";
import { ToggleRow } from "@/components/form/ToggleRow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { CLOSE_IN_OPTIONS, DINNER_POLL_DRAFT, LISBON } from "@/data/seed";
import { useHint } from "@/lib/hints";
import { useScenario, type PollDraft } from "@/store/scenario";

// Step 04: New poll (wireflow "04: Create poll"). Pre-filled for the demo;
// every field stays editable.
export function CreatePollSheet({ open }: { open: boolean }) {
  const closeSheet = useScenario((s) => s.closeSheet);
  const createPoll = useScenario((s) => s.createPoll);
  const hint = useHint("create-poll");
  const [draft, setDraft] = useState<PollDraft>({ ...DINNER_POLL_DRAFT });

  const update = (patch: Partial<PollDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));
  const setOption = (i: number, value: string) =>
    update({ options: draft.options.map((o, j) => (j === i ? value : o)) });
  const canCreate =
    draft.question.trim() !== "" &&
    draft.options.filter((o) => o.trim() !== "").length >= 2;

  return (
    <Sheet
      open={open}
      onClose={closeSheet}
      title="New poll"
      footer={
        <Button
          theme="light"
          size="xl"
          className={hint}
          disabled={!canCreate}
          onClick={() =>
            createPoll({
              ...draft,
              options: draft.options.filter((o) => o.trim() !== ""),
            })
          }
        >
          Create poll
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-title-l text-gunmetal">Activity poll</p>
          <p className="text-body-s text-ink-muted">
            This poll will be sent to all invitees who have confirmed they are
            coming to {LISBON.name}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField
            label="Add question"
            value={draft.question}
            onChange={(e) => update({ question: e.target.value })}
          />
          <div className="flex items-center justify-between">
            <span className="text-body-s text-ink-muted">Date of activity</span>
            <span className="flex gap-2">
              <span className="flex h-10 items-center rounded-pill bg-off-white px-4.5 text-label text-gunmetal">
                {DINNER_POLL_DRAFT.date}
              </span>
              <span className="flex h-10 items-center rounded-pill bg-off-white px-4.5 text-label text-gunmetal">
                {DINNER_POLL_DRAFT.time}
              </span>
            </span>
          </div>
        </div>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-title-m text-gunmetal">
            Add options
          </legend>
          <div className="divide-y divide-gunmetal/15 overflow-hidden rounded-md border border-gunmetal/15">
            {draft.options.map((option, i) => (
              <label
                key={i}
                className="flex h-12 items-center gap-2 px-5 focus-within:bg-off-white"
              >
                <span className="sr-only">Option {i + 1}</span>
                <input
                  value={option}
                  onChange={(e) => setOption(i, e.target.value)}
                  className="min-w-0 flex-1 truncate bg-transparent text-headline text-gunmetal outline-none"
                />
                <Icon
                  framed
                  name="map-pin"
                  size={20}
                  className="text-gunmetal"
                />
              </label>
            ))}
          </div>
          <div>
            <Button
              theme="secondary"
              onClick={() => update({ options: [...draft.options, ""] })}
              rightIcon={<Icon framed name="plus" size={20} />}
            >
              Add option
            </Button>
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <ToggleRow
            label="Send poll to guests"
            checked={draft.sendToGuests}
            onChange={(v) => update({ sendToGuests: v })}
          />
          <ToggleRow
            label="Close poll automatically"
            checked={draft.closeAutomatically}
            onChange={(v) => update({ closeAutomatically: v })}
          />
          {draft.closeAutomatically && (
            <div className="flex flex-col gap-2">
              <span className="text-body-s text-ink-muted">Close in</span>
              <Segmented
                label="Close in"
                options={CLOSE_IN_OPTIONS}
                value={draft.closeIn}
                onChange={(v) => update({ closeIn: v })}
              />
            </div>
          )}
          <ToggleRow
            label="Allow multiple answers"
            checked={draft.multipleAnswers}
            onChange={(v) => update({ multipleAnswers: v })}
          />
        </div>
      </div>
    </Sheet>
  );
}
