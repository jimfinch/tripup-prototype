import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  // Visually hide the label (it stays for screen readers).
  hideLabel?: boolean;
  trailing?: ReactNode;
};

// Pill text input in the hi-fi style (wireflow form fields).
export function TextField({
  label,
  hideLabel,
  trailing,
  className,
  id,
  ...input
}: TextFieldProps) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={inputId}
        className={cn("text-title-m text-gunmetal", hideLabel && "sr-only")}
      >
        {label}
      </label>
      <div className="flex h-12 items-center gap-2 rounded-pill border border-gunmetal/15 bg-white px-5 focus-within:border-gunmetal">
        <input
          id={inputId}
          {...input}
          className="min-w-0 flex-1 truncate bg-transparent text-headline text-gunmetal outline-none placeholder:text-ink-muted"
        />
        {trailing}
      </div>
    </div>
  );
}
