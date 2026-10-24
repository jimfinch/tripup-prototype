"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { HomeIndicator } from "@/components/shell/HomeIndicator";
import { LogoAnimation } from "@/components/shell/LogoAnimation";
import { useScenario } from "@/store/scenario";

// Counted from when the logo animation is ready, long enough for its full
// intro + idle cycle (designer asked for 2.5 s; CLAUDE.md said ~1.5 s).
const SPLASH_MS = 2500;

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

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-gunmetal"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Skip loading screen"
        className="flex size-full flex-col items-center gap-5 px-4 pb-20 text-white"
      >
        <span className="flex flex-1 flex-col items-center justify-center gap-5">
          <LogoAnimation onReady={start} />
          <span className="text-display">TripUp</span>
          <span className="text-body text-white/60">
            Plan it. Vote on it. Split it.
          </span>
        </span>
        <span className="flex flex-col items-center gap-2">
          <span className="block h-1 w-48 overflow-hidden rounded-indicator bg-white/25">
            <motion.span
              className="block h-full rounded-indicator bg-lime"
              initial={{ width: "0%" }}
              animate={{ width: started ? "100%" : "0%" }}
              transition={{ duration: SPLASH_MS / 1000, ease: "easeInOut" }}
            />
          </span>
          <span className="text-caption text-white/60">
            Getting your trips...
          </span>
        </span>
      </button>
      <HomeIndicator tone="light" />
    </motion.div>
  );
}
