"use client";

import Image from "next/image";
import { useCurrentStep } from "@/store/scenario";
import { cn } from "@/lib/cn";

type StatusBarProps = {
  tone?: "dark" | "light";
};

// Fake iOS status bar (Figma "Status Bar - iPhone"). Shows the scenario clock,
// not the real time. Only drawn inside the desktop phone frame.
export function StatusBar({ tone = "dark" }: StatusBarProps) {
  const { clock } = useCurrentStep();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden items-center justify-between px-9 py-1.5 framed:flex"
    >
      <div className="flex h-5.5 w-status-slot items-center pt-0.5">
        <span
          className={cn(
            "font-system text-status-time",
            tone === "dark" ? "text-black" : "text-white",
          )}
        >
          {clock}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center py-2">
        <div className="relative h-9 w-island rounded-island bg-black">
          <Image
            src="/brand/island-lens.svg"
            alt=""
            width={11}
            height={11}
            className="absolute right-4 top-3"
          />
        </div>
      </div>
      <Image
        src={
          tone === "dark"
            ? "/brand/status-levels-dark.svg"
            : "/brand/status-levels-light.svg"
        }
        alt=""
        width={86}
        height={22}
      />
    </div>
  );
}
