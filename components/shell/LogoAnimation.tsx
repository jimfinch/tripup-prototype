"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
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

// True only in the browser (false while rendering the static HTML).
const noopSubscribe = () => () => {};

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
  // The motion preference is only known in the browser, so the first render
  // (and the static HTML) shows the empty tile; deciding before mount made
  // the markup differ from the server's (React hydration error #418).
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const reduceMotion = mounted && !!prefersReduced;
  const animate = mounted && !reduceMotion;
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const fallback = reduceMotion || timedOut;
  const { RiveComponent } = useRive(
    !animate
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
    if (!mounted) return;
    if (reduceMotion) {
      onReady();
      return;
    }
    const t = setTimeout(() => {
      setTimedOut(true);
      onReady();
    }, FALLBACK_MS);
    return () => clearTimeout(t);
  }, [mounted, reduceMotion, onReady]);

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
      {animate && (
        <RiveComponent
          aria-hidden
          className={ready ? "absolute size-18" : "absolute size-18 opacity-0"}
        />
      )}
    </span>
  );
}
