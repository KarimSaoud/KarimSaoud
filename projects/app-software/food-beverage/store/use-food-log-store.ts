"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { DEFAULT_PROFILE, DEFAULT_SETTINGS, MEAL_ORDER, SINGLE_USER_PROFILE, STORAGE_KEY } from "@/lib/constants";
import { getTodayKey } from "@/lib/date";
import { summarizeDayLog, scaleNutrients, ZERO_NUTRIENTS } from "@/lib/nutrients";
import { createId } from "@/lib/utils";
import {
  BodyMeasurementSnapshot,
  DayLog,
  EntrySource,
  HealthDocument,
  MealEntry,
  MealType,
  Nutrients,
  UserProfile,
  UserSettings,
  WaterEntry
} from "@/types";

type StoreState = {
  dayLogs: Record<string, DayLog>;
  selectedDate: string;
  settings: UserSettings;
  profile: UserProfile;
  measurementHistory: BodyMeasurementSnapshot[];
  healthDocuments: HealthDocument[];
  setSelectedDate: (date: string) => void;
  ensureDay: (date: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateProfile: (profile: UserProfile) => void;
  saveProfileSnapshot: () => void;
  deleteProfileSnapshot: (snapshotId: string) => void;
  addHealthDocument: (input: Omit<HealthDocument, "id" | "uploadedAt">) => void;
  removeHealthDocument: (documentId: string) => void;
  addMealEntry: (input: {
    mealType: MealType;
    name: string;
    brand?: string;
    quantity: number;
    unit: "g" | "ml" | "serving";
    baseUnit: "g" | "ml";
    nutrientsPer100: Nutrients;
    source: EntrySource;
    barcode?: string;
    imageUrl?: string;
    ingredients?: string;
    productId?: string;
  }) => void;
  updateMealQuantity: (date: string, mealType: MealType, entryId: string, quantity: number) => void;
  removeMealEntry: (date: string, mealType: MealType, entryId: string) => void;
  addWaterEntry: (date: string, amountMl: number, label?: string) => void;
  removeWaterEntry: (date: string, entryId: string) => void;
  duplicateDay: (sourceDate: string, targetDate: string) => void;
};

function buildEmptyDayLog(date: string): DayLog {
  return {
    date,
    meals: {
      breakfast: [],
      snack1: [],
      lunch: [],
      snack2: [],
      dinner: [],
      drinks: []
    },
    waterEntries: [],
    summary: {
      nutrients: ZERO_NUTRIENTS,
      waterMl: 0,
      caloriesByMeal: {
        breakfast: 0,
        snack1: 0,
        lunch: 0,
        snack2: 0,
        dinner: 0,
        drinks: 0
      }
    }
  };
}

function recalculate(dayLog: DayLog): DayLog {
  return {
    ...dayLog,
    summary: summarizeDayLog(dayLog)
  };
}

function normalizeSingleUserProfile(profile?: Partial<UserProfile>): UserProfile {
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    ...SINGLE_USER_PROFILE
  };
}

function normalizeSettings(settings?: Partial<UserSettings>): UserSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings
  };
}

