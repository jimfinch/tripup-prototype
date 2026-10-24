import Link from "next/link";
import { Screen } from "@/components/shell/Screen";

// Placeholder until the hi-fi Home is built (Phase 4).
export default function HomePage() {
  return (
    <Screen tabBar className="bg-white">
      <div className="bg-home-top px-4 pb-10 pt-status-bar">
        <p className="pt-16 text-title-l text-gunmetal">Home</p>
        <p className="mt-2 text-body-s text-ink-muted">
          Hi-fi screen arrives in Phase 4.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/trips/lisbon/"
            className="flex h-10 items-center rounded-pill bg-gunmetal px-4.5 text-label text-white active:opacity-80"
          >
            Lisbon trip
          </Link>
          <Link
            href="/dev/shell/"
            className="flex h-10 items-center rounded-pill border border-gunmetal px-4.5 text-label active:bg-gunmetal active:text-white"
          >
            Shell preview
          </Link>
        </div>
      </div>
    </Screen>
  );
}
