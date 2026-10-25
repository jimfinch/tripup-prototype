"use client";

import Image from "next/image";
import { PayState } from "@/components/pay/PayState";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { PaySheet } from "@/components/sheets/PaySheet";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LISBON, type ActivityType } from "@/data/seed";
import { formatPence } from "@/lib/money";
import { useScenario } from "@/store/scenario";

const TYPE_ICON: Record<ActivityType, IconName> = {
  Dinner: "dinner",
  Lunch: "pizza",
  Drinks: "drinks",
};

// Pin positions on the hi-fi map crop (430 px wide frame).
const PIN_AT: Record<
  string,
  { x: number; y: number; kind: "dinner" | "stay" }
> = {
  tasca: { x: 79, y: 200, kind: "dinner" },
  ramiro: { x: 133, y: 102, kind: "dinner" },
  eurico: { x: 264, y: 195, kind: "dinner" },
  pigmeu: { x: 195, y: 75, kind: "stay" },
};

// Participant view of an activity (Working "Activity view - Read only"):
// details, map and Ari's share; only Invite and paying are actions.
export function ActivityReadOnlyView({ activityId }: { activityId: string }) {
  const s = useScenario();
  const a = s.activities.find((x) => x.id === activityId);
  if (!a) return null;
  const pin = PIN_AT[a.id];
  const sheet = s.sheet;

  return (
    <Screen
      tabBar
      className="bg-white"
      overlays={
        <>
          <StatusScrim />
          {sheet?.kind === "pay" && <PaySheet open scope={sheet.scope} />}
        </>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="pt-2">
          <BackButton href={`/trips/${LISBON.id}/`} />
        </div>

        <div className="flex gap-2">
          <div className="flex size-22 shrink-0 flex-col items-center justify-center gap-2 rounded-md bg-off-white text-label text-gunmetal">
            <Icon framed name={TYPE_ICON[a.type]} />
            {a.type}
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-md bg-lilac px-4">
            <h1 className="text-headline text-gunmetal">{a.title}</h1>
            <p className="text-body-s text-ink-muted">
              {a.day} {a.month} 2026
            </p>
            <p className="text-body-s text-ink-muted">{a.time}</p>
          </div>
        </div>

        {pin && (
          <div
            className="relative h-75 overflow-hidden rounded-md"
            aria-label={`${a.title} on the map`}
            role="img"
          >
            <Image
              src="/map/lisbon.jpg"
              alt=""
              width={2700}
              height={2087}
              className="absolute max-w-none"
              style={{
                left: "-124.89%",
                top: "-58%",
                width: "314.42%",
                height: "auto",
              }}
            />
            <Image
              src={`/map/pin-${pin.kind}.svg`}
              alt=""
              width={48}
              height={59}
              className="absolute"
              style={{
                left: `calc(${((pin.x + 20) / 430) * 100}% - 24px)`,
                top: pin.y + 40,
              }}
            />
          </div>
        )}

        <section className="flex flex-col gap-4 rounded-md bg-lilac p-4">
          <h2 className="text-title-m text-gunmetal">Your share</h2>
          <div className="flex items-center justify-between">
            <p className="text-title-s text-gunmetal">{formatPence(a.share)}</p>
            <PayState
              paid={a.paid}
              onPay={() =>
                s.openSheet({
                  kind: "pay",
                  scope: { kind: "activity", id: a.id },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between border-t border-gunmetal/10 pt-4">
            <span className="text-body-s text-gunmetal">
              {a.coming}
              <span className="text-ink-muted"> attending</span>
            </span>
            <Button
              theme="dark"
              onClick={s.notInPrototype}
              rightIcon={<Icon framed name="people-add" size={20} />}
            >
              Invite
            </Button>
          </div>
        </section>
      </div>
    </Screen>
  );
}
