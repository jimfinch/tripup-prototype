import { create } from "zustand";
import { getStep, type StepId } from "@/data/steps";

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

export const useScenario = create<ScenarioState>((set) => ({
  ...initialState,

  goToStep: (step) => set({ step, sceneCard: getStep(step).sceneCard ?? null }),
  reset: () => set(initialState),
  dismissSplash: () => set({ splash: false }),
  dismissSceneCard: () => set({ sceneCard: null }),
  showToast: (message) => set({ toast: { id: ++toastId, message } }),
  dismissToast: () => set({ toast: null }),
}));

export const useCurrentStep = () => getStep(useScenario((s) => s.step));
