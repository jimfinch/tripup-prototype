"use client";

import type { ReactNode, UIEvent } from "react";
import { TabBar } from "@/components/shell/TabBar";
import { cn } from "@/lib/cn";

type ScreenProps = {
  children: ReactNode;
  // Sheets, floating nav and other overlays: rendered outside the scroll area
  // so they stay pinned to the frame.
  overlays?: ReactNode;
  tabBar?: boolean;
  onScroll?: (e: UIEvent<HTMLElement>) => void;
  className?: string;
};

// One app screen inside the device frame. Content scrolls inside the frame;
// the tab bar floats over it.
export function Screen({
  children,
  overlays,
  tabBar = false,
  onScroll,
  className,
}: ScreenProps) {
  return (
    <div className="absolute inset-0">
      <main
        onScroll={onScroll}
        className={cn(
          "no-scrollbar h-full overflow-y-auto overscroll-contain",
          className,
        )}
      >
        {children}
      </main>
      {tabBar && <TabBar />}
      {overlays}
    </div>
  );
}
