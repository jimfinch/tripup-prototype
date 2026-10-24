import { cn } from "@/lib/cn";

type StatusScrimProps = {
  // Tint over the blur: white by default; "none" for blur only (Home).
  tone?: "white" | "violet" | "none";
  visible?: boolean;
};

// Soft scroll-edge effect behind the status bar (after iOS 26): content that
// scrolls under the bar is progressively blurred and lightly tinted, fading to
// sharp at the bar's bottom edge, so the clock stays legible without a band.
// Desktop frame only: on a real phone the browser/OS draws its own bar.
export function StatusScrim({
  tone = "white",
  visible = true,
}: StatusScrimProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "scroll-edge pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-status-bar transition-opacity duration-200 framed:block",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="scroll-edge-blur-1" />
      <span className="scroll-edge-blur-2" />
      <span className="scroll-edge-blur-3" />
      {tone !== "none" && (
        <span
          className={
            tone === "violet"
              ? "scroll-edge-tint-violet"
              : "scroll-edge-tint-white"
          }
        />
      )}
    </div>
  );
}
