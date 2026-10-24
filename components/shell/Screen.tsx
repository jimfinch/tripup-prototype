"use client";

import { useEffect, useRef, type ReactNode, type UIEvent } from "react";
import { TabBar } from "@/components/shell/TabBar";
import { cn } from "@/lib/cn";

type ScreenProps = {
  children: ReactNode;
  // Sheets, floating nav and other overlays: rendered outside the scroll area
  // so they stay pinned to the frame.
  overlays?: ReactNode;
  tabBar?: boolean;
  onScroll?: (e: UIEvent<HTMLElement>) => void;
  // Scroll back to the top whenever this changes (e.g. the story switches phone).
  scrollKey?: string;
  className?: string;
};

// One app screen inside the device frame. Content scrolls inside the frame;
// the tab bar floats over it.
export function Screen({
  children,
  overlays,
  tabBar = false,
  onScroll,
  scrollKey,
  className,
}: ScreenProps) {
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    if (scrollKey !== undefined) main.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  return (
    <div className="absolute inset-0">
      <main
        ref={main}
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
