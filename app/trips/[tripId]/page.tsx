import Link from "next/link";
import { Screen } from "@/components/shell/Screen";

export function generateStaticParams() {
  return [{ tripId: "lisbon" }];
}

// Placeholder until the hi-fi Trip view is built (Phase 4).
export default function TripPage() {
  return (
    <Screen tabBar className="bg-white">
      <div className="px-4 pt-status-bar">
        <p className="pt-16 text-title-l text-gunmetal">Lisbon</p>
        <p className="mt-2 text-body-s text-ink-muted">
          Hi-fi Trip view arrives in Phase 4.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-pill border border-gunmetal px-4.5 text-label active:bg-gunmetal active:text-white"
        >
          Back to Home
        </Link>
      </div>
    </Screen>
  );
}
