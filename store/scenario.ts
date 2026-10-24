import { create } from "zustand";
import { getStep, PHONE_LABEL, type StepId } from "@/data/steps";

// One in-memory store for the whole scenario. A reload resets the demo.
// Trip, poll and payment data are added in Phase 5.

type Toast = { id: number; message: string };

type ScenarioState = {
  step: StepId;
  splash: boolean;
  sceneCard: string | null;
  toast: Toast | null;

  goToStep: (step: StepId) => void;
  reset: () => void;
  dismissSplash: () => void;
  dismissSceneCard: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
};

const initialState = {
  step: 1 as StepId,
  splash: true,
  sceneCard: null,
  toast: null,
};

let toastId = 0;

// On a real phone the fake status bar is hidden (the OS draws its own), so the
// story's phone and clock are announced with a scene card after the splash.
const isPhoneViewport = () =>
  typeof window !== "undefined" &&
  !window.matchMedia("(min-width: 431px)").matches;

export const useScenario = create<ScenarioState>((set, get) => ({
  ...initialState,

  goToStep: (step) => set({ step, sceneCard: getStep(step).sceneCard ?? null }),
  reset: () => set(initialState),
  dismissSplash: () => {
    const { phone, clock } = getStep(get().step);
    set({
      splash: false,
      sceneCard: isPhoneViewport() ? `${PHONE_LABEL[phone]} · ${clock}` : null,
    });
  },
  dismissSceneCard: () => set({ sceneCard: null }),
  showToast: (message) => set({ toast: { id: ++toastId, message } }),
  dismissToast: () => set({ toast: null }),
}));

export const useCurrentStep = () => getStep(useScenario((s) => s.step));
