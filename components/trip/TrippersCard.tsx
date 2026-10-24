import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PEOPLE, type PersonId, type TripMember } from "@/data/seed";
import type { PhoneId } from "@/data/steps";

// Who is named first in "You, Charlie, Jaimie +3 others", per phone (wireflow
// 02/05/09: on Charlie's phone it reads "You, Ren, Jaimie +4 others").
const NAME_ORDER: Record<PhoneId, PersonId[]> = {
  ari: ["ari", "charlie", "jaimie", "matteo", "nic", "tim", "ren"],
  charlie: ["charlie", "ren", "jaimie", "ari", "matteo", "nic", "tim"],
};

export function whoIsComing(members: TripMember[], viewer: PhoneId = "ari") {
  const coming = members.filter((m) => m.status === "yes").map((m) => m.id);
  const ordered = NAME_ORDER[viewer].filter((id) => coming.includes(id));
  const names = ordered
    .slice(0, 3)
    .map((id) => (id === viewer ? "You" : PEOPLE[id].firstName));
  const others = coming.length - names.length;
  return others > 0
    ? `${names.join(", ")} +${others} others`
    : names.join(", ");
}

type TrippersCardProps = {
  members: TripMember[];
  viewer?: PhoneId;
  onInvite?: () => void;
  onSeeAll?: () => void;
  inviteClassName?: string;
};

// Hi-fi Trip view "Trippers Card" (Who's coming).
export function TrippersCard({
  members,
  viewer = "ari",
  onInvite,
  onSeeAll,
  inviteClassName,
}: TrippersCardProps) {
  const coming = members.filter((m) => m.status === "yes");
  const guests = coming.filter((m) => m.guest).length;
  const faces = NAME_ORDER[viewer].filter((id) =>
    coming.some((m) => m.id === id),
  );

  return (
    <section className="flex flex-col gap-3 rounded-md bg-lilac p-4">
      <SectionHeader title="Who’s coming" onLink={onSeeAll} />
      <div className="flex flex-col gap-2">
        <AvatarStack ids={faces.slice(0, 7)} />
        <p className="text-body-s text-ink-muted">
          {whoIsComing(members, viewer)}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="flex gap-2 text-body-s text-gunmetal">
          <span>
            {coming.length - guests}
            <span className="text-ink-muted"> coming</span>
          </span>
          {guests > 0 && (
            <span>
              {guests}
              <span className="text-ink-muted">
                {" "}
                {guests === 1 ? "guest" : "guests"}
              </span>
            </span>
          )}
        </p>
        <Button
          theme="light"
          onClick={onInvite}
          className={inviteClassName}
          rightIcon={<Icon framed name="people-add" size={20} />}
        >
          Invite
        </Button>
      </div>
    </section>
  );
}
