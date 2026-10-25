import { ManageGroupView } from "@/components/group/ManageGroupView";

// Only Intrepid travellers has a Manage group screen; the other cards toast.
export function generateStaticParams() {
  return [{ groupId: "intrepid" }];
}

export default function ManageGroupPage() {
  return <ManageGroupView />;
}
