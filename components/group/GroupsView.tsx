"use client";

import { useState } from "react";
import { GroupCard } from "@/components/group/GroupCard";
import { MainNav } from "@/components/shell/MainNav";
import { Screen } from "@/components/shell/Screen";
import { StatusScrim } from "@/components/shell/StatusScrim";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GROUPS, type Group } from "@/data/seed";
import { useScenario } from "@/store/scenario";

// Home › Groups (Working "Home view - Group tab").
export function GroupsView() {
  const [scrolled, setScrolled] = useState(false);
  const groupImage = useScenario((s) => s.groupImage);
  const notInPrototype = useScenario((s) => s.notInPrototype);

  const card = (g: Group) => (
    <GroupCard
      key={g.id}
      group={g}
      image={g.id === "intrepid" ? groupImage : g.image}
      href={g.id === "intrepid" ? `/groups/${g.id}/` : undefined}
      onOpen={notInPrototype}
    />
  );

  return (
    <Screen
      tabBar
      className="bg-white"
      onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
      overlays={
        <>
          <StatusScrim tone="none" visible={scrolled} />
          <MainNav active="groups" compact={scrolled} />
        </>
      }
    >
      <div className="flex flex-col gap-5 px-4 pb-39 pt-below-nav">
        <Button
          theme="light"
          size="xl"
          onClick={notInPrototype}
          rightIcon={<Icon name="plus" />}
        >
          Add new group
        </Button>

        <section className="flex flex-col gap-5">
          <h2 className="text-title-m text-gunmetal">Your groups</h2>
          <div className="flex flex-col gap-2">
            {GROUPS.filter((g) => g.mine).map(card)}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-title-m text-gunmetal">Other groups</h2>
          <div className="flex flex-col gap-2">
            {GROUPS.filter((g) => !g.mine).map(card)}
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            theme="secondary"
            onClick={notInPrototype}
            rightIcon={<Icon framed name="arrow-right" size={20} />}
          >
            Archive
          </Button>
        </div>
      </div>
    </Screen>
  );
}
