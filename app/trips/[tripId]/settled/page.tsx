import { SettledView } from "@/components/pay/SettledView";

export function generateStaticParams() {
  return [{ tripId: "lisbon" }];
}

export default function SettledPage() {
  return <SettledView />;
}
