import Image from "next/image";

// "1 live poll ✋" / "2 payments due 💳" labels on the dark trip cards.
export function TripStat({
  label,
  icon,
}: {
  label: string;
  icon: "poll" | "card";
}) {
  return (
    <p className="flex h-3.5 items-center gap-1 text-body-s text-white/60">
      {label}
      <Image src={`/icons/stat-${icon}.svg`} alt="" width={22} height={22} />
    </p>
  );
}

export const pluralise = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
