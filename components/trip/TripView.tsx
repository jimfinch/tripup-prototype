"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { TripMap } from "@/components/trip/TripMap";
import { TrippersCard } from "@/components/trip/TrippersCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BELCANTO, LISBON } from "@/data/seed";
import { useHint, useHintActive } from "@/lib/hints";
import { formatPence } from "@/lib/money";
import {
  selectLivePolls,
  selectPaymentsDue,
  selectSettleTotal,
  selectUnpaidActivityTotal,
  useCurrentStep,
  useScenario,
  type Sheet,
} from "@/store/scenario";

// 02 Trip view (hi-fi), host of the core journey's sheets (steps 03–09).
export function TripView() {
  const router = useRouter();
  const s = useScenario();
  const { phone } = useCurrentStep();
  const livePolls = selectLivePolls(s);
  const paymentsDue = selectPaymentsDue(s);
  const settleTotal = selectSettleTotal(s);
  const unpaidActivities = selectUnpaidActivityTotal(s);

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

  const openBelcanto = () => {
    s.openBelcanto();
    router.push(`/trips/${LISBON.id}/activities/${BELCANTO.id}/`);
  };
  const pay = (scope: Extract<Sheet, { kind: "pay" }>["scope"]) =>
    s.openSheet({ kind: "pay", scope });
  const openPolls = () => router.push(`/trips/${LISBON.id}/polls/`);

  // The trip view shows the 4 most recent; "See all" is the full timeline.
  const recent = s.activities.slice(-4);

  const sheet = s.sheet;
  return (
    <Screen
      tabBar
      className="bg-white"
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
      <TripMap backHref="/" />
      <div className="relative flex flex-col gap-2 px-4 pb-33">
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
          settled={s.settled || settleTotal === 0}
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
                  onOpen={a.id === BELCANTO.id ? openBelcanto : undefined}
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
            <StayCard {...s.stay} onPay={() => pay({ kind: "stay" })} />
            {!s.stay.paid && (
              <Button
                theme="light"
                size="xl"
                onClick={() => pay({ kind: "stay" })}
                rightIcon={<Icon framed name="card" />}
              >
                Pay stay shares {formatPence(s.stay.share)}
              </Button>
            )}
          </div>
        </section>
      </div>
    </Screen>
  );
}
