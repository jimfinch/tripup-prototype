import { cn } from "@/lib/cn";

// "▤ Live polls" section heading with the three-bar poll mark (hi-fi Home).
export function PollsHeading({
  title,
  tone = "dark",
}: {
  title: string;
  tone?: "dark" | "light";
}) {
  const bar = tone === "light" ? "bg-white/50" : "bg-gunmetal/50";
  return (
    <div className="flex items-center gap-1.5">
      <span aria-hidden className="flex flex-col gap-0.5">
        <span className={cn("h-0.75 w-2 rounded-xs", bar)} />
        <span className={cn("h-0.75 w-4 rounded-xs", bar)} />
        <span className={cn("h-0.75 w-2.75 rounded-xs", bar)} />
      </span>
      <h2
        className={cn(
          "text-title-m",
          tone === "light" ? "text-white" : "text-gunmetal",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
