"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  selectLivePolls,
  selectPaymentsDue,
  useScenario,
} from "@/store/scenario";

// Figma "App Menu". The Polls and Payments icons are exported with their
// violet notification dot; the dot is clipped off when there is nothing to show.
const DOT_ICON_STYLE: CSSProperties = {
  position: "absolute",
  inset: "-15.91% -19.32% 0 0",
};
const HIDE_DOT: CSSProperties = {
  clipPath: "polygon(0 0, 80% 0, 80% 20.6%, 100% 20.6%, 100% 100%, 0 100%)",
};

function DotIcon({ src, dot }: { src: string; dot: boolean }) {
  return (
    <span style={DOT_ICON_STYLE}>
      <Image src={src} alt="" fill style={dot ? undefined : HIDE_DOT} />
    </span>
  );
}

type Tab = {
  href: string;
  label: string;
  icon: (dots: TabBarProps) => ReactNode;
};

const TABS: Tab[] = [
  {
    href: "/search/",
    label: "Search",
    icon: () => <Image src="/icons/tab-search.svg" alt="" fill />,
  },
  {
    href: "/polls/",
    label: "Polls",
    icon: ({ pollsDot }) => (
      <DotIcon src="/icons/tab-polls-dot.svg" dot={!!pollsDot} />
    ),
  },
  {
    href: "/",
    label: "Home",
    icon: () => <Image src="/icons/tab-home.svg" alt="" fill />,
  },
  {
    href: "/payments/",
    label: "Payments",
    icon: ({ paymentsDot }) => (
      <DotIcon src="/icons/tab-payments-dot.svg" dot={!!paymentsDot} />
    ),
  },
  {
    href: "/profile/",
    label: "Profile",
    icon: () => <Image src="/icons/tab-profile.svg" alt="" fill />,
  },
];

type TabBarProps = {
  pollsDot?: boolean;
  paymentsDot?: boolean;
};

export function TabBar() {
  const pathname = usePathname();
  const props: TabBarProps = {
    pollsDot: useScenario((s) => selectLivePolls(s).length > 0),
    paymentsDot: useScenario((s) => selectPaymentsDue(s) > 0),
  };

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none absolute inset-x-0 bottom-tab-bar-bottom z-20 flex justify-center"
    >
      <ul className="pointer-events-auto flex items-center rounded-pill bg-white/75 px-4 py-1.25 shadow-tab-bar backdrop-blur-glass">
        {TABS.map((tab) => {
          const current = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className="flex size-15 flex-col items-center justify-center gap-2 rounded-pill text-gunmetal transition-opacity duration-150 active:opacity-60"
              >
                <span className="relative size-5.5">{tab.icon(props)}</span>
                <span className="text-micro">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
