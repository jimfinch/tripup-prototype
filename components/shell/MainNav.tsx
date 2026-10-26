"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type MainNavProps = {
  active: "trips" | "groups";
  // Scrolled state: the bar shrinks to fit its content (Figma note on Designs).
  compact?: boolean;
};

const SPRING = { type: "spring", stiffness: 420, damping: 30 } as const;

// Figma "Main Nav": Trips / Groups switch and the lime "new trip" button,
// floating over Home on frosted glass.
export function MainNav({ active, compact = false }: MainNavProps) {
  const tab = (key: "trips" | "groups", label: string, href: string) => {
    const isActive = active === key;
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-12 items-center gap-1.5 rounded-pill px-4.5 text-title-s transition-colors duration-200 active:scale-press",
          isActive ? "bg-gunmetal text-white" : "bg-off-white text-gunmetal",
        )}
      >
        {/* The logo anchors the brand on Trips, so it stays when Groups is
            selected: lime on gunmetal, gunmetal on off-white. */}
        {key === "trips" && (
          <Icon
            name="tripup"
            className={isActive ? "text-lime" : "text-gunmetal"}
          />
        )}
        {label}
      </Link>
    );
  };

  return (
    <div className="pointer-events-none absolute inset-x-4 top-status-bar z-20 flex justify-center">
      <motion.nav
        layout
        transition={SPRING}
        aria-label="Trips and groups"
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-pill bg-white/50 p-2 shadow-nav backdrop-blur-glass",
          compact ? "w-auto" : "w-full justify-between",
        )}
      >
        <motion.div
          layout="position"
          transition={SPRING}
          className="flex rounded-pill bg-off-white"
        >
          {tab("trips", "Trips", "/")}
          {tab("groups", "Groups", "/groups/")}
        </motion.div>
        <motion.div layout="position" transition={SPRING}>
          <Link
            href="/trips/new/"
            aria-label="New trip"
            className="flex size-12 items-center justify-center rounded-pill bg-lime text-gunmetal transition active:scale-press"
          >
            <Icon name="plus" />
          </Link>
        </motion.div>
      </motion.nav>
    </div>
  );
}
