import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// Single-colour Figma icons (Sample System › Icons), recoloured with a CSS mask
// so the exported SVGs stay untouched. Each SVG is the glyph only; `glyph` is
// its size inside the 24 × 24 Figma symbol, so any rendered size keeps the
// symbol's proportions and padding.
const ICONS = {
  "arrow-right": [18, 15],
  "arrow-up-left": [13.5, 13.5],
  airplane: [20, 20],
  card: [18, 14],
  caret: [9, 16.5],
  check: [20, 15],
  close: [15, 15],
  "credit-card": [20, 14],
  dinner: [17, 18],
  drinks: [18, 18],
  kebab: [15, 2.25],
  lock: [18, 20],
  "map-pin": [15, 20],
  "pending-user": [18.85, 19.5],
  "people-add": [18, 18],
  pencil: [16, 16],
  plus: [24, 24],
  poll: [17, 20],
  receipt: [18, 15],
  search: [18, 18],
  trash: [17, 18],
} as const;

const BOX = 24;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const [w, h] = ICONS[name];
  const mask = `url(/icons/${name}.svg)`;
  const size = `${(w / BOX) * 100}% ${(h / BOX) * 100}%`;
  const style: CSSProperties = {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: size,
    WebkitMaskSize: size,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <span
      aria-hidden
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={style}
    />
  );
}
