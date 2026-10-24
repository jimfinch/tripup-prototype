"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { HomeIndicator } from "@/components/shell/HomeIndicator";
import { StatusBar } from "@/components/shell/StatusBar";
import { useScenario } from "@/store/scenario";

const SPLASH_MS = 1500;

// Working page "Loading screen", restyled in the hi-fi brand. Shown on first
// load and after Reset, for ~1.5 s or until tapped.
export function Splash() {
  const splash = useScenario((s) => s.splash);
  const dismiss = useScenario((s) => s.dismissSplash);

  useEffect(() => {
    if (!splash) return;
    const t = setTimeout(dismiss, SPLASH_MS);
    return () => clearTimeout(t);
  }, [splash, dismiss]);

  return (
    <AnimatePresence>
      {splash && (
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
              <Image
                src="/brand/logo-tile.svg"
                alt=""
                width={132}
                height={132}
                priority
              />
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
                  animate={{ width: "100%" }}
                  transition={{ duration: SPLASH_MS / 1000, ease: "easeInOut" }}
                />
              </span>
              <span className="text-caption text-white/60">
                Getting your trips...
              </span>
            </span>
          </button>
          <StatusBar tone="light" />
          <HomeIndicator tone="light" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
