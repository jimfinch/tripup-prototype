import { Toggle } from "@/components/ui/Toggle";

// "Send poll to guests ⏽" style row.
export function ToggleRow({
  label,
  checked,
  onChange,
  className,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <span className="text-body-s text-ink-muted">{label}</span>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </div>
  );
}
