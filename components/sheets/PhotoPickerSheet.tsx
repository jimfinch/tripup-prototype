"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { Sheet } from "@/components/ui/Sheet";
import { RECENT_PHOTOS } from "@/data/seed";
import { useScenario } from "@/store/scenario";

type PhotoPickerSheetProps = {
  open: boolean;
  onClose: () => void;
  onPick: (src: string) => void;
};

// Working "Attach Sheet": the Recents grid, camera tile spanning two rows.
// The photos are the trip images already in the prototype.
export function PhotoPickerSheet({
  open,
  onClose,
  onPick,
}: PhotoPickerSheetProps) {
  const notInPrototype = useScenario((s) => s.notInPrototype);
  return (
    <Sheet open={open} onClose={onClose} title="Recents">
      <div className="-mx-5 grid grid-cols-3 gap-px">
        <button
          type="button"
          aria-label="Take a photo"
          onClick={notInPrototype}
          className="row-span-2 flex items-start justify-end bg-gunmetal p-1.5 text-white transition-opacity active:opacity-80"
        >
          <Camera aria-hidden size={26} strokeWidth={1.5} />
        </button>
        {RECENT_PHOTOS.map((src) => (
          <button
            key={src}
            type="button"
            aria-label="Use this photo"
            onClick={() => onPick(src)}
            className="group relative aspect-square overflow-hidden bg-gunmetal transition-opacity active:opacity-80"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="144px"
              className="object-cover"
            />
            <span className="absolute right-1.5 top-1.5 size-5.5 rounded-pill border-1.5 border-white" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}
