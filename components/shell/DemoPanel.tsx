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
    <aside
      aria-label="Demo guide"
      className={cn("w-72 text-gunmetal", className)}
    >
      <p className="text-caption-strong uppercase tracking-wide text-ink-muted">
        TripUp prototype
      </p>
      <h1 className="mt-1 text-title-m">Last night in Lisbon</h1>

      <p className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 text-label shadow-tab-bar">
        <span aria-hidden className="size-2 rounded-pill bg-violet" />
        {PHONE_LABEL[current.phone]}
        <span className="text-body-s text-ink-muted">· {current.clock}</span>
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
                    ? "bg-white shadow-tab-bar"
                    : "hover:bg-white/60 active:bg-white",
                )}
              >
                <span
                  className={cn(
                    "w-6 text-label",
                    active ? "text-violet" : "text-ink-muted",
                  )}
                >
                  {String(step.id).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-body-s",
                    active ? "text-label" : "text-ink-muted",
                  )}
                >
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 flex h-10 items-center rounded-pill border border-gunmetal px-4.5 text-label transition-colors duration-150 hover:bg-white active:bg-gunmetal active:text-white"
      >
        Reset demo
      </button>
    </aside>
  );
}
