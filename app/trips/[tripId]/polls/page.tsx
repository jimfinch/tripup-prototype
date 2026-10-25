import { TripPollsView } from "@/components/poll/TripPollsView";

export function generateStaticParams() {
  return [{ tripId: "lisbon" }];
}

export default function TripPollsPage() {
  return <TripPollsView />;
}
