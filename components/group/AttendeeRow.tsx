import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Check } from "@/components/ui/Check";
import type { PersonId } from "@/data/seed";

type AttendeeRowProps = {
  id: PersonId;
  name: string;
  sublabel?: string;
  status?: "yes" | "pending";
  // Replaces the status (e.g. an "Add to trip" button on the invite sheet).
  trailing?: ReactNode;
};

// Figma "Atendee List Item".
export function AttendeeRow({
  id,
  name,
  sublabel,
  status,
  trailing,
}: AttendeeRowProps) {
  return (
    <li className="flex items-center justify-between border-b border-gunmetal/10 py-3">
      <div className="flex items-center gap-2">
        <Avatar id={id} />
        <div>
          <p className="text-headline text-gunmetal">{name}</p>
          {sublabel && <p className="text-body-s text-ink-muted">{sublabel}</p>}
        </div>
      </div>
      {trailing ??
        (status && (
          <div className="flex items-center gap-2">
            <span className="text-body-s text-ink-muted">
              {status === "yes" ? "Yes" : "Pending"}
            </span>
            <Check state={status} />
          </div>
        ))}
    </li>
  );
}
