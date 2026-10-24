"use client";

import { AttendeeRow } from "@/components/group/AttendeeRow";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Toggle } from "@/components/ui/Toggle";
import { LISBON, PEOPLE, type PersonId } from "@/data/seed";
import { useHint } from "@/lib/hints";
import { cn } from "@/lib/cn";
import { useScenario } from "@/store/scenario";

const CONTACTS: PersonId[] = ["jon", "tristan", "maria"];

// Step 03: Invite people (wireflow 03 + Working "Invite view" states).
export function InviteSheet({ open }: { open: boolean }) {
  const s = useScenario();
  const hintAddRen = useHint("add-ren");
  const hintGuest = useHint("ren-guest");
  const hintInviteRen = useHint("invite-ren");

  const invitedIds = s.members.map((m) => m.id);
  const coming = s.members.filter((m) => m.status === "yes" && !m.guest).length;
  const guests = s.members.filter((m) => m.status === "yes" && m.guest).length;
  const listed = [...s.members].sort((a, b) =>
    a.id === "ari"
      ? -1
      : b.id === "ari"
        ? 1
        : PEOPLE[a.id].name.localeCompare(PEOPLE[b.id].name),
  );

  return (
    <Sheet
      open={open}
      onClose={s.closeSheet}
      title="Invite people"
      closeHint="close-sheet"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-title-l text-gunmetal">
            Grow the {LISBON.name} trip
          </p>
          <p className="text-body-s text-ink-muted">{LISBON.dates}</p>
        </div>

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
              onClick={() => s.showToast("Invite link copied")}
              className="flex h-25 flex-1 items-center justify-center gap-2 rounded-md bg-off-white text-headline text-gunmetal transition active:scale-press"
            >
              {label}
              <Icon framed name={icon} size={20} />
            </button>
          ))}
        </div>

        <section className="flex flex-col gap-4">
          <h3 className="text-title-m text-gunmetal">Invite from contacts</h3>
          <div className="flex gap-2">
            {/* Groups aren't part of inviting yet (CLAUDE.md §5): visibly inactive. */}
            <Button
              theme="secondary"
              disabled
              rightIcon={<Icon framed name="plus" size={20} />}
            >
              Add group
            </Button>
            <Button
              theme="secondary"
              className="flex-1"
              onClick={s.notInPrototype}
              rightIcon={<Icon framed name="search" size={20} />}
            >
              Search contacts
            </Button>
          </div>
          <ul>
            {CONTACTS.map((id) => {
              const invited = invitedIds.includes(id);
              return (
                <AttendeeRow
                  key={id}
                  id={id}
                  name={PEOPLE[id].name}
                  trailing={
                    invited ? (
                      <InvitedChip />
                    ) : (
                      <Button
                        theme="secondary"
                        onClick={() => s.inviteContact(id)}
                      >
                        Add to trip
                      </Button>
                    )
                  }
                />
              );
            })}
            <li className="flex flex-col gap-3 border-b border-gunmetal/10 py-3">
              <div className="flex items-center justify-between">
                <AttendeeRow.Identity
                  id="ren"
                  name={PEOPLE.ren.name}
                  sublabel={
                    s.renInvite === "invited" || s.renInvite === "accepted"
                      ? s.renGuest
                        ? "Guest"
                        : undefined
                      : undefined
                  }
                />
                {s.renInvite === "none" && (
                  <Button
                    theme="secondary"
                    className={hintAddRen}
                    onClick={s.startRenInvite}
                  >
                    Add to trip
                  </Button>
                )}
                {(s.renInvite === "invited" || s.renInvite === "accepted") && (
                  <InvitedChip />
                )}
              </div>
              {s.renInvite === "adding" && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-body-s text-ink-muted">
                    Guest
                    <Toggle
                      label="Invite Ren as a guest"
                      checked={s.renGuest}
                      onChange={s.setRenGuest}
                      className={hintGuest}
                    />
                  </span>
                  <Button
                    theme="light"
                    className={hintInviteRen}
                    onClick={s.inviteRen}
                    rightIcon={<Icon framed name="plus" size={20} />}
                  >
                    Invite
                  </Button>
                </div>
              )}
            </li>
          </ul>
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
            <h3 className="text-title-m text-gunmetal">Invited</h3>
            <p className="flex gap-2 text-label text-gunmetal">
              <span>
                {s.members.length}
                <span className="text-body-s text-ink-muted"> invited</span>
              </span>
              <span>
                {coming}
                <span className="text-body-s text-ink-muted"> coming</span>
              </span>
              {guests > 0 && (
                <span>
                  {guests}
                  <span className="text-body-s text-ink-muted">
                    {" "}
                    {guests === 1 ? "guest" : "guests"}
                  </span>
                </span>
              )}
            </p>
          </div>
          <ul>
            {listed.map((m) => (
              <AttendeeRow
                key={m.id}
                id={m.id}
                name={m.id === "ari" ? "You" : PEOPLE[m.id].name}
                sublabel={m.guest ? "Guest" : undefined}
                status={m.status}
              />
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  );
}

function InvitedChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-pill bg-gunmetal pl-4.5 pr-4 text-label text-white",
        className,
      )}
    >
      Invited
      <Icon framed name="check" size={20} />
    </span>
  );
}
