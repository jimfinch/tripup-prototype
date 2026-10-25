"use client";

import { useState } from "react";
import Image from "next/image";
import { BillItemCard } from "@/components/activity/BillItemCard";
import { BillStatusPill } from "@/components/activity/BillStatusPill";
import { ReceiptTile } from "@/components/activity/ReceiptTile";
import { AmountField } from "@/components/form/AmountField";
import { AttendeeRow } from "@/components/group/AttendeeRow";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { PaySheet } from "@/components/sheets/PaySheet";
import {
  ReceiptSheet,
  type ReceiptView,
} from "@/components/sheets/ReceiptSheet";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ACTIVITY_BILLS, LISBON, PEOPLE, type ActivityType } from "@/data/seed";
import { billShares } from "@/lib/bill";
import { sumPence } from "@/lib/money";
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
// details, map, receipts and the split, so Ari can check her share against
// the bill. Only paying her share and Invite are actions.
export function ActivityReadOnlyView({ activityId }: { activityId: string }) {
  const s = useScenario();
  const [receipt, setReceipt] = useState<ReceiptView | null>(null);
  const a = s.activities.find((x) => x.id === activityId);
  if (!a) return null;
  const pin = PIN_AT[a.id];
  const sheet = s.sheet;
  const bill = ACTIVITY_BILLS[a.id];
  const shares = billShares(bill.items, bill.attendees);
  const pay = () =>
    s.openSheet({ kind: "pay", scope: { kind: "activity", id: a.id } });

  return (
    <Screen
      tabBar
      bottomGlow
      className="bg-white"
      overlays={
        <>
          <StatusScrim />
          {sheet?.kind === "pay" && <PaySheet open scope={sheet.scope} />}
          <ReceiptSheet receipt={receipt} onClose={() => setReceipt(null)} />
        </>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="pt-2">
          <BackButton href={`/trips/${LISBON.id}/`} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {/* Gunmetal and lime, like the activity's map pin. */}
            <div className="flex size-22 shrink-0 flex-col items-center justify-center gap-2 rounded-md bg-gunmetal text-label text-white">
              <Icon framed name={TYPE_ICON[a.type]} className="text-lime" />
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
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-title-m text-gunmetal">Receipts</h2>
          <div className="grid grid-cols-4 gap-2">
            {bill.receipts.map((r, i) => (
              <ReceiptTile
                key={r.label}
                label={r.label}
                icon={r.icon}
                onOpen={() =>
                  setReceipt({
                    label: r.label,
                    item: bill.items[i],
                    venue: a.title,
                    date: `${a.day} ${a.month} 2026`,
                    time: a.time.split(" - ")[0],
                    payer: bill.payer,
                    attendees: bill.attendees,
                  })
                }
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-md bg-lilac p-4">
          <h2 className="text-title-m text-gunmetal">Split payments</h2>
          <div className="flex flex-col gap-2">
            <p className="text-body-s text-ink-muted">Items on the bill.</p>
            {bill.items.map((item) => (
              <BillItemCard
                key={item.id}
                item={item}
                attendees={bill.attendees}
              />
            ))}
          </div>

          <p className="text-body-s text-ink-muted">Each person’s share</p>
          <ul>
            {bill.attendees.map((p) => {
              const name = p === "ari" ? "You" : PEOPLE[p].name;
              return (
                <AttendeeRow
                  key={p}
                  id={p}
                  name={name}
                  trailing={
                    <span className="flex items-center gap-1">
                      {p === "ari" && !a.paid ? (
                        <Button theme="light" onClick={pay}>
                          Pay
                        </Button>
                      ) : (
                        <BillStatusPill
                          status={
                            p === bill.payer
                              ? "bill"
                              : bill.owes.includes(p)
                                ? "owes"
                                : "paid"
                          }
                        />
                      )}
                      <AmountField
                        label={`${name}’s share`}
                        amount={shares.get(p) ?? 0}
                      />
                    </span>
                  }
                />
              );
            })}
          </ul>
          <p className="flex items-center justify-between text-title-m text-gunmetal">
            Total
            <AmountField
              label="Total"
              amount={sumPence(bill.items.map((i) => i.amount))}
            />
          </p>

          <div className="flex items-center justify-between">
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
