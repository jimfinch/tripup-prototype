"use client";

import { useRouter } from "next/navigation";
import { PHONE_LABEL, STEPS, type StepId } from "@/data/steps";
import { useCurrentStep, useScenario } from "@/store/scenario";
import { Icon } from "@/components/ui/Icon";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

const TRIP = "/trips/lisbon/";

// Added-value screens off the main path (mirrors the README). `needs` loads a
// step's state first when the screen only makes sense before or after settling.
const EXTRAS: readonly {
  title: string;
  hint: string;
  route: string;
  needs?: { settled: boolean; step: StepId };
}[] = [
  { title: "Expandable map", hint: "Tap the map, then a pin", route: TRIP },
  {
    title: "Polls across trips",
    hint: "Live polls by trip, then closed polls",
    route: "/polls/",
  },
  {
    title: "Groups",
    hint: "Open Intrepid travellers to manage it",
    route: "/groups/",
  },
  {
    title: "Pay as you go",
    hint: "Pay share on Pigmeu or the stay",
    route: TRIP,
    needs: { settled: false, step: 2 },
  },
  {
    title: "Participant view",
    hint: "Read-only, apart from Invite",
    route: `${TRIP}activities/tasca/`,
  },
  {
    title: "After the trip",
    hint: "Milan next, Lisbon in Past trips",
    route: "/",
    needs: { settled: true, step: 10 },
  },
];

// Desktop-only guide beside the phone. Lets a PM follow (and jump around)
// the scenario. Deliberately quiet; the phone is the focus.
export function DemoPanel({ className }: { className?: string }) {
  const router = useRouter();
  const current = useCurrentStep();
  const goToStep = useScenario((s) => s.goToStep);
  const reset = useScenario((s) => s.reset);
  const guides = useScenario((s) => s.guides);
  const setGuides = useScenario((s) => s.setGuides);
  const showSteps = useScenario((s) => s.showSteps);
  const setShowSteps = useScenario((s) => s.setShowSteps);

  const jump = (id: StepId) => {
    goToStep(id);
    router.push(STEPS[id - 1].route);
  };

  // Back to the start: step 01 on Home, fresh. Replace, so browser back
  // doesn't step into the old run.
  const onReset = () => {
    reset();
    router.replace("/");
  };

  return (
    <aside aria-label="Demo guide" className={cn("w-72 text-white", className)}>
      <p className="text-caption-strong uppercase tracking-wide text-white/60">
        TripUp prototype
      </p>
      <h1 className="mt-1 text-title-m">Last night in Lisbon</h1>

      <p className="mt-4 flex w-full items-center justify-between rounded-pill bg-white/10 px-3 py-1.5 text-label">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2 rounded-pill bg-lime" />
          {PHONE_LABEL[current.phone]}
        </span>
        <span className="text-body-s text-white/60">{current.clock}</span>
      </p>

      {showSteps && (
        <ol className="mt-6 flex flex-col gap-1">
          {STEPS.map((step) => {
            const active = step.id === current.id;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => jump(step.id)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors duration-150",
                    active
                      ? "bg-white/10"
                      : "hover:bg-white/5 active:bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "w-6 text-label",
                      active ? "text-lime" : "text-white/50",
                    )}
                  >
                    {String(step.id).padStart(2, "0")}
                  </span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span
                      className={cn(
                        "text-body-s",
                        active ? "text-label" : "text-white/60",
                      )}
                    >
                      {step.title}
                    </span>
                    {active && (
                      <span className="text-body-s text-white/80">
                        <span className="text-white/50">Next: </span>
                        <Emphasis text={step.next} />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-6 flex h-10 items-center gap-1.5 rounded-pill border border-white/30 pl-4.5 pr-4 text-label text-white transition-colors duration-150 hover:bg-white/10 active:bg-white active:text-gunmetal"
      >
        Reset demo
        <Icon framed name="refresh" size={20} />
      </button>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <p className="text-label text-white">Tap hints</p>
          <p className="text-body-s text-white/50">
            Highlight what to tap next
          </p>
        </div>
        <Toggle label="Show tap hints" checked={guides} onChange={setGuides} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-label text-white">Steps</p>
          <p className="text-body-s text-white/50">Show the scenario steps</p>
        </div>
        <Toggle
          label="Show scenario steps"
          checked={showSteps}
          onChange={setShowSteps}
        />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-caption-strong uppercase tracking-wide text-white/50">
          UX/UI Design
        </p>
        <p className="mt-1 text-label text-white">James Finch</p>
      </div>
    </aside>
  );
}

// Desktop-only, right of the phone: the added-value screens the ten steps
// don't reach (mirrors the README).
export function DemoExtras({ className }: { className?: string }) {
  const router = useRouter();
  const goToStep = useScenario((s) => s.goToStep);
  const settled = useScenario((s) => s.settled);

  const explore = (extra: (typeof EXTRAS)[number]) => {
    if (extra.needs && extra.needs.settled !== settled)
      goToStep(extra.needs.step);
    router.push(extra.route);
  };

  return (
    <aside
      aria-label="Beyond the scenario"
      className={cn("text-white", className)}
    >
      <h2 className="px-3 text-caption-strong uppercase tracking-wide text-white/60">
        Beyond the scenario
      </h2>
      <p className="mt-1 px-3 text-body-s text-white/50">
        Also built, off the main path
      </p>
      <ul className="mt-4 flex flex-col gap-1">
        {EXTRAS.map((extra) => (
          <li key={extra.title}>
            <button
              type="button"
              onClick={() => explore(extra)}
              className="flex min-h-11 w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors duration-150 hover:bg-white/5 active:bg-white/10"
            >
              <span className="text-body-s text-white/80">{extra.title}</span>
              <span className="text-body-s text-white/50">{extra.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Renders "**bold**" segments from the step's "next" hint.
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
