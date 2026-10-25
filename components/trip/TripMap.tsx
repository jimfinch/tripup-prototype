"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { ACTIVITIES } from "@/data/seed";

// Map crop from the hi-fi Trip view (430 × 500 frame).
const MAP_CROP: CSSProperties = {
  left: "-124.89%",
  top: "-67.14%",
  width: "314.42%",
  height: "209.08%",
};

// Pin boxes (40 × 40) from the hi-fi; the exported pin (with pointer and
// shadow) is 48 × 59, offset 4 px left. Each opens its activity.
const PINS = [
  { id: "tasca", kind: "dinner", x: 79, y: 200 },
  { id: "ramiro", kind: "dinner", x: 133, y: 102 },
  { id: "eurico", kind: "dinner", x: 264, y: 195 },
  { id: "pigmeu", kind: "stay", x: 195, y: 75 },
] as const;

const COLLAPSED_H = 500;
// Expanded: the map zooms around Lisbon's centre and shifts down, so
// the city (not the river) fills the screen with the pins mid-screen.
const ZOOM = { scale: 1.4, originX: 215, originY: 120, shiftY: 180 };
// Sharp iOS-style ease-out: fast start, short settle.
export const GROW = { duration: 0.3, ease: [0.32, 0.72, 0, 1] } as const;
const ZOOM_EASE = { duration: 0.35, ease: [0.32, 0.72, 0, 1] } as const;

const zoomed = (x: number, y: number) => ({
  x: ZOOM.originX + (x - ZOOM.originX) * ZOOM.scale,
  y: ZOOM.originY + (y - ZOOM.originY) * ZOOM.scale + ZOOM.shiftY,
});

type TripMapProps = {
  backHref: string;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onPin: (activityId: string) => void;
};

// Hi-fi Trip view map header. Tapping it zooms the map slowly to full screen
// (Working "Trip view - Map expanded"); pins open their activities; the
// minimise button reverses the animation.
export function TripMap({
  backHref,
  expanded,
  onExpand,
  onCollapse,
  onPin,
}: TripMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState(932);
  useLayoutEffect(() => {
    const main = ref.current?.closest("main");
    if (main) setFullHeight(main.clientHeight);
  }, [expanded]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      initial={false}
      animate={{
        height: expanded ? fullHeight : COLLAPSED_H,
        marginBottom: expanded ? 0 : -140,
      }}
      transition={GROW}
    >
      <motion.div
        aria-hidden
        className="absolute left-0 top-0 h-map-h w-full"
        style={{ transformOrigin: `${ZOOM.originX}px ${ZOOM.originY}px` }}
        initial={false}
        animate={{
          scale: expanded ? ZOOM.scale : 1,
          y: expanded ? ZOOM.shiftY : 0,
        }}
        transition={ZOOM_EASE}
      >
        <Image
          src="/map/lisbon.jpg"
          alt=""
          width={2700}
          height={2087}
          className="absolute max-w-none"
          style={MAP_CROP}
          priority
        />
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-map-h bg-map-fade"
      />

      {!expanded && (
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand map"
          className="absolute inset-0 cursor-zoom-in"
        />
      )}

      {PINS.map((pin) => {
        const at = expanded
          ? zoomed(pin.x + 20, pin.y + 48)
          : { x: pin.x + 20, y: pin.y + 48 };
        const title = ACTIVITIES.find((a) => a.id === pin.id)?.title ?? pin.id;
        return (
          <motion.button
            key={pin.id}
            type="button"
            onClick={() => onPin(pin.id)}
            aria-label={`Open ${title}`}
            className="absolute left-0 top-0 transition-transform active:scale-press"
            initial={false}
            animate={{ x: at.x - 24, y: at.y - 48 }}
            transition={ZOOM_EASE}
          >
            <Image
              src={`/map/pin-${pin.kind}.svg`}
              alt=""
              width={48}
              height={59}
            />
          </motion.button>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-status-bar">
        <Link
          href={backHref}
          aria-label="Back"
          className="tap-target pointer-events-auto rounded-pill transition active:scale-press"
        >
          <Image src="/icons/back-button.svg" alt="" width={40} height={40} />
        </Link>
        {expanded ? (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Minimise map"
            className="tap-target pointer-events-auto flex size-10 items-center justify-center rounded-pill bg-white text-gunmetal transition active:scale-press"
          >
            <Icon name="arrows-in" />
          </button>
        ) : (
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-pill bg-white text-gunmetal"
          >
            <Icon framed name="kebab" />
          </span>
        )}
      </div>
    </motion.div>
  );
}
