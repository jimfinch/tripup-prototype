"use client";

import Image from "next/image";
import { useState } from "react";
import { AttendeeRow } from "@/components/group/AttendeeRow";
import { GroupImage } from "@/components/group/GroupImage";
import { InvitedChip } from "@/components/group/InvitedChip";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { PhotoPickerSheet } from "@/components/sheets/PhotoPickerSheet";
import { AvatarStack } from "@/components/ui/Avatar";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  GROUPS,
  INTREPID_MEMBERS,
  INTREPID_TRIPS,
  PEOPLE,
  type PersonId,
} from "@/data/seed";
import { useScenario } from "@/store/scenario";

const CONTACTS: PersonId[] = ["jon", "tristan", "maria", "ren"];

// Working "Manage group view" for Intrepid travellers (the group Ari created).
export function ManageGroupView() {
  const s = useScenario();
  const group = GROUPS.find((g) => g.id === "intrepid")!;
  const [picker, setPicker] = useState(false);
  // Contacts added here join as Pending; this screen isn't part of the story,
  // so the additions live only while it's open.
  const [added, setAdded] = useState<PersonId[]>([]);

  const members = [
    ...INTREPID_MEMBERS,
    ...added.map((id) => ({ id, status: "pending" as const })),
  ];
  const joined = members.filter((m) => m.status === "yes").length;

  const pick = (src: string) => {
    s.setGroupImage(src);
    setPicker(false);
    s.showToast("Group image added");
  };

  return (
    <Screen
      tabBar
      className="bg-white"
      overlays={
        <>
          <StatusScrim />
          <PhotoPickerSheet
            open={picker}
            onClose={() => setPicker(false)}
            onPick={pick}
          />
        </>
      }
    >
      <div className="flex flex-col gap-8 px-4 pb-33 pt-status-bar">
        <div className="relative box-content flex h-10 items-center justify-center pt-2">
          <div className="absolute left-0">
            <BackButton href="/groups/" label="Back to groups" />
          </div>
          <h1 className="text-title-m text-gunmetal">Manage group</h1>
          <div className="absolute right-0">
            <button
              type="button"
              aria-label="Group options"
              onClick={s.notInPrototype}
              className="tap-target flex size-10 items-center justify-center rounded-pill text-gunmetal transition active:scale-press"
            >
              <Icon framed name="kebab" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-title-l text-gunmetal">{group.name}</p>
          <p className="text-body-s text-ink-muted">
            <span className="text-gunmetal">{joined}</span> members,{" "}
            <span className="text-gunmetal">{group.tripsTogether}</span> trips
            together
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPicker(true)}
            className="relative flex h-35 flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed border-gunmetal/50 text-headline text-gunmetal transition active:scale-press"
          >
            {s.groupImage ? (
              <>
                <Image
                  src={s.groupImage}
                  alt=""
                  fill
                  sizes="398px"
                  className="object-cover"
                />
                <span className="relative flex h-10 items-center gap-1.5 rounded-pill bg-white px-4.5 text-label">
                  Change group image
                  <Icon framed name="image" size={20} />
                </span>
              </>
            ) : (
              <>
                <Icon name="image" />
                Add group image
              </>
            )}
          </button>
          <div className="flex gap-2">
            {(
              [
                ["Share", "share"],
                ["Copy link", "copy"],
              ] as const
            ).map(([label, icon]) => (
              <button
                key={label}
                type="button"
                onClick={() => s.showToast("Group link copied")}
                className="flex h-25 flex-1 items-center justify-center gap-2 rounded-md bg-off-white text-headline text-gunmetal transition active:scale-press"
              >
                {label}
                <Icon framed name={icon} size={20} />
              </button>
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-title-m text-gunmetal">Invite from contacts</h2>
          <div>
            <Button
              theme="secondary"
              fullWidth
              onClick={s.notInPrototype}
              rightIcon={<Icon framed name="search" size={20} />}
            >
              Search contacts
            </Button>
            <ul>
              {CONTACTS.map((id) => (
                <AttendeeRow
                  key={id}
                  id={id}
                  name={PEOPLE[id].name}
                  trailing={
                    added.includes(id) ? (
                      <InvitedChip />
                    ) : (
                      <Button
                        theme="secondary"
                        onClick={() => setAdded((a) => [...a, id])}
                      >
                        Add to group
                      </Button>
                    )
                  }
                />
              ))}
            </ul>
          </div>
          <Button
            theme="light"
            size="xl"
            onClick={s.notInPrototype}
            rightIcon={<Icon name="plus" />}
          >
            Add a new contact
          </Button>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-title-m text-gunmetal">Who’s joined</h2>
            <p className="flex gap-2 text-label text-gunmetal">
              <span>
                {members.length}
                <span className="text-body-s text-ink-muted"> invited</span>
              </span>
              <span>
                {joined}
                <span className="text-body-s text-ink-muted"> joined</span>
              </span>
            </p>
          </div>
          <ul>
            {members.map((m) => (
              <AttendeeRow
                key={m.id}
                id={m.id}
                name={m.id === "ari" ? "You" : PEOPLE[m.id].name}
                status={m.status === "yes" ? "yes" : "pending"}
              />
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-title-m text-gunmetal">Trips together</h2>
          <div className="flex flex-col gap-2">
            {INTREPID_TRIPS.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={s.notInPrototype}
                className="flex items-center gap-3 rounded-md bg-lilac p-4 text-left transition-opacity active:opacity-80"
              >
                <GroupImage src={t.image} position={t.imagePosition} />
                <span className="flex flex-1 flex-col justify-center gap-0.5">
                  <span className="text-title-m text-gunmetal">{t.name}</span>
                  <span className="text-headline text-ink-muted">
                    {t.dates}
                  </span>
                  <AvatarStack ids={t.faces} className="py-1" />
                  <span className="text-body-s text-ink-muted">
                    Organised by{" "}
                    <span className="font-semibold text-gunmetal">
                      {PEOPLE[t.organiser].firstName}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          <Button theme="secondary" fullWidth onClick={s.notInPrototype}>
            View all
          </Button>
        </section>
      </div>
    </Screen>
  );
}
