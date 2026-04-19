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
  saturatedFatTarget: 22,
  sugarsTarget: 50,
  fiberTarget: 28,
  waterTargetMl: 2000
};

export const SINGLE_USER_PROFILE: Pick<UserProfile, "firstName" | "lastName" | "birthDate" | "birthPlace" | "heightCm"> = {
  firstName: "Karim",
  lastName: "Saoud",
  birthDate: "1995-06-17",
  birthPlace: "Firenze",
  heightCm: 180
};

export const DEFAULT_PROFILE: UserProfile = {
  ...SINGLE_USER_PROFILE,
  weightKg: null,
  goalWeightKg: null,
  leanMassKg: null,
  goalLeanMassKg: null,
  fatMassKg: null,
  goalFatMassKg: null
};

export const STORAGE_KEY = "food-beverage-tracker-v1";
