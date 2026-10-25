"use client";

import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { UpcomingTripCard } from "@/components/trip/UpcomingTripCard";
import { BackButton } from "@/components/ui/BackButton";
import { LISBON } from "@/data/seed";
import { useScenario } from "@/store/scenario";

// Home › Past trips. Not designed; built from the trip card. Lisbon moves here
// once Ari has settled (Home then leads with Milan), so there's a way back to
// it from inside the phone.
export function PastTripsView() {
  const settled = useScenario((s) => s.settled);
  const members = useScenario((s) => s.members);
  const coming = members.filter((m) => m.status === "yes").length;

  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="relative mt-2 flex h-10 items-center justify-center">
          <div className="absolute left-0">
            <BackButton href="/" label="Back to Home" />
          </div>
          <h1 className="text-title-m text-gunmetal">Past trips</h1>
        </div>
        {settled ? (
          <UpcomingTripCard
            trip={{
              id: LISBON.id,
              name: LISBON.name,
              dates: LISBON.dates,
              image: LISBON.image,
              organiser: LISBON.organiser,
              avatars: LISBON.cardAvatars,
              overflow: Math.max(0, coming - LISBON.cardAvatars.length),
            }}
          />
        ) : (
          <p className="rounded-md bg-lilac p-4 text-body-s text-ink-muted">
            No past trips yet. Lisbon moves here once you’ve settled up.
          </p>
        )}
      </div>
    </Screen>
  );
}
