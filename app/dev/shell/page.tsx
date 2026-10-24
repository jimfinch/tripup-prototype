"use client";

import { useState } from "react";
import { Screen } from "@/components/shell/Screen";
import { Sheet } from "@/components/ui/Sheet";
import { useScenario } from "@/store/scenario";

// Hidden review page for the Phase 2 shell pieces.
export default function ShellPreviewPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const showToast = useScenario((s) => s.showToast);
  const goToStep = useScenario((s) => s.goToStep);
  const reset = useScenario((s) => s.reset);

  const actions = [
    { label: "Open sheet", run: () => setSheetOpen(true) },
    {
      label: "Show toast",
      run: () => showToast("‘Belcanto’ won - added to itinerary"),
    },
    { label: "Scene card (step 05)", run: () => goToStep(5) },
    { label: "Scene card (step 08)", run: () => goToStep(8) },
    { label: "Show splash", run: reset },
  ];

  return (
    <Screen
      tabBar
      className="bg-off-white"
      overlays={
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Invite people"
        >
          <div className="flex flex-col gap-3">
            <p className="text-body-s text-ink-muted">
              Sample sheet content. Drag the header down, tap the backdrop,
              press Escape or ✕ to close.
            </p>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="rounded-md bg-lilac p-4 text-headline">
                Row {i + 1}
              </div>
            ))}
          </div>
        </Sheet>
      }
    >
      <div className="px-4 pb-39 pt-status-bar">
        <h1 className="pt-6 text-title-l">Shell preview</h1>
        <p className="mt-2 text-body-s text-ink-muted">
          Phase 2 review: overlays and chrome.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.run}
              className="flex h-12 items-center justify-between rounded-pill bg-gunmetal pl-6 pr-4 text-headline text-white active:opacity-80"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}
