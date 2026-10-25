import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

// Back control for white screens (the map header uses the white-circle asset).
export function BackButton({
  href,
  label = "Back",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="tap-target flex size-10 items-center justify-center rounded-pill bg-off-white text-gunmetal transition active:scale-press"
    >
      <Icon name="arrow-right" className="rotate-180" />
    </Link>
  );
}
