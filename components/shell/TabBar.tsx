"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  selectLivePolls,
  selectPaymentsDue,
  useScenario,
} from "@/store/scenario";

// Figma "Tab Bar" with "Tab Bar Button" (resting / active). Active is a
// gunmetal tile with lime icon and label. Polls and Payments use the
// component's "Has Active Items" option: a violet dot, in either state, while
// something is waiting. The dot icon is a larger export (26.25 × 27) that
// overhangs the 24 px frame top-right.
const DOT_ICON: CSSProperties = {
  position: "absolute",
  inset: "-12.5% -9.38% 0 0",
};

type Tab = {
  href: string;
  label: string;
  icon: string;
  // Paths that count as this tab, besides its own.
  section?: (path: string) => boolean;
};

const TABS: Tab[] = [
  { href: "/search/", label: "Search", icon: "search" },
  { href: "/polls/", label: "Polls", icon: "polls" },
  {
    href: "/",
    label: "Home",
    icon: "home",
    // Trips and groups are reached from Home.
    section: (p) => p.startsWith("/trips/") || p.startsWith("/groups/"),
  },
  { href: "/payments/", label: "Payments", icon: "payments" },
  { href: "/profile/", label: "Profile", icon: "profile" },
];

export function TabBar() {
  const pathname = usePathname();
  const hasActiveItems: Record<string, boolean> = {
    polls: useScenario((s) => selectLivePolls(s).length > 0),
    payments: useScenario((s) => selectPaymentsDue(s) > 0),
  };

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none absolute inset-x-0 bottom-tab-bar-bottom z-20 flex justify-center"
    >
      <ul className="pointer-events-auto flex items-center rounded-pill bg-white/75 px-4 py-1.25 shadow-tab-bar backdrop-blur-glass">
        {TABS.map((tab) => {
          const current =
            tab.href === "/"
              ? pathname === "/" || !!tab.section?.(pathname)
              : pathname.startsWith(tab.href);
          const dot = !!hasActiveItems[tab.icon];
          const src = `/icons/tab-${tab.icon}${dot ? "-dot" : ""}${current ? "-active" : ""}.svg`;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex size-15 flex-col items-center justify-center gap-0.5 rounded-tab text-micro transition duration-150 active:opacity-60",
                  current ? "bg-gunmetal text-lime" : "text-gunmetal",
                )}
              >
                <span className="relative size-6">
                  <span
                    className="absolute inset-0"
                    style={dot ? DOT_ICON : undefined}
                  >
                    <Image src={src} alt="" fill />
                  </span>
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
