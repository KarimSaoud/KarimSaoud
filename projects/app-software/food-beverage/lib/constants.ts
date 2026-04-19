import type { MealType, UserProfile, UserSettings } from "@/types";

export const MEAL_ORDER: MealType[] = [
  "breakfast",
  "snack1",
  "lunch",
  "snack2",
  "dinner",
  "drinks"
];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Colazione",
  snack1: "Spuntino 1",
  lunch: "Pranzo",
  snack2: "Spuntino 2",
  dinner: "Cena",
  drinks: "Acqua / Bevande"
};

export const DEFAULT_SETTINGS: UserSettings = {
  calorieTarget: 2100,
  proteinTarget: 120,
  carbsTarget: 240,
  fatTarget: 70,
  fiberTarget: 28,
  waterTargetMl: 2000
};

export const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  birthDate: "",
  heightCm: null,
  weightKg: null,
  goalWeightKg: null,
  leanMassKg: null,
  goalLeanMassKg: null,
  fatMassKg: null,
  goalFatMassKg: null
};

export const STORAGE_KEY = "food-beverage-tracker-v1";
