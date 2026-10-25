import { TripClosedPollsView } from "@/components/poll/TripPollsView";

export function generateStaticParams() {
  return [{ tripId: "lisbon" }];
}

export default function TripClosedPollsPage() {
  return <TripClosedPollsView />;
}
