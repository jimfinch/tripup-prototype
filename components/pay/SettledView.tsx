"use client";

import Image from "next/image";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SETTLED_SUMMARY } from "@/data/seed";
import { useHint } from "@/lib/hints";
import { formatPence } from "@/lib/money";
import { selectTripTotal, useScenario } from "@/store/scenario";

// Step 10: All squared up (wireflow "10: Settled page").
export function SettledView() {
  const lastPayment = useScenario((s) => s.lastPayment);
  const tripTotal = useScenario(selectTripTotal);
  const hint = useHint("back-to-trip");

  return (
    <Screen tabBar className="bg-white" overlays={<StatusScrim />}>
      <div className="flex flex-col items-center gap-4 px-4 pb-33 pt-status-bar">
        <h1 className="flex items-center gap-3 pt-8 text-title-l text-gunmetal">
          <span className="flex size-9 items-center justify-center rounded-pill bg-gunmetal text-lime">
            <Icon name="check" width={18} />
          </span>
          You’ve settled, Ari!
        </h1>
        <Image
          src="/illustrations/traveller.png"
          alt="A traveller walking with her suitcase"
          width={280}
          height={280}
          priority
        />
        <p className="max-w-60 text-center text-body text-ink-muted">
          We’ll let you know when everyone’s squared up.
        </p>

        <div className="flex w-full flex-col gap-2 rounded-md bg-lilac p-4 text-gunmetal">
          <p className="flex justify-between text-body-s">
            Transfers
            <span className="text-headline">{SETTLED_SUMMARY.transfers}</span>
          </p>
          <p className="flex justify-between text-body-s">
            Your trip total
            <span className="text-headline">{formatPence(tripTotal)}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 rounded-md border border-gunmetal/15 p-4 text-gunmetal">
          <p className="text-caption text-ink-muted">{SETTLED_SUMMARY.done}</p>
          <p className="flex justify-between text-body-s">
            You paid Jaimie
            <span className="text-headline">
              {formatPence(lastPayment ?? 0)}
            </span>
          </p>
          {SETTLED_SUMMARY.others.map((t) => (
            <p key={t.label} className="flex justify-between text-body-s">
              {t.label}
              <span className="text-headline">{formatPence(t.amount)}</span>
            </p>
          ))}
          <p className="text-caption text-ink-muted">{SETTLED_SUMMARY.more}</p>
        </div>

        <Button
          theme="secondary"
          href="/trips/lisbon/"
          className={hint}
          rightIcon={<Icon framed name="arrow-right" size={20} />}
        >
          Back to Lisbon trip
        </Button>
      </div>
    </Screen>
  );
}
