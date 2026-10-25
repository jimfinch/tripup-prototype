"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { HomeIndicator } from "@/components/shell/HomeIndicator";
import { LogoAnimation } from "@/components/shell/LogoAnimation";
import { cn } from "@/lib/cn";
import { useScenario } from "@/store/scenario";

// Counted from when the logo animation is ready, long enough for its full
// intro + idle cycle (designer asked for 2.5 s; CLAUDE.md said ~1.5 s).
const SPLASH_MS = 2500;

// "light" = inverted (lime screen, gunmetal logo), being tried by the
// designer; "dark" = the original gunmetal screen.
const SPLASH_TONE: "dark" | "light" = "light";

// Working page "Loading screen", restyled in the hi-fi brand. Shown on first
// load and after Reset, for 2.5 s after the logo animation starts, or until
// tapped.
export function Splash() {
  const splash = useScenario((s) => s.splash);
  return <AnimatePresence>{splash && <SplashScreen />}</AnimatePresence>;
}

function SplashScreen() {
  const dismiss = useScenario((s) => s.dismissSplash);
  const [started, setStarted] = useState(false);
  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(dismiss, SPLASH_MS);
    return () => clearTimeout(t);
  }, [started, dismiss]);

  const dark = SPLASH_TONE === "dark";

  return (
    <motion.div
      className={cn("absolute inset-0 z-50", dark ? "bg-gunmetal" : "bg-lime")}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Skip loading screen"
        className={cn(
          "flex size-full flex-col items-center gap-5 px-4 pb-20",
          dark ? "text-white" : "text-gunmetal",
        )}
      >
        <span className="flex flex-1 flex-col items-center justify-center gap-5">
          <LogoAnimation onReady={start} tone={SPLASH_TONE} />
          <span className="text-display">TripUp</span>
          <span
            className={cn(
              "text-body",
              dark ? "text-white/60" : "text-ink-muted",
            )}
          >
            Plan it. Vote on it. Split it.
          </span>
        </span>
        <span className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "block h-1 w-48 overflow-hidden rounded-indicator",
              dark ? "bg-white/25" : "bg-gunmetal/25",
            )}
          >
            <motion.span
              className={cn(
                "block h-full rounded-indicator",
                dark ? "bg-lime" : "bg-gunmetal",
              )}
              initial={{ width: "0%" }}
              animate={{ width: started ? "100%" : "0%" }}
              transition={{ duration: SPLASH_MS / 1000, ease: "easeInOut" }}
            />
          </span>
          <span
            className={cn(
              "text-caption",
              dark ? "text-white/60" : "text-ink-muted",
            )}
          >
            Getting your trips...
          </span>
        </span>
      </button>
      <HomeIndicator tone={dark ? "light" : "dark"} />
    </motion.div>
  );
}
