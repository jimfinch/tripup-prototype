import { Icon, type IconName } from "@/components/ui/Icon";

type InlineNotificationProps = {
  icon?: IconName;
  lines: [string, string?];
  actionLabel: string;
  onAction?: () => void;
};

// Figma "Inline Notification", e.g. the Dubrovnik invite on Home.
export function InlineNotification({
  icon = "airplane",
  lines,
  actionLabel,
  onAction,
}: InlineNotificationProps) {
  return (
    <div className="flex items-center gap-6 rounded-md bg-lilac py-3 pl-4 pr-5">
      <div className="flex flex-1 items-center gap-2">
        <Icon name={icon} className="text-violet" />
        <p className="text-body-s text-gunmetal">
          {lines[0]}
          {lines[1] && (
            <>
              <br />
              {lines[1]}
            </>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="tap-target text-headline text-gunmetal transition-opacity active:opacity-60"
      >
        {actionLabel}
      </button>
    </div>
  );
}
