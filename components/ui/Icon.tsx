import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// Single-colour Figma icons (Sample System › Icons), recoloured with a CSS mask
// so the exported SVGs stay untouched. Each SVG is the glyph only, and the
// element is sized to the glyph itself (e.g. check = 20 × 15 at the default
// 24 px icon size). `size` is the Figma icon frame the glyph sits in (24, or
// 20 inside medium buttons); the glyph scales with it.
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
  pizza: [18, 18],
  plus: [24, 24],
  poll: [17, 20],
  receipt: [18, 15],
  search: [18, 18],
  share: [16.5, 19.5],
  copy: [18, 18],
  trash: [17, 18],
} as const;

const BOX = 24;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: 16 | 18 | 20 | 22 | 24;
  // Keep the Figma icon frame (size × size) around the glyph, so buttons and
  // rows lay out exactly as in Figma.
  framed?: boolean;
  // Explicit glyph width in px; height follows the glyph's proportions.
  width?: number;
  className?: string;
};

export function Icon({
  name,
  size = BOX,
  framed = false,
  width,
  className,
}: IconProps) {
  const [w, h] = ICONS[name];
  const scale = width ? width / w : size / BOX;
  const mask = `url(/icons/${name}.svg)`;
  const style: CSSProperties = {
    width: w * scale,
    height: h * scale,
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  const glyph = (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", !framed && className)}
      style={style}
    />
  );

  if (!framed) return glyph;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {glyph}
    </span>
  );
}
