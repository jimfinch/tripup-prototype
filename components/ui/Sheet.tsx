"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { useHint, type HintId } from "@/lib/hints";
import { cn } from "@/lib/cn";

// Bottom sheet, positioned inside the phone frame. Closes on ✕, backdrop tap,
// Escape, or dragging the header down.

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  // Guided-layer hint for the ✕ button (e.g. after Ren accepts).
  closeHint?: HintId;
  // Pinned under the scroll area (e.g. a primary action).
  footer?: ReactNode;
};

const SHEET_EASE = [0.32, 0.72, 0, 1] as const;
const DISMISS_OFFSET = 120;
const DISMISS_VELOCITY = 500;

export function Sheet({
  open,
  onClose,
  title,
  children,
  closeHint,
  footer,
}: SheetProps) {
  const closeHintClass = useHint(closeHint ?? "close-sheet");
  const titleId = useId();
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY)
      onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40">
          <motion.div
            className="absolute inset-0 bg-gunmetal/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end pt-sheet-top">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className="pointer-events-auto flex max-h-full flex-col rounded-t-sheet border border-gunmetal/10 bg-white shadow-sheet outline-none"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: SHEET_EASE }}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onDragEnd}
            >
              <header
                className="relative flex touch-none items-center justify-center px-5 pb-4 pt-5"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <h2 id={titleId} className="text-title-m text-gunmetal">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3.5 top-3.5 flex size-11 items-center justify-center rounded-pill transition-opacity active:opacity-60"
                >
                  <Image
                    src="/icons/close-button.svg"
                    alt=""
                    className={cn("rounded-pill", closeHint && closeHintClass)}
                    width={30}
                    height={30}
                  />
                </button>
              </header>
              <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-10">
                {children}
              </div>
              {footer && <div className="px-5 pb-8 pt-3">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
