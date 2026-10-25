import { ActivityEditView } from "@/components/activity/ActivityEditView";
import { ActivityReadOnlyView } from "@/components/activity/ActivityReadOnlyView";
import { ACTIVITIES, BELCANTO } from "@/data/seed";

export function generateStaticParams() {
  return [BELCANTO.id, ...ACTIVITIES.map((a) => a.id)].map((activityId) => ({
    tripId: "lisbon",
    activityId,
  }));
}

// Ari organises Belcanto (her poll), so she edits it; she's a participant in
// the rest, so they open read-only.
export default async function ActivityPage({
  params,
}: PageProps<"/trips/[tripId]/activities/[activityId]">) {
  const { activityId } = await params;
  if (activityId === BELCANTO.id) return <ActivityEditView />;
  return <ActivityReadOnlyView activityId={activityId} />;
}
