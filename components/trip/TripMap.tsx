import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";

// Map crop and pin positions from the hi-fi Trip view (430 × 500 frame).
const MAP_CROP: CSSProperties = {
  left: "-124.89%",
  top: "-67.14%",
  width: "314.42%",
  height: "209.08%",
};

// Pin box is 40 × 40; the exported pin (with its pointer and shadow) is 48 × 59,
// offset 4 px left of the box.
const PINS = [
  { id: "tasca", kind: "dinner", x: 79, y: 200 },
  { id: "ramiro", kind: "dinner", x: 133, y: 102 },
  { id: "eurico", kind: "dinner", x: 264, y: 195 },
  { id: "pigmeu", kind: "stay", x: 195, y: 75 },
] as const;

// Hi-fi Trip view map header. Expansion and pin navigation come in Phase 6.
export function TripMap({ backHref }: { backHref: string }) {
  return (
    <div className="relative -mb-35 h-map-h overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/map/lisbon.jpg"
          alt=""
          width={2700}
          height={2087}
          className="absolute max-w-none"
          style={MAP_CROP}
          priority
        />
        <div className="absolute inset-0 bg-map-fade" />
      </div>
      {PINS.map((pin) => (
        <Image
          key={pin.id}
          src={`/map/pin-${pin.kind}.svg`}
          alt=""
          width={48}
          height={59}
          className="absolute"
          style={{ left: pin.x - 4, top: pin.y }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-status-bar">
        <Link
          href={backHref}
          aria-label="Back"
          className="tap-target rounded-pill transition active:scale-press"
        >
          <Image src="/icons/back-button.svg" alt="" width={40} height={40} />
        </Link>
        <span
          aria-hidden
          className="flex size-10 items-center justify-center rounded-pill bg-white text-gunmetal"
        >
          <Icon framed name="kebab" />
        </span>
      </div>
    </div>
  );
}
