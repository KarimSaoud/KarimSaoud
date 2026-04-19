"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockProfile } from "@/data/mock-profile";
import { ClientProfile } from "@/types/profile";

interface ProfileStore {
  profile: ClientProfile;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  patchSection: <K extends keyof ClientProfile>(section: K, patch: Partial<ClientProfile[K]>) => void;
  replaceProfile: (profile: ClientProfile) => void;
  resetDraft: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: mockProfile,
      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(9, state.currentStep + 1) })),
      previousStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      patchSection: (section, patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            [section]: {
              ...state.profile[section],
              ...patch,
            },
          },
        })),
      replaceProfile: (profile) => set({ profile }),
      resetDraft: () => set({ profile: mockProfile, currentStep: 1 }),
    }),
    {
      name: "premium-consulting-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile, currentStep: state.currentStep }),
    },
  ),
);
