"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { GUIDES_KEY, STEPS_KEY, useScenario } from "@/store/scenario";
import { cn } from "@/lib/cn";
import { DemoExtras, DemoPanel } from "@/components/shell/DemoPanel";
import { HomeIndicator } from "@/components/shell/HomeIndicator";
import { SceneCard } from "@/components/shell/SceneCard";
import { Splash } from "@/components/shell/Splash";
import { StatusBar } from "@/components/shell/StatusBar";
import { Toast } from "@/components/ui/Toast";

// Desktop: a 430 × 932 phone frame centred on the backdrop, demo panel to the
// left. Phone (≤ 430 px): full-bleed, no frame, no panel. Never scaled.
export function DeviceShell({ children }: { children: ReactNode }) {
  const setGuides = useScenario((s) => s.setGuides);
  const setShowSteps = useScenario((s) => s.setShowSteps);
  const splash = useScenario((s) => s.splash);

  // Restore the reviewer's demo-panel choices (per browser).
  useEffect(() => {
    try {
      if (localStorage.getItem(GUIDES_KEY) === "on") setGuides(true);
      if (localStorage.getItem(STEPS_KEY) === "off") setShowSteps(false);
    } catch {
      // Storage unavailable: hints stay off.
    }
  }, [setGuides, setShowSteps]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh framed:grid framed:place-items-center framed:p-10 panel:grid-cols-[1fr_auto_1fr] panel:gap-16">
        <DemoPanel className="hidden justify-self-end panel:block" />
        {/* transform-gpu puts the screen on one compositing layer, so its
            rounded corner is clipped once rather than per stacked layer (which
            left a hairline of the page under the splash). */}
        <div className="relative isolate h-dvh w-full overflow-hidden bg-white framed:h-device-h framed:w-device-w framed:shrink-0 framed:transform-gpu framed:rounded-device framed:bg-bezel framed:shadow-device">
          {/* Hidden behind the splash so it can't bleed through the anti-aliased
              corner; it reappears as the splash starts to fade. */}
          <div className={cn("absolute inset-0", splash && "invisible")}>
            {children}
          </div>
          <StatusBar />
          <HomeIndicator />
          <Toast />
          <SceneCard />
          <Splash />
        </div>
        <DemoExtras className="hidden w-full max-w-72 justify-self-start panel:block" />
      </div>
    </MotionConfig>
  );
}
