import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  // Right-hand "See all →" link, or plain meta text such as "1 stay".
  href?: string;
  linkLabel?: string;
  meta?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  href,
  linkLabel = "See all",
  meta,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-title-m text-gunmetal">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="tap-target flex items-center gap-1.5 text-label text-gunmetal transition-opacity active:opacity-60"
        >
          {linkLabel}
          <Icon name="arrow-right" className="size-5" />
        </Link>
      ) : (
        meta && <span className="text-body-s text-ink-muted">{meta}</span>
      )}
    </div>
  );
}
