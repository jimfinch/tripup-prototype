"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { CreatePollSheet } from "@/components/sheets/CreatePollSheet";
import { InviteSheet } from "@/components/sheets/InviteSheet";
import { NotificationBanner } from "@/components/sheets/NotificationBanner";
import { PaySheet } from "@/components/sheets/PaySheet";
import { VoteSheet } from "@/components/sheets/VoteSheet";
import { ActivityCard } from "@/components/trip/ActivityCard";
import { StayCard } from "@/components/trip/StayCard";
import { TripHeaderCard } from "@/components/trip/TripHeaderCard";
import { GROW, TripMap } from "@/components/trip/TripMap";
import { TrippersCard } from "@/components/trip/TrippersCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BELCANTO, LISBON } from "@/data/seed";
import { useHint, useHintActive } from "@/lib/hints";
import { cn } from "@/lib/cn";
import { formatPence } from "@/lib/money";
import {
  selectLivePolls,
  selectPaymentsDue,
  selectSettleTotal,
  selectUnpaidActivityTotal,
  useCurrentStep,
  useScenario,
  viewFor,
  type Sheet,
} from "@/store/scenario";

// 02 Trip view (hi-fi), host of the core journey's sheets (steps 03–09).
export function TripView() {
  const router = useRouter();
  const s = useScenario();
  const { phone } = useCurrentStep();
  // Payment figures are the phone owner's (Charlie's own on step 05).
  const view = viewFor(s, phone);
  const livePolls = selectLivePolls(s);
  const paymentsDue = selectPaymentsDue(view);
  const settleTotal = selectSettleTotal(view);
  const unpaidActivities = selectUnpaidActivityTotal(view);

  const hintInvite = useHint("invite");
  const hintNewPoll = useHint("new-poll");
  const hintSettle = useHint("settle");
  const beaconBelcanto = useHintActive("belcanto-card");

  // Step 07: bring the new Belcanto card into view once the sheet has closed.
  const { focus, clearFocus } = s;
  useEffect(() => {
    if (focus !== BELCANTO.id) return;
    const t = setTimeout(() => {
      document
        .getElementById(`activity-${BELCANTO.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      clearFocus();
    }, 450);
    return () => clearTimeout(t);
  }, [focus, clearFocus]);

  // Map: expanding scrolls to the top first, then zooms (see TripMap). Coming
  // back from a pin opened on the full-screen map lands on the map again.
  const [mapOpen, setMapOpen] = useState(
    () => useScenario.getState().returnToMap,
  );
  useEffect(() => useScenario.getState().setReturnToMap(false), []);
  const mainRef = useRef<HTMLElement | null>(null);
  const expandMap = () => {
    mainRef.current = document.querySelector("main");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setMapOpen(true);
  };

  const openBelcanto = () => {
    s.openBelcanto();
    router.push(`/trips/${LISBON.id}/activities/${BELCANTO.id}/`);
  };
  // Paying is Ari's story; on Charlie's phone it's not part of the demo.
  const pay = (scope: Extract<Sheet, { kind: "pay" }>["scope"]) =>
    phone === "ari" ? s.openSheet({ kind: "pay", scope }) : s.notInPrototype();
  const openPolls = () => router.push(`/trips/${LISBON.id}/polls/`);

  // The trip view shows the 4 most recent; "See all" is the full timeline.
  const recent = view.activities.slice(-4);

  const sheet = s.sheet;
  return (
    <Screen
      tabBar
      bottomGlow
      className={cn("bg-white", mapOpen && "overflow-hidden")}
      scrollKey={phone}
      overlays={
        <>
          <StatusScrim />
          <InviteSheet open={sheet?.kind === "invite"} />
          <CreatePollSheet open={sheet?.kind === "createPoll"} />
          <VoteSheet
            open={sheet?.kind === "vote"}
            pollId={sheet?.kind === "vote" ? sheet.pollId : "dinner"}
          />
          {sheet?.kind === "pay" && <PaySheet open scope={sheet.scope} />}
          <NotificationBanner />
        </>
      }
    >
      <TripMap
        backHref="/"
        expanded={mapOpen}
        onExpand={expandMap}
        onCollapse={() => setMapOpen(false)}
        onPin={(id) => {
          // Back returns to whichever map state the pin was tapped from.
          s.setReturnToMap(mapOpen);
          router.push(`/trips/${LISBON.id}/activities/${id}/`);
        }}
      />
      {/* Slides out of view while the map is full screen. */}
      <motion.div
        className="relative flex flex-col gap-2 px-4 pb-33"
        initial={false}
        animate={{ y: mapOpen ? 640 : 0, opacity: mapOpen ? 0 : 1 }}
        transition={GROW}
        aria-hidden={mapOpen}
      >
        <TripHeaderCard
          name={LISBON.name}
          dates={LISBON.dates}
          organiser={LISBON.organiser}
          paymentsDue={paymentsDue}
          counts={{
            polls: livePolls.length,
            itinerary: s.activities.length,
            stays: 1,
          }}
          settleTotal={settleTotal}
          settled={(s.settled && phone === "ari") || settleTotal === 0}
          onSettle={() => pay({ kind: "settle" })}
          onPolls={openPolls}
          settleClassName={hintSettle}
        />
        <TrippersCard
          members={s.members}
          viewer={phone}
          onInvite={() => s.openSheet({ kind: "invite" })}
          onSeeAll={() => s.openSheet({ kind: "invite" })}
          inviteClassName={hintInvite}
        />

        <section
          id="itinerary"
          className="flex scroll-mt-16 flex-col gap-4 py-5"
        >
          <SectionHeader title="Itinerary" onLink={s.notInPrototype} />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                theme="outline"
                className="flex-1"
                onClick={s.notInPrototype}
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                Create activity
              </Button>
              <Button
                theme="light"
                className={`flex-1 ${hintNewPoll}`}
                onClick={() => s.openSheet({ kind: "createPoll" })}
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
                  isNew={a.id === BELCANTO.id && s.belcanto.isNew}
                  connector={i < recent.length - 1}
                  onPay={() => pay({ kind: "activity", id: a.id })}
                  onOpen={
                    a.id === BELCANTO.id
                      ? openBelcanto
                      : () =>
                          router.push(`/trips/${LISBON.id}/activities/${a.id}/`)
                  }
                  beacon={a.id === BELCANTO.id && beaconBelcanto}
                />
              ))}
            </div>
            {unpaidActivities > 0 && (
              <Button
                theme="light"
                size="xl"
                onClick={() => pay({ kind: "activities" })}
                rightIcon={<Icon framed name="card" />}
              >
                Pay activity shares {formatPence(unpaidActivities)}
              </Button>
            )}
          </div>
        </section>

        <section id="stays" className="flex scroll-mt-16 flex-col gap-4 pb-5">
          <SectionHeader title="Stays" meta="1 stay" />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                theme="outline"
                className="flex-1"
                onClick={s.notInPrototype}
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                Create stay
              </Button>
              <Button
                theme="light"
                className="flex-1"
                onClick={s.notInPrototype}
                rightIcon={<Icon framed name="plus" size={20} />}
              >
                New poll
              </Button>
            </div>
            <StayCard {...view.stay} onPay={() => pay({ kind: "stay" })} />
            {!view.stay.paid && (
              <Button
                theme="light"
                size="xl"
                onClick={() => pay({ kind: "stay" })}
                rightIcon={<Icon framed name="card" />}
              >
                Pay stay shares {formatPence(view.stay.share)}
              </Button>
            )}
          </div>
        </section>
      </motion.div>
    </Screen>
  );
}
