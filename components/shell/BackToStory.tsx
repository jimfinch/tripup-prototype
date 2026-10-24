"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCurrentStep } from "@/store/scenario";

// Returns a reviewer who has wandered off to wherever the story currently is.
export function BackToStory() {
  const { route } = useCurrentStep();
  return (
    <Button
      theme="light"
      href={route}
      rightIcon={<Icon framed name="arrow-right" size={20} />}
    >
      Back to the story
    </Button>
  );
}
