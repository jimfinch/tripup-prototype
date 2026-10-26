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
  const resets = useScenario((s) => s.resets);

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
        {/* Bezel: a surround behind the screen plus a ring on top that
            underlaps the screen's edge by 2px, with a larger radius, so the
            screen's anti-aliased edge sits under solid bezel. */}
        <div className="framed:relative framed:shrink-0 framed:rounded-device-outer framed:border framed:border-white/12 framed:bg-bezel framed:p-2.5 framed:shadow-device">
          <div className="relative isolate h-dvh w-full overflow-hidden bg-white framed:h-device-h framed:w-device-w framed:transform-gpu framed:rounded-device">
            {/* Hidden behind the splash so it can't bleed through the anti-aliased
              corner; it reappears as the splash starts to fade. */}
            <div
              key={resets}
              className={cn("absolute inset-0", splash && "invisible")}
            >
              {children}
            </div>
            <StatusBar />
            <HomeIndicator />
            <Toast />
            <SceneCard />
            <Splash />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 hidden rounded-device-bezel border-4 border-bezel framed:block"
          />
        </div>
        <DemoExtras className="hidden w-full max-w-72 justify-self-start panel:block" />
      </div>
    </MotionConfig>
  );
}
