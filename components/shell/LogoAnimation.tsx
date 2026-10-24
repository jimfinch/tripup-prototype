"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
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

// Designer's animated TripUp palm (public/rive/tripup_logo.riv): "Intro"
// (island draws in, palm grows) then "Idle", driven by "State Machine 1".
// The tile stays empty until it's ready so the intro plays from the start.
// Reduced motion, or a slow load, gets the static palm.
export function LogoAnimation({ onReady }: { onReady: () => void }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const fallback = reduceMotion || timedOut;
  const { RiveComponent } = useRive(
    reduceMotion
      ? null
      : {
          src: "/rive/tripup_logo.riv",
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
    <span className="relative flex size-33 items-center justify-center rounded-island bg-white/10">
      {fallback && !ready && (
        <Image src="/icons/tripup.svg" alt="" width={72} height={72} priority />
      )}
      {!reduceMotion && (
        <RiveComponent
          aria-hidden
          className={ready ? "absolute size-18" : "absolute size-18 opacity-0"}
        />
      )}
    </span>
  );
}
