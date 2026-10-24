import { cn } from "@/lib/cn";

type HomeIndicatorProps = {
  tone?: "dark" | "light";
};

// iOS home indicator ("Drawer Indicator" in Figma). Desktop frame only.
export function HomeIndicator({ tone = "dark" }: HomeIndicatorProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-2 left-1/2 z-30 hidden h-indicator-h w-indicator -translate-x-1/2 rounded-indicator framed:block",
        tone === "dark" ? "bg-black/75" : "bg-white/75",
      )}
    />
  );
}
