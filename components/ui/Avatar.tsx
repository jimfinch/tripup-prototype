import Image from "next/image";
import { PEOPLE, type PersonId } from "@/data/seed";
import { cn } from "@/lib/cn";

type AvatarProps = {
  id: PersonId;
  // Dimmed = excluded from a bill item (step 08).
  dimmed?: boolean;
  className?: string;
};

// Figma "Avatar": 32 px photo with a 2 px near-white ring and soft shadow.
export function Avatar({ id, dimmed, className }: AvatarProps) {
  const person = PEOPLE[id];
  return (
    <span
      className={cn(
        "relative block size-8 shrink-0 overflow-hidden rounded-pill border-2 border-avatar-ring bg-white shadow-avatar transition-opacity duration-150",
        dimmed && "opacity-30 grayscale",
        className,
      )}
    >
      <Image
        src={person.avatar}
        alt={person.name}
        fill
        sizes="32px"
        className="object-cover"
      />
    </span>
  );
}

type AvatarStackProps = {
  ids: PersonId[];
  // Extra people not shown as avatars, rendered as "+N".
  overflow?: number;
  tone?: "light" | "dark";
  className?: string;
};

// Overlapping avatars (-6 px) followed by an optional "+N".
export function AvatarStack({
  ids,
  overflow = 0,
  tone = "light",
  className,
}: AvatarStackProps) {
  return (
    <span className={cn("flex items-center gap-1", className)}>
      <span className="flex items-center">
        {ids.map((id, i) => (
          <Avatar
            key={id}
            id={id}
            className={cn(i < ids.length - 1 && "-mr-1.5")}
          />
        ))}
      </span>
      {overflow > 0 && (
        <span
          className={cn(
            "text-body-s",
            tone === "dark" ? "text-white" : "text-ink-muted",
          )}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