export const useFoodLogStore = create<StoreState>()(
  persist(
    (set, get) => ({
      dayLogs: {},
      selectedDate: getTodayKey(),
      settings: DEFAULT_SETTINGS,
      profile: DEFAULT_PROFILE,
      measurementHistory: [],
      healthDocuments: [],
      setSelectedDate: (date) => {
        get().ensureDay(date);
        set({ selectedDate: date });
      },
      ensureDay: (date) => {
        set((state) => {
          if (state.dayLogs[date]) {
            return state;
          }

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: buildEmptyDayLog(date)
            }
          };
        });
      },
      updateSettings: (settings) => {
        set((state) => ({
          settings: normalizeSettings({
            ...state.settings,
            ...settings
          })
        }));
      },
      updateProfile: (profile) => {
        set({
          profile: {
            ...normalizeSingleUserProfile(profile),
            updatedAt: new Date().toISOString()
          }
        });
      },
      saveProfileSnapshot: () => {
        const profile = get().profile;
        set((state) => ({
          measurementHistory: [
            {
              id: createId("snapshot"),
              savedAt: new Date().toISOString(),
              profile: {
                ...profile,
                updatedAt: profile.updatedAt ?? new Date().toISOString()
              }
            },
            ...state.measurementHistory
          ]
        }));
      },
      deleteProfileSnapshot: (snapshotId) => {
        set((state) => ({
          measurementHistory: state.measurementHistory.filter((snapshot) => snapshot.id !== snapshotId)
        }));
      },
      addHealthDocument: (input) => {
        set((state) => ({
          healthDocuments: [
            {
              id: createId("document"),
              uploadedAt: new Date().toISOString(),
              ...input
            },
            ...state.healthDocuments
          ]
        }));
      },
      removeHealthDocument: (documentId) => {
        set((state) => ({
          healthDocuments: state.healthDocuments.filter((document) => document.id !== documentId)
        }));
      },
      addMealEntry: (input) => {
        const date = get().selectedDate;
        get().ensureDay(date);

        set((state) => {
          const dayLog = state.dayLogs[date] ?? buildEmptyDayLog(date);
          const entry: MealEntry = {
            id: createId("entry"),
            mealType: input.mealType,
            name: input.name,
            brand: input.brand,
            quantity: input.quantity,
            unit: input.unit,
            baseUnit: input.baseUnit,
            nutrientsPer100: input.nutrientsPer100,
            consumedNutrients: scaleNutrients(input.nutrientsPer100, input.quantity),
            source: input.source,
            barcode: input.barcode,
            imageUrl: input.imageUrl,
            ingredients: input.ingredients,
            productId: input.productId,
            createdAt: new Date().toISOString()
          };

          const nextDayLog = recalculate({
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [input.mealType]: [entry, ...dayLog.meals[input.mealType]]
            }
          });

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: nextDayLog
            }
          };
        });
      },
      updateMealQuantity: (date, mealType, entryId, quantity) => {
        set((state) => {
          const dayLog = state.dayLogs[date];
          if (!dayLog) {
            return state;
          }

          const nextEntries = dayLog.meals[mealType].map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  quantity,
                  consumedNutrients: scaleNutrients(entry.nutrientsPer100, quantity)
                }
              : entry
          );

          const nextDayLog = recalculate({
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [mealType]: nextEntries
            }
          });

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: nextDayLog
            }
          };
        });
      },
      removeMealEntry: (date, mealType, entryId) => {
        set((state) => {
          const dayLog = state.dayLogs[date];
          if (!dayLog) {
            return state;
          }

          const nextDayLog = recalculate({
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [mealType]: dayLog.meals[mealType].filter((entry) => entry.id !== entryId)
            }
          });

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: nextDayLog
            }
          };
        });
      },
      addWaterEntry: (date, amountMl, label = "Acqua") => {
        get().ensureDay(date);

        set((state) => {
          const dayLog = state.dayLogs[date] ?? buildEmptyDayLog(date);
          const waterEntry: WaterEntry = {
            id: createId("water"),
            amountMl,
            label,
            source: "quick-water",
            createdAt: new Date().toISOString()
          };

          const nextDayLog = recalculate({
            ...dayLog,
            waterEntries: [waterEntry, ...dayLog.waterEntries]
          });

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: nextDayLog
            }
          };
        });
      },
      removeWaterEntry: (date, entryId) => {
        set((state) => {
          const dayLog = state.dayLogs[date];
          if (!dayLog) {
            return state;
          }

          const nextDayLog = recalculate({
            ...dayLog,
            waterEntries: dayLog.waterEntries.filter((entry) => entry.id !== entryId)
          });

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: nextDayLog
            }
          };
        });
      },
      duplicateDay: (sourceDate, targetDate) => {
        const source = get().dayLogs[sourceDate];
        if (!source) {
          return;
        }

        const copiedMeals = MEAL_ORDER.reduce((acc, mealType) => {
          acc[mealType] = source.meals[mealType].map((entry) => ({
            ...entry,
            id: createId("entry"),
            createdAt: new Date().toISOString()
          }));
          return acc;
        }, {} as DayLog["meals"]);

        const copiedLog = recalculate({
          date: targetDate,
          meals: copiedMeals,
          waterEntries: source.waterEntries.map((entry) => ({
            ...entry,
            id: createId("water"),
            createdAt: new Date().toISOString()
          })),
          summary: source.summary
        });

        set((state) => ({
          dayLogs: {
            ...state.dayLogs,
            [targetDate]: copiedLog
          },
          selectedDate: targetDate
        }));
      }
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<StoreState> | undefined;

        return {
          ...currentState,
          ...persisted,
          settings: normalizeSettings(persisted?.settings),
          profile: normalizeSingleUserProfile(persisted?.profile)
        };
      },
      partialize: (state) => ({
        dayLogs: state.dayLogs,
        selectedDate: state.selectedDate,
        settings: state.settings,
        profile: state.profile,
        measurementHistory: state.measurementHistory,
        healthDocuments: state.healthDocuments
      })
    }
  )
);
