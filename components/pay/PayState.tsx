import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type PayStateProps = {
  paid: boolean;
  onPay?: () => void;
  // Unpaid cards are lime, so the gunmetal button by default (hi-fi Trip view).
  theme?: "dark" | "light";
};

// Itinerary / stay card payment state: "Pay share" (action) or "Paid ✓" (state).
export function PayState({ paid, onPay, theme = "light" }: PayStateProps) {
  if (paid) {
    return (
      <span className="inline-flex h-10 items-center gap-1.5 rounded-pill bg-white px-4.5 text-label text-gunmetal">
        Paid
        <Icon framed name="check" size={20} />
      </span>
    );
  }
  return (
    <Button
      theme={theme}
      onClick={onPay}
      rightIcon={<Icon framed name="card" size={20} />}
    >
      Pay share
    </Button>
  );
}
