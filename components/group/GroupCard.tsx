import Link from "next/link";
import { GroupImage } from "@/components/group/GroupImage";
import { AvatarStack } from "@/components/ui/Avatar";
import { PEOPLE, type Group } from "@/data/seed";

type GroupCardProps = {
  group: Group;
  image?: string | null;
  // Manage group exists for Intrepid travellers only; other cards say so.
  href?: string;
  onOpen?: () => void;
};

// Working "Home view - Group tab" card, in the hi-fi Trip Card styling.
export function GroupCard({ group, image, href, onOpen }: GroupCardProps) {
  const creator =
    group.createdBy === "ari" ? "you" : PEOPLE[group.createdBy].firstName;
  const body = (
    <>
      <GroupImage src={image} position={group.imagePosition} />
      <span className="flex flex-1 flex-col justify-center gap-1">
        <span className="text-title-m text-gunmetal">{group.name}</span>
        <AvatarStack
          ids={group.faces}
          overflow={group.overflow}
          className="py-1"
        />
        <span className="text-body-s text-ink-muted">
          Created by <span className="text-gunmetal">{creator}</span>
        </span>
        <span className="text-body-s text-ink-muted">
          <span className="text-gunmetal">{group.tripsTogether}</span> trips
          together
        </span>
      </span>
    </>
  );
  const classes =
    "flex w-full items-center gap-3 rounded-md bg-lilac p-4 text-left transition-opacity active:opacity-80";

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onOpen} className={classes}>
      {body}
    </button>
  );
}
