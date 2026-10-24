import { cn } from "@/lib/cn";

type StatusScrimProps = {
  // Violet only on screens with the coloured (violet) background; white elsewhere.
  tone?: "white" | "violet";
  visible?: boolean;
};

// Fade behind the status bar so the clock stays legible over scrolling content.
// Same height as the status bar: colour at 100% at the top to 0% at the bottom.
export function StatusScrim({
  tone = "white",
  visible = true,
}: StatusScrimProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 h-status-bar transition-opacity duration-200",
        tone === "violet" ? "bg-status-scrim-violet" : "bg-status-scrim-white",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
