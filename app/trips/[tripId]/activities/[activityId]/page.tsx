import { ActivityEditView } from "@/components/activity/ActivityEditView";

export function generateStaticParams() {
  return [{ tripId: "lisbon", activityId: "belcanto" }];
}

export default function ActivityPage() {
  return <ActivityEditView />;
}
