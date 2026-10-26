"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useScenario } from "@/store/scenario";

const TOAST_MS = 3000;

// Confirmation pill (wireflow "Notification"), e.g. "'Belcanto' won - added to itinerary".
// Always lime with a gunmetal check.
export function Toast() {
  const toast = useScenario((s) => s.toast);
  const dismiss = useScenario((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismiss, TOAST_MS);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-toast-bottom z-40 flex justify-center px-4"
    >
      {/* A different message waits for the last to leave, so two toasts
          never share the row and shove each other sideways. */}
      <AnimatePresence mode="wait">
        {toast && (
          <motion.button
            key={toast.id}
            type="button"
            onClick={dismiss}
            className="pointer-events-auto flex items-center gap-2.5 rounded-pill bg-lime py-3 pl-4 pr-5 text-headline text-gunmetal shadow-toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <span className="flex size-6 items-center justify-center rounded-pill bg-gunmetal text-lime">
              <Icon framed name="check" size={16} />
            </span>
            {toast.message}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
