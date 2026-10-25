"use client";

import { useRouter } from "next/navigation";
import { useScenario } from "@/store/scenario";

// New poll from a polls page: open the form over the Lisbon trip view, where
// the poll sheets live.
export function useNewPoll() {
  const router = useRouter();
  const openSheet = useScenario((s) => s.openSheet);
  return () => {
    openSheet({ kind: "createPoll" });
    router.push("/trips/lisbon/");
  };
}
