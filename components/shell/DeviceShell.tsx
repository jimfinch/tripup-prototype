"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { DemoPanel } from "@/components/shell/DemoPanel";
import { HomeIndicator } from "@/components/shell/HomeIndicator";
import { SceneCard } from "@/components/shell/SceneCard";
import { Splash } from "@/components/shell/Splash";
import { StatusBar } from "@/components/shell/StatusBar";
import { Toast } from "@/components/ui/Toast";

// Desktop: a 430 × 932 phone frame centred on the backdrop, demo panel to the
// left. Phone (≤ 430 px): full-bleed, no frame, no panel. Never scaled.
export function DeviceShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh framed:grid framed:place-items-center framed:p-10 panel:grid-cols-[1fr_auto_1fr] panel:gap-16">
        <DemoPanel className="hidden justify-self-end panel:block" />
        <div className="relative isolate h-dvh w-full overflow-hidden bg-white framed:h-device-h framed:w-device-w framed:shrink-0 framed:rounded-device framed:shadow-device">
          {children}
          <StatusBar />
          <HomeIndicator />
          <Toast />
          <SceneCard />
          <Splash />
        </div>
        <div aria-hidden className="hidden panel:block" />
      </div>
    </MotionConfig>
  );
}
