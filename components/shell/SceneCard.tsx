"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useScenario } from "@/store/scenario";

const SCENE_CARD_MS = 2200;

// Signals a jump in the story (another phone, a time skip). Shown for ~2.2 s
// or until tapped.
export function SceneCard() {
  const sceneCard = useScenario((s) => s.sceneCard);
  const dismiss = useScenario((s) => s.dismissSceneCard);

  useEffect(() => {
    if (!sceneCard) return;
    const t = setTimeout(dismiss, SCENE_CARD_MS);
    return () => clearTimeout(t);
  }, [sceneCard, dismiss]);

  return (
    <AnimatePresence>
      {sceneCard && (
        <motion.button
          type="button"
          onClick={dismiss}
          aria-live="polite"
          className="absolute inset-0 z-50 flex items-center justify-center bg-gunmetal/80 px-8 backdrop-blur-glass"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="rounded-pill bg-white px-6 py-3 text-title-s text-gunmetal"
            initial={{ y: 8, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {sceneCard}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
