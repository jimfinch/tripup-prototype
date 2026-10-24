import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

// Figma "Button" (Sample System). Theme names follow Figma, which names them
// by the surface they sit on: "dark" is the white button used on dark cards,
// "light" is the gunmetal button used on light surfaces.
export type ButtonTheme =
  "dark" | "light" | "primary" | "outline" | "secondary";
export type ButtonSize = "md" | "lg" | "xl";

const THEME: Record<ButtonTheme, string> = {
  dark: "bg-white text-gunmetal",
  light: "bg-gunmetal text-white",
  primary: "bg-lime text-gunmetal",
  outline: "border border-gunmetal text-gunmetal",
  secondary: "bg-off-white text-gunmetal",
};

const SIZE: Record<Exclude<ButtonSize, "xl">, string> = {
  md: "tap-target h-10 gap-1.5 px-4.5 text-label",
  lg: "h-12 gap-1.5 px-4.5 text-title-s",
};

// The extra-large button ends in a circle holding the arrow.
const XL_CIRCLE: Record<ButtonTheme, string> = {
  dark: "bg-gunmetal text-white",
  light: "bg-white text-gunmetal",
  primary: "bg-gunmetal text-lime",
  outline: "bg-gunmetal text-white",
  secondary: "bg-gunmetal text-white",
};

type CommonProps = {
  theme?: ButtonTheme;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };
type ButtonAsLink = CommonProps & { href: string; disabled?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  theme = "light",
  size = "md",
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  children,
  ...native
}: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center rounded-pill transition duration-150 active:scale-press disabled:pointer-events-none disabled:opacity-40",
    THEME[theme],
    size === "xl"
      ? "h-16 w-full gap-4 py-1.5 pl-6 pr-1.5 text-title-s"
      : cn(
          "justify-center",
          SIZE[size],
          theme === "light" && !!rightIcon && "pr-4",
        ),
    fullWidth && "w-full",
    className,
  );

  const content =
    size === "xl" ? (
      <>
        <span className="flex-1 text-left">{children}</span>
        <span
          className={cn(
            "flex h-full w-13 items-center justify-center rounded-pill",
            XL_CIRCLE[theme],
          )}
        >
          {rightIcon ?? <Icon name="arrow-right" />}
        </span>
      </>
    ) : (
      <>
        {leftIcon}
        <span className="whitespace-nowrap">{children}</span>
        {rightIcon}
      </>
    );

  if (native.href !== undefined) {
    return (
      <Link href={native.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" {...native} className={classes}>
      {content}
    </button>
  );
}
