"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHint } from "@/lib/hints";
import { useScenario } from "@/store/scenario";

// Step 05 on Charlie's phone: the push notification for Ari's new poll
// (wireflow "05: Notification"). Tapping it goes to step 06.
export function NotificationBanner() {
  const step = useScenario((s) => s.step);
  const sceneCard = useScenario((s) => s.sceneCard);
  const poll = useScenario((s) => s.polls.find((p) => p.id === "dinner"));
  const openNotification = useScenario((s) => s.openNotification);
  const hint = useHint("notification");
  const [arrived, setArrived] = useState(false);

  // Arrives just after the "Charlie's phone" scene card.
  useEffect(() => {
    if (step !== 5 || sceneCard) return;
    const t = setTimeout(() => setArrived(true), 400);
    return () => clearTimeout(t);
  }, [step, sceneCard]);

  const show = step === 5 && arrived && poll;
  const labels =
    poll?.options.map((o) => o.label.replace(/ \(.+\)$/, "")) ?? [];
  const optionsLine = `${labels.slice(0, -1).join(", ")} or ${labels.at(-1)}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-40 flex flex-col bg-gunmetal/50 px-4 pt-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            onClick={openNotification}
            className={`flex w-full gap-3 rounded-banner bg-white p-4 text-left font-system text-gunmetal shadow-toast ${hint}`}
            initial={{ y: -140 }}
            animate={{ y: 0 }}
            exit={{ y: -140 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-gunmetal">
              <Image src="/icons/tripup.svg" alt="" width={24} height={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex justify-between text-caption text-ink-muted">
                <span className="font-semibold">TRIPUP</span>
                <span>now</span>
              </span>
              <span className="text-headline">Ari started a poll - Lisbon</span>
              <span className="text-body-s">
                {poll.question}
                <br />
                {optionsLine}
                <br />
                Closes in 2 hrs
              </span>
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
