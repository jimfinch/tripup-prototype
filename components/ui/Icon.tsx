import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// Single-colour Figma icons, recoloured with a CSS mask so the exported SVGs
// stay untouched. `glyph` is the SVG's own size inside its Figma symbol box.
const ICONS = {
  search: { box: 22, glyph: [22, 22] },
  home: { box: 22, glyph: [22, 22] },
  poll: { box: 24, glyph: [17, 20] },
  card: { box: 24, glyph: [18, 14] },
  plus: { box: 24, glyph: [24, 24] },
  close: { box: 24, glyph: [15, 15] },
  check: { box: 16, glyph: [16, 16] },
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const { box, glyph } = ICONS[name];
  const mask = `url(/icons/${name}.svg)`;
  const size = `${(glyph[0] / box) * 100}% ${(glyph[1] / box) * 100}%`;
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
      className={cn("inline-block shrink-0 bg-current", className)}
      style={style}
    />
  );
}
