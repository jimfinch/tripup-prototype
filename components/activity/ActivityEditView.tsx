"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BillItemCard } from "@/components/activity/BillItemCard";
import { BillStatusPill } from "@/components/activity/BillStatusPill";
import { ReceiptTile } from "@/components/activity/ReceiptTile";
import { AmountField } from "@/components/form/AmountField";
import { TextField } from "@/components/form/TextField";
import { ToggleRow } from "@/components/form/ToggleRow";
import { Screen } from "@/components/shell/Screen";
import {
  ReceiptSheet,
  type ReceiptView,
} from "@/components/sheets/ReceiptSheet";
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
// up as the key action), split payments. There's no update button: changes
// save as they're made, and leaving the screen logs the bill (wireflow updated).
// Ari created the poll, so she organises the activity and can log the bill.
export function ActivityEditView() {
  const s = useScenario();
  // The bill as it was on arrival, to tell whether anything has been saved.
  const [arrived] = useState(() => useScenario.getState().belcanto);
  const saved = s.belcanto !== arrived;
  const shares = selectBillShares(s);
  const [title, setTitle] = useState(BELCANTO.title);
  const [type, setType] = useState<string>(BELCANTO.type);
  const [address, setAddress] = useState(BELCANTO.address);
  const [scanning, setScanning] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptView | null>(null);
  const hintScan = useHint("scan");
  const hintLeave = useHint("leave-activity");

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

  // Leaving the screen (back, a tab, a pin) shares the saved changes. A
  // demo-panel jump rebuilds the store at another step first, so it's skipped.
  useEffect(() => {
    const { belcanto, step } = useScenario.getState();
    return () => {
      const now = useScenario.getState();
      if (now.step === step && now.belcanto !== belcanto) now.saveActivity();
    };
  }, []);

  return (
    <Screen
      tabBar
      className="bg-white"
      overlays={
        <>
          <StatusScrim />
          <ReceiptSheet receipt={receipt} onClose={() => setReceipt(null)} />
        </>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-33 pt-status-bar">
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/trips/lisbon/"
            aria-label="Back to Lisbon trip"
            className={cn(
              "tap-target rounded-pill transition active:scale-press",
              hintLeave,
            )}
          >
            <Image src="/icons/back-button.svg" alt="" width={40} height={40} />
          </Link>
          <p
            aria-live="polite"
            className="flex items-center gap-1 text-caption text-ink-muted"
          >
            {saved && <Icon name="check" size={16} />}
            {saved ? "Saved" : "Changes save as you go"}
          </p>
          <button
            type="button"
            aria-label="Activity options"
            onClick={s.notInPrototype}
            className="tap-target flex size-10 items-center justify-center rounded-pill text-gunmetal transition active:scale-press"
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
              ).map(([r, icon], i) => (
                <ReceiptTile
                  key={r}
                  label={r}
                  icon={icon}
                  onOpen={() =>
                    setReceipt({
                      label: r,
                      item: items[i],
                      venue: title,
                      date: BELCANTO.date,
                      time: BELCANTO.time,
                      payer: "ari",
                      attendees: BELCANTO_ATTENDEES,
                    })
                  }
                />
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
            className="border-b border-gunmetal/15 pb-2"
          />

          {scanned ? (
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-body-s text-ink-muted">
                <Icon framed name="hand-tap" className="text-gunmetal" />
                <span>
                  Tap a person to{" "}
                  <span className="text-label text-gunmetal">exclude</span> them
                  from the item
                </span>
              </p>
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
            </div>
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
                      <BillStatusPill status={BELCANTO_STATUS[p]} />
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
      </div>
    </Screen>
  );
}
