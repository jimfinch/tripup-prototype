import { BackToStory } from "@/components/shell/BackToStory";
import { Screen } from "@/components/shell/Screen";

// Search, Payments and Profile are outside the designed scope (CLAUDE.md §5).
export function ComingSoon({ title }: { title: string }) {
  return (
    <Screen tabBar className="bg-off-white">
      <div className="flex min-h-full flex-col items-center justify-center gap-2 px-8 pb-24 text-center">
        <p className="rounded-pill bg-lilac px-3 py-1 text-caption-strong text-violet">
          Coming soon
        </p>
        <h1 className="mt-2 text-title-l text-gunmetal">{title}</h1>
        <p className="text-body-s text-ink-muted">
          This part of TripUp isn’t in the prototype yet.
        </p>
        <div className="mt-4">
          <BackToStory />
        </div>
      </div>
    </Screen>
  );
}
