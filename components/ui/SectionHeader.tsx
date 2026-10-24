import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  // Right-hand "See all →": a link, an action, or plain meta text ("1 stay").
  href?: string;
  onLink?: () => void;
  linkLabel?: string;
  meta?: ReactNode;
  className?: string;
};

const LINK_CLASS =
  "tap-target flex items-center gap-1.5 text-label text-gunmetal transition-opacity active:opacity-60";

export function SectionHeader({
  title,
  href,
  onLink,
  linkLabel = "See all",
  meta,
  className,
}: SectionHeaderProps) {
  const content = (
    <>
      {linkLabel}
      <Icon framed name="arrow-right" size={20} />
    </>
  );
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-title-m text-gunmetal">{title}</h2>
      {href ? (
        <Link href={href} className={LINK_CLASS}>
          {content}
        </Link>
      ) : onLink ? (
        <button type="button" onClick={onLink} className={LINK_CLASS}>
          {content}
        </button>
      ) : (
        meta && <span className="text-body-s text-ink-muted">{meta}</span>
      )}
    </div>
  );
}
