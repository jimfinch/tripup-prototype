import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type PayStateProps = {
  paid: boolean;
  onPay?: () => void;
};

// Itinerary / stay card payment state: "Pay share" (action) or "Paid ✓" (state).
export function PayState({ paid, onPay }: PayStateProps) {
  if (paid) {
    return (
      <span className="inline-flex h-10 items-center gap-1.5 rounded-pill bg-white px-4.5 text-label text-gunmetal">
        Paid
        <Icon name="check" className="size-5" />
      </span>
    );
  }
  return (
    <Button
      theme="light"
      onClick={onPay}
      rightIcon={<Icon name="card" className="size-5" />}
    >
      Pay share
    </Button>
  );
}
