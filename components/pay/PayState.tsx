import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type PayStateProps = {
  paid: boolean;
  onPay?: () => void;
  // Activity cards (lilac) use the white button; the stay card (lime) the
  // gunmetal one, as in the hi-fi Trip view.
  theme?: "dark" | "light";
};

// Itinerary / stay card payment state: "Pay share" (action) or "Paid ✓" (state).
export function PayState({ paid, onPay, theme = "dark" }: PayStateProps) {
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
