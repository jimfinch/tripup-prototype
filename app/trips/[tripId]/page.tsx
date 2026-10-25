import { ComingSoon } from "@/components/shell/ComingSoon";
import { PastTripsView } from "@/components/trip/PastTripsView";
import { TripView } from "@/components/trip/TripView";
import { UPCOMING_TRIPS } from "@/data/seed";

const OTHER_PAGES: Record<string, string> = {
  dubrovnik: "Dubrovnik",
  past: "Past trips",
  new: "New trip",
  ...Object.fromEntries(UPCOMING_TRIPS.map((t) => [t.id, t.name])),
};

export function generateStaticParams() {
  return ["lisbon", ...Object.keys(OTHER_PAGES)].map((tripId) => ({ tripId }));
}

export default async function TripPage({
  params,
}: PageProps<"/trips/[tripId]">) {
  const { tripId } = await params;
  if (tripId === "lisbon") return <TripView />;
  if (tripId === "past") return <PastTripsView />;
  return <ComingSoon title={OTHER_PAGES[tripId] ?? "Trip"} />;
}
