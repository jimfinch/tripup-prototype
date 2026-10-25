import { Icon } from "@/components/ui/Icon";

type ReceiptTileProps = {
  label: string;
  icon: "receipt" | "drinks";
  onOpen: () => void;
};

// A scanned receipt on an activity; tapping it opens the receipt.
export function ReceiptTile({ label, icon, onOpen }: ReceiptTileProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${label.toLowerCase()} receipt`}
      className="flex h-22 flex-col items-center justify-center gap-2 rounded-md bg-off-white text-label text-gunmetal transition active:scale-press"
    >
      <Icon framed name={icon} />
      {label}
    </button>
  );
}
