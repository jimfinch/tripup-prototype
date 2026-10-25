import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

// Group or past-trip image. The Working frames only have image placeholders,
// so until a photo is picked this is an on-brand tile with the image glyph.
export function GroupImage({
  src,
  className,
}: {
  src?: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex size-29 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white text-ink-muted",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="116px" className="object-cover" />
      ) : (
        <Icon name="image" />
      )}
    </span>
  );
}
