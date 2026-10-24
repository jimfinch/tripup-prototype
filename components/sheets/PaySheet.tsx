"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { BELCANTO, LISBON, SETTLE } from "@/data/seed";
import { cn } from "@/lib/cn";
import { formatPence } from "@/lib/money";
import {
  selectOwedToAri,
  selectPayTotal,
  useScenario,
  type PayScope,
} from "@/store/scenario";

type Method = "apple" | "bank" | "visa" | "card";

const TITLE: Record<PayScope["kind"], string> = {
  settle: "Settle trip",
  activities: "Pay activity shares",
  stay: "Pay stay shares",
  activity: "Pay share",
};

// The settle sheet (wireflow 09), reused for every partial payment (§8).
export function PaySheet({ scope, open }: { scope: PayScope; open: boolean }) {
  const s = useScenario();
  const router = useRouter();
  const [method, setMethod] = useState<Method | null>(null);
  const [paying, setPaying] = useState(false);

  const total = selectPayTotal(s, scope);
  const owed = scope.kind === "settle" ? selectOwedToAri(s) : 0;
  const guided = s.step === 9 && scope.kind === "settle";

  const rows: { label: string; amount: number }[] = [];
  if ((scope.kind === "settle" || scope.kind === "stay") && !s.stay.paid) {
    rows.push({ label: `Stay - ${s.stay.name}`, amount: s.stay.share });
  }
  for (const a of s.activities) {
    const included =
      scope.kind === "settle" ||
      scope.kind === "activities" ||
      (scope.kind === "activity" && scope.id === a.id);
    if (included && !a.paid && !a.shell)
      rows.push({ label: `${a.type} - ${a.title}`, amount: a.share });
  }
  if (owed > 0)
    rows.push({
      label: `Owed to you - Dinner at ${BELCANTO.title}`,
      amount: -owed,
    });

  const confirm = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setMethod(null);
      s.pay(scope);
      if (scope.kind === "settle") router.push(`/trips/${LISBON.id}/settled/`);
      else s.showToast(`Paid ${formatPence(total)}`);
    }, 700);
  };

  return (
    <Sheet
      open={open}
      onClose={s.closeSheet}
      title={TITLE[scope.kind]}
      footer={
        <Button
          theme="primary"
          size="xl"
          disabled={!method || paying || total === 0}
          onClick={confirm}
          className={cn(guided && method && "hint-ring")}
          rightIcon={<Icon name="lock" />}
        >
          {paying
            ? "Paying…"
            : `${scope.kind === "settle" ? "Settle" : "Pay"} ${formatPence(total)}`}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-display text-gunmetal">{formatPence(total)}</p>
          <p className="text-body-s text-ink-muted">
            Your balance for {LISBON.name} - 17–24 Oct
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-off-white p-4">
          {rows.map((r) => (
            <p
              key={r.label}
              className="flex justify-between gap-4 text-body-s text-gunmetal"
            >
              <span>{r.label}</span>
              <span className="text-label">
                {r.amount < 0
                  ? `−${formatPence(-r.amount)}`
                  : formatPence(r.amount)}
              </span>
            </p>
          ))}
          <p className="mt-1 flex justify-between text-headline text-gunmetal">
            <span>You pay</span>
            <span>{formatPence(total)}</span>
          </p>
        </div>

        {owed > 0 && (
          <div className="flex flex-col gap-3 rounded-md border border-gunmetal/15 p-4">
            <p className="flex items-center justify-between">
              <span className="text-headline text-gunmetal">
                1 transfer instead of {SETTLE.transfersInsteadOf}
              </span>
              <span className="text-caption text-ink-muted">Simplified</span>
            </p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-headline text-gunmetal">
                <Avatar id="ari" />
                You
                <Icon framed name="arrow-right" size={20} />
                Jaimie
                <Avatar id={SETTLE.payee} />
              </span>
              <span className="text-headline text-gunmetal">
                {formatPence(total)}
              </span>
            </div>
            <p className="text-body-s text-ink-muted">
              {SETTLE.consolidatedNote}
            </p>
          </div>
        )}

        <div
          role="radiogroup"
          aria-label="Pay with"
          className={cn(
            "flex flex-col gap-3 rounded-md",
            guided && !method && "hint-ring",
          )}
        >
          <p className="text-body-s text-ink-muted">Pay with</p>
          <MethodButton
            selected={method === "apple"}
            onSelect={() => setMethod("apple")}
            className="justify-center bg-black text-white"
            label="Apple Pay"
          >
            <Image src="/pay/apple-logo.svg" alt="" width={13} height={16} />
            <Image
              src="/pay/apple-pay-text.svg"
              alt=""
              width={31}
              height={19}
            />
          </MethodButton>
          <MethodButton
            selected={method === "bank"}
            onSelect={() => setMethod("bank")}
            className="justify-between border border-gunmetal/15"
            label="Bank transfer"
          >
            <span className="text-headline">Bank transfer</span>
            <span className="text-body-s text-ink-muted">Zero fees</span>
          </MethodButton>

          <p className="flex items-center gap-3 py-1 text-body-s text-ink-muted">
            <span className="h-px flex-1 bg-gunmetal/15" />
            Or pay using
            <span className="h-px flex-1 bg-gunmetal/15" />
          </p>

          <p className="text-headline text-gunmetal">Saved</p>
          <MethodButton
            selected={method === "visa"}
            onSelect={() => setMethod("visa")}
            className="justify-between border border-gunmetal/15"
            label={`Visa ending ${SETTLE.card}`}
          >
            <span className="flex items-center gap-2 text-headline">
              <span className="flex h-6 items-center rounded bg-gunmetal px-1.5">
                <Image src="/pay/visa.svg" alt="" width={32} height={10} />
              </span>
              ···· {SETTLE.card}
            </span>
            <span className="flex items-center gap-1 text-body-s text-ink-muted">
              View more
              <Icon framed name="caret" size={16} />
            </span>
          </MethodButton>
          <p className="text-headline text-gunmetal">New payment method</p>
          <MethodButton
            selected={method === "card"}
            onSelect={() => setMethod("card")}
            className="border border-gunmetal/15"
            label="New card"
          >
            <span className="flex items-center gap-3 text-headline">
              <Icon framed name="credit-card" />
              New card
            </span>
          </MethodButton>
        </div>
      </div>
    </Sheet>
  );
}

function MethodButton({
  selected,
  onSelect,
  label,
  className,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className={cn(
        "relative flex h-13 items-center gap-1 rounded-pill px-5 text-gunmetal transition duration-150 active:scale-press",
        className,
        selected && "outline outline-2 outline-offset-2 outline-gunmetal",
      )}
    >
      {children}
    </button>
  );
}
