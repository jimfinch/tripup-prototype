import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PEOPLE, type TripMember } from "@/data/seed";

type TrippersCardProps = {
  members: TripMember[];
  onInvite?: () => void;
};

// "You, Charlie, Jaimie +3 others" from the people who are coming.
export function whoIsComing(members: TripMember[]) {
  const coming = members.filter((m) => m.status === "yes");
  const names = coming
    .slice(0, 3)
    .map((m) => (m.id === "ari" ? "You" : PEOPLE[m.id].firstName));
  const others = coming.length - names.length;
  return others > 0
    ? `${names.join(", ")} +${others} others`
    : names.join(", ");
}

// Hi-fi Trip view "Trippers Card" (Who's coming).
export function TrippersCard({ members, onInvite }: TrippersCardProps) {
  const coming = members.filter((m) => m.status === "yes");
  const guests = coming.filter((m) => m.guest).length;

  return (
    <section className="flex flex-col gap-3 rounded-md bg-lilac p-4">
      <SectionHeader title="Who’s coming" href="#who" />
      <div className="flex flex-col gap-2">
        <AvatarStack ids={coming.slice(0, 6).map((m) => m.id)} />
        <p className="text-body-s text-ink-muted">{whoIsComing(members)}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-body-s text-gunmetal">
          {coming.length - guests}
          <span className="text-ink-muted"> coming</span>
          {guests > 0 && (
            <>
              {" · "}
              {guests}
              <span className="text-ink-muted">
                {" "}
                {guests === 1 ? "guest" : "guests"}
              </span>
            </>
          )}
        </p>
        <Button
          theme="light"
          onClick={onInvite}
          rightIcon={<Icon framed name="people-add" size={20} />}
        >
          Invite
        </Button>
      </div>
    </section>
  );
}
