"use client";

import { useState } from "react";
import { MainNav } from "@/components/shell/MainNav";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { Screen } from "@/components/shell/Screen";
import { CurrentTripCard } from "@/components/trip/CurrentTripCard";
import { UpcomingTripCard } from "@/components/trip/UpcomingTripCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { InlineNotification } from "@/components/ui/InlineNotification";
import { LISBON, PENDING_INVITE, UPCOMING_TRIPS } from "@/data/seed";
import { useHintActive } from "@/lib/hints";
import {
  selectLivePolls,
  selectPaymentsDue,
  useScenario,
} from "@/store/scenario";
import { useRouter } from "next/navigation";

// 01 Home (hi-fi). Layout from the Designs page; copy and counts from the
// wireflow (designer decision).
export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const members = useScenario((s) => s.members);
  const polls = useScenario((s) => s.polls);
  const livePolls = useScenario((s) => selectLivePolls(s).length);
  const paymentsDue = useScenario((s) => selectPaymentsDue(s));

  const openTrip = useScenario((s) => s.openTrip);
  const beaconLisbon = useHintActive("lisbon-card");
  const needsVote = polls.find(
    (p) => p.status === "live" && p.ariVote === null,
  );
  const shown = members.filter((m) => !m.guest || m.status === "yes");

  return (
    <Screen
      tabBar
      className="bg-white"
      onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
      overlays={
        <>
          <StatusScrim tone="none" visible={scrolled} />
          <MainNav active="trips" compact={scrolled} />
        </>
      }
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-home-glow bg-home-top"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-38 bg-home-bottom"
        />

        <div className="relative flex flex-col gap-6 px-4 pb-39 pt-below-nav">
          <InlineNotification
            lines={PENDING_INVITE.lines}
            actionLabel="Accept Trip"
            onAction={() => router.push(`/trips/${PENDING_INVITE.tripId}/`)}
          />

          <section className="flex flex-col gap-2">
            <h2 className="text-headline text-gunmetal">Current trip</h2>
            <CurrentTripCard
              href={`/trips/${LISBON.id}/`}
              name={LISBON.name}
              dates={LISBON.dates}
              image={LISBON.image}
              organiser={LISBON.organiser}
              avatars={LISBON.cardAvatars}
              overflow={Math.max(0, shown.length - LISBON.cardAvatars.length)}
              livePolls={livePolls}
              paymentsDue={paymentsDue}
              poll={needsVote}
              pollsHref="/polls/"
              onOpen={openTrip}
              beacon={beaconLisbon}
              onVote={() => router.push("/polls/")}
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-headline text-gunmetal">Upcoming trips</h2>
            <div className="flex flex-col gap-2">
              {UPCOMING_TRIPS.map((trip) => (
                <UpcomingTripCard key={trip.id} trip={trip} />
              ))}
              <div className="flex justify-end">
                <Button
                  theme="light"
                  href="/trips/past/"
                  rightIcon={<Icon framed name="arrow-right" size={20} />}
                >
                  Past trips
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Screen>
  );
}
