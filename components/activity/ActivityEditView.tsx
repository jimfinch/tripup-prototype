"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BillItemCard } from "@/components/activity/BillItemCard";
import { AmountField } from "@/components/form/AmountField";
import { TextField } from "@/components/form/TextField";
import { ToggleRow } from "@/components/form/ToggleRow";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { AttendeeRow } from "@/components/group/AttendeeRow";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  BELCANTO,
  BELCANTO_ATTENDEES,
  BELCANTO_STATUS,
  PEOPLE,
  type ActivityType,
  type BillStatus,
} from "@/data/seed";
import { useHint } from "@/lib/hints";
import { cn } from "@/lib/cn";
import { sumPence } from "@/lib/money";
import { selectBillShares, useScenario } from "@/store/scenario";

const TYPES: { label: ActivityType | "Other"; icon: IconName }[] = [
  { label: "Dinner", icon: "dinner" },
  { label: "Lunch", icon: "pizza" },
  { label: "Drinks", icon: "drinks" },
  { label: "Other", icon: "plus" },
];

const SCAN_MS = 900;

// Step 08: the organiser's edit view for Belcanto (wireflow "08: Log dinner").
// Order follows the wireflow: title, date, location, type, receipts (brought
// up as the key action), split payments, update.
// Ari created the poll, so she organises the activity and can log the bill.
export function ActivityEditView() {
  const router = useRouter();
  const s = useScenario();
  const shares = selectBillShares(s);
  const [title, setTitle] = useState(BELCANTO.title);
  const [type, setType] = useState<string>(BELCANTO.type);
  const [address, setAddress] = useState(BELCANTO.address);
  const [scanning, setScanning] = useState(false);
  const hintScan = useHint("scan");
  const hintUpdate = useHint("update-activity");

  const { scanned, items } = s.belcanto;
  const owed = BELCANTO_ATTENDEES.filter(
    (p) => BELCANTO_STATUS[p] === "owes",
  ).reduce((sum, p) => sum + (shares.get(p) ?? 0), 0);
  // Equals the receipt total unless shares were typed in by hand.
  const total = sumPence([...shares.values()]);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      s.scanReceipt();
    }, SCAN_MS);
  };

  const update = () => {
    s.updateActivity();
    router.push("/trips/lisbon/");
  };

  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/trips/lisbon/"
            aria-label="Back to Lisbon trip"
            className="tap-target rounded-pill transition active:scale-press"
          >
            <Image src="/icons/back-button.svg" alt="" width={40} height={40} />
          </Link>
          <button
            type="button"
            aria-label="Activity options"
            onClick={s.notInPrototype}
            className="flex size-10 items-center justify-center rounded-pill text-gunmetal transition active:scale-press"
          >
            <Icon framed name="kebab" />
          </button>
        </div>

        <TextField
          label="Activity title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <span className="text-body-s text-ink-muted">Date</span>
          <span className="flex gap-2">
            <span className="flex h-10 items-center rounded-pill bg-off-white px-4.5 text-label">
              {BELCANTO.date}
            </span>
            <span className="flex h-10 items-center rounded-pill bg-off-white px-4.5 text-label">
              {BELCANTO.time}
            </span>
          </span>
        </div>

        <TextField
          label="Location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          trailing={<Icon framed name="map-pin" className="text-gunmetal" />}
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-title-m text-gunmetal">Type</legend>
          <div
            role="radiogroup"
            aria-label="Type"
            className="grid grid-cols-4 gap-2"
          >
            {TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                role="radio"
                aria-checked={type === t.label}
                onClick={() => setType(t.label)}
                className={cn(
                  "flex h-22 flex-col items-center justify-center gap-2 rounded-md text-label transition active:scale-press",
                  type === t.label
                    ? "bg-gunmetal text-white"
                    : "bg-off-white text-gunmetal",
                )}
              >
                <Icon
                  framed
                  name={t.icon}
                  className={type === t.label ? "text-lime" : ""}
                />
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-title-m text-gunmetal">Receipts</h2>
            <p className="text-body-s text-ink-muted">
              Scan receipt to itemise
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {scanned &&
              (
                [
                  ["Dinner", "receipt"],
                  ["Drinks", "drinks"],
                ] as const
              ).map(([r, icon]) => (
                <span
                  key={r}
                  className="flex h-22 flex-col items-center justify-center gap-2 rounded-md bg-off-white text-label text-gunmetal"
                >
                  <Icon framed name={icon} />
                  {r}
                </span>
              ))}
            <button
              type="button"
              onClick={scan}
              disabled={scanning}
              className={cn(
                "flex h-22 flex-col items-center justify-center gap-2 rounded-md bg-off-white text-label text-gunmetal transition active:scale-press",
                hintScan,
              )}
            >
              <Icon
                framed
                name={scanning ? "receipt" : "plus"}
                className={scanning ? "animate-pulse" : ""}
              />
              {scanning ? "Scanning…" : "Scan"}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-md bg-lilac p-4">
          <h2 className="text-title-m text-gunmetal">Split payments</h2>
          <ToggleRow
            label="Split equally"
            checked={false}
            onChange={s.notInPrototype}
          />
          <p className="text-body-s text-ink-muted">
            Items on the bill.
            <br />
            Tap a person to exclude them from the item.
          </p>

          {scanned ? (
            <>
              {items.map((item) => (
                <BillItemCard
                  key={item.id}
                  item={item}
                  onToggle={(p) => s.toggleExclude(item.id, p)}
                />
              ))}
              <div className="flex justify-end">
                <Button
                  theme="dark"
                  onClick={s.notInPrototype}
                  rightIcon={<Icon framed name="plus" size={20} />}
                >
                  Add item
                </Button>
              </div>
            </>
          ) : (
            <p className="rounded-sm bg-white p-4 text-center text-body-s text-ink-muted">
              No items yet. Scan the receipt to itemise the bill, or enter each
              person’s share below.
            </p>
          )}

          <p className="text-body-s text-ink-muted">Each person’s share</p>
          <ul>
            {BELCANTO_ATTENDEES.map((p) => {
              const name = p === "ari" ? "You" : PEOPLE[p].name;
              return (
                <AttendeeRow
                  key={p}
                  id={p}
                  name={name}
                  sublabel={p === "ren" ? "Guest" : undefined}
                  trailing={
                    <span className="flex items-center gap-1">
                      <StatusPill status={BELCANTO_STATUS[p]} />
                      <AmountField
                        label={`${name}’s share`}
                        amount={shares.get(p) ?? 0}
                        onChange={(v) => s.setShare(p, v)}
                      />
                    </span>
                  }
                />
              );
            })}
          </ul>
          <p className="flex items-center justify-between text-body-s text-ink-muted">
            You are owed
            <AmountField label="You are owed" amount={owed} />
          </p>
          <p className="flex items-center justify-between text-title-m text-gunmetal">
            Total
            <AmountField label="Total" amount={total} />
          </p>

          <div className="flex items-center justify-between">
            <span className="text-body-s text-gunmetal">
              {BELCANTO_ATTENDEES.length}
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

        <Button theme="light" size="xl" className={hintUpdate} onClick={update}>
          Update activity
        </Button>
      </div>
    </Screen>
  );
}

const STATUS_LABEL: Record<BillStatus, string> = {
  bill: "Bill",
  paid: "Paid",
  owes: "Owes",
};

// Bill = Ari paid the bill · Paid = paid Ari back · Owes = still owes Ari.
function StatusPill({ status }: { status: BillStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-label",
        status === "owes"
          ? "bg-gunmetal/10 text-gunmetal"
          : "bg-white text-gunmetal",
      )}
    >
      {STATUS_LABEL[status]}
      {status === "bill" && <Icon framed name="receipt" size={16} />}
    </span>
  );
}
