"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import {
  Layout,
  Fit,
  RuntimeLoader,
  useRive,
} from "@rive-app/react-canvas-lite";

// Serve the Rive engine (lite build, matches @rive-app/canvas-lite 2.45.1)
// from our own site instead of the CDN Rive defaults to.
RuntimeLoader.setWasmUrl("/rive/rive-lite.wasm");

// If the animation hasn't loaded by then, show the static palm instead.
const FALLBACK_MS = 1200;

// Designer's animated TripUp palm: "Intro" (island draws in, palm grows) then
// "Idle", driven by "State Machine 1". One file per splash tone.
const SRC = {
  dark: "/rive/tripup_logo.riv",
  light: "/rive/tripup_logo_gunmetal.riv",
} as const;

// The tile stays empty until it's ready so the intro plays from the start.
// Reduced motion, or a slow load, gets the static palm.
export function LogoAnimation({
  onReady,
  tone = "dark",
}: {
  onReady: () => void;
  // The surface it sits on: "dark" = white palm on gunmetal, "light" = gunmetal
  // palm on lime.
  tone?: "dark" | "light";
}) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const fallback = reduceMotion || timedOut;
  const { RiveComponent } = useRive(
    reduceMotion
      ? null
      : {
          src: SRC[tone],
          stateMachines: "State Machine 1",
          autoplay: true,
          layout: new Layout({ fit: Fit.Contain }),
          onLoad: () => {
            setReady(true);
            onReady();
          },
        },
  );

  useEffect(() => {
    if (reduceMotion) {
      onReady();
      return;
    }
    const t = setTimeout(() => {
      setTimedOut(true);
      onReady();
    }, FALLBACK_MS);
    return () => clearTimeout(t);
  }, [reduceMotion, onReady]);

  return (
    <span
      className={cn(
        "relative flex size-33 items-center justify-center rounded-island",
        tone === "dark"
          ? "bg-white/10 text-white"
          : "bg-gunmetal/10 text-gunmetal",
      )}
    >
      {fallback && !ready && <Icon name="tripup" width={72} />}
      {!reduceMotion && (
        <RiveComponent
          aria-hidden
          className={ready ? "absolute size-18" : "absolute size-18 opacity-0"}
        />
      )}
    </span>
  );
}
