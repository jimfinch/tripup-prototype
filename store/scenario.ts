import { create } from "zustand";
import {
  ACTIVITIES,
  FADO_POLL,
  LISBON_MEMBERS,
  STAY,
  type Activity,
  type Poll,
  type Stay,
  type TripMember,
} from "@/data/seed";
import { getStep, PHONE_LABEL, type StepId } from "@/data/steps";

// One in-memory store for the whole scenario. A reload resets the demo.

type Toast = { id: number; message: string };

type ScenarioState = {
  step: StepId;
  splash: boolean;
  sceneCard: string | null;
  toast: Toast | null;

  members: TripMember[];
  activities: Activity[];
  stay: Stay;
  polls: Poll[];

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
  members: LISBON_MEMBERS,
  activities: ACTIVITIES,
  stay: STAY,
  polls: [FADO_POLL],
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

// ---------------------------------------------------------------------------
// Derived values (selectors)

type State = ReturnType<typeof useScenario.getState>;

export const selectLivePolls = (s: State) =>
  s.polls.filter((p) => p.status === "live");

// Unpaid items Ari owes a share on.
export const selectPaymentsDue = (s: State) =>
  s.activities.filter((a) => !a.paid).length + (s.stay.paid ? 0 : 1);

// What "Settle trip" pays: every unpaid share (net of what others owe Ari,
// added with the dinner bill in Phase 5).
export const selectSettleTotal = (s: State) =>
  s.activities.filter((a) => !a.paid).reduce((sum, a) => sum + a.share, 0) +
  (s.stay.paid ? 0 : s.stay.share);

export const selectUnpaidActivityTotal = (s: State) =>
  s.activities.filter((a) => !a.paid).reduce((sum, a) => sum + a.share, 0);
