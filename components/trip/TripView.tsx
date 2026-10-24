"use client";

import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { ActivityCard } from "@/components/trip/ActivityCard";
import { StayCard } from "@/components/trip/StayCard";
import { TripHeaderCard } from "@/components/trip/TripHeaderCard";
import { TripMap } from "@/components/trip/TripMap";
import { TrippersCard } from "@/components/trip/TrippersCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LISBON } from "@/data/seed";
import { formatPence } from "@/lib/money";
import {
  selectLivePolls,
  selectPaymentsDue,
  selectSettleTotal,
  selectUnpaidActivityTotal,
  useScenario,
} from "@/store/scenario";

// 02 Trip view (hi-fi). Actions are wired to the scenario in Phase 5.
export function TripView() {
  const members = useScenario((s) => s.members);
  const activities = useScenario((s) => s.activities);
  const stay = useScenario((s) => s.stay);
  const livePolls = useScenario((s) => selectLivePolls(s).length);
  const paymentsDue = useScenario(selectPaymentsDue);
  const settleTotal = useScenario(selectSettleTotal);
  const unpaidActivities = useScenario(selectUnpaidActivityTotal);

  const recent = activities.slice(-4);

  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <TripMap backHref="/" />
      <div className="relative flex flex-col gap-2 px-4 pb-33">
        <TripHeaderCard
          name={LISBON.name}
          dates={LISBON.dates}
          organiser={LISBON.organiser}
          paymentsDue={paymentsDue}
          counts={{ polls: livePolls, itinerary: activities.length, stays: 1 }}
          settleTotal={settleTotal}
        />
        <TrippersCard members={members} />

        <section id="itinerary" className="flex flex-col gap-4 py-5">
          <SectionHeader title="Itinerary" href="#itinerary" />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                theme="outline"
                className="flex-1"
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                Create activity
              </Button>
              <Button
                theme="light"
                className="flex-1"
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                New poll
              </Button>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-body-s text-ink-muted">
                {recent.length} most recent
              </p>
              {recent.map((a, i) => (
                <ActivityCard
                  key={a.id}
                  {...a}
                  connector={i < recent.length - 1}
                />
              ))}
            </div>
            {unpaidActivities > 0 && (
              <Button theme="light" size="xl">
                Pay activity shares {formatPence(unpaidActivities)}
              </Button>
            )}
          </div>
        </section>

        <section id="stays" className="flex flex-col gap-4 pb-5">
          <SectionHeader title="Stays" meta="1 stay" />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                theme="outline"
                className="flex-1"
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                Create stay
              </Button>
              <Button
                theme="light"
                className="flex-1"
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                New poll
              </Button>
            </div>
            <StayCard {...stay} />
            {!stay.paid && (
              <Button theme="light" size="xl">
                Pay stay shares {formatPence(stay.share)}
              </Button>
            )}
          </div>
        </section>
      </div>
    </Screen>
  );
}
