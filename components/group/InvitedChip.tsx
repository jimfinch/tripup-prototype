import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

// Replaces "Add to trip / group" once someone has been invited.
export function InvitedChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-pill bg-gunmetal pl-4.5 pr-4 text-label text-white",
        className,
      )}
    >
      Invited
      <Icon framed name="check" size={20} />
    </span>
  );
}
