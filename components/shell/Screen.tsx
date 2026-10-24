import type { ReactNode } from "react";
import { TabBar } from "@/components/shell/TabBar";
import { cn } from "@/lib/cn";

type ScreenProps = {
  children: ReactNode;
  // Sheets and other overlays: rendered outside the scroll area so they stay
  // pinned to the frame.
  overlays?: ReactNode;
  tabBar?: boolean;
  className?: string;
};

// One app screen inside the device frame. Content scrolls inside the frame;
// the tab bar floats over it.
export function Screen({
  children,
  overlays,
  tabBar = false,
  className,
}: ScreenProps) {
  return (
    <div className="absolute inset-0">
      <main
        className={cn(
          "no-scrollbar h-full overflow-y-auto overscroll-contain",
          tabBar && "pb-40",
          className,
        )}
      >
        {children}
      </main>
      {tabBar && <TabBar pollsDot paymentsDot />}
      {overlays}
    </div>
  );
}
