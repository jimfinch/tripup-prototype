"use client";

import { useRouter } from "next/navigation";
import { PHONE_LABEL, STEPS, type StepId } from "@/data/steps";
import { useCurrentStep, useScenario } from "@/store/scenario";
import { cn } from "@/lib/cn";

// Desktop-only guide beside the phone. Lets a PM follow (and jump around)
// the scenario. Deliberately quiet; the phone is the focus.
export function DemoPanel({ className }: { className?: string }) {
  const router = useRouter();
  const current = useCurrentStep();
  const goToStep = useScenario((s) => s.goToStep);
  const reset = useScenario((s) => s.reset);

  const jump = (id: StepId) => {
    goToStep(id);
    router.push(STEPS[id - 1].route);
  };

  const onReset = () => {
    reset();
    router.push("/");
  };

  return (
    <aside aria-label="Demo guide" className={cn("w-72 text-white", className)}>
      <p className="text-caption-strong uppercase tracking-wide text-white/60">
        TripUp prototype
      </p>
      <h1 className="mt-1 text-title-m">Last night in Lisbon</h1>

      <p className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1.5 text-label">
        <span aria-hidden className="size-2 rounded-pill bg-violet" />
        {PHONE_LABEL[current.phone]}
        <span className="text-body-s text-white/60">· {current.clock}</span>
      </p>

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
                  "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left transition-colors duration-150",
                  active
                    ? "bg-white/10"
                    : "hover:bg-white/5 active:bg-white/10",
                )}
              >
                <span
                  className={cn(
                    "w-6 text-label",
                    active ? "text-violet" : "text-white/50",
                  )}
                >
                  {String(step.id).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-body-s",
                    active ? "text-label" : "text-white/60",
                  )}
                >
                  {step.title}
                </span>
              </button>
              {active && (
                <p className="px-3 pb-2 pl-12 pt-1 text-body-s text-white/80">
                  <span className="text-white/50">Next: </span>
                  <Emphasis text={step.next} />
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 flex h-10 items-center rounded-pill border border-white/30 px-4.5 text-label text-white transition-colors duration-150 hover:bg-white/10 active:bg-white active:text-gunmetal"
      >
        Reset demo
      </button>
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
