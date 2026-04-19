export type Nutrients = {
  calories: number;
  protein: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  fiber: number;
  salt: number;
  sodium?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  magnesium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminB12?: number;
};

export type MealType =
  | "breakfast"
  | "snack1"
  | "lunch"
  | "snack2"
  | "dinner"
  | "drinks";

export type EntrySource = "manual" | "search" | "barcode" | "quick-water";

export type ConsumptionUnit = "g" | "ml" | "serving";

export type FoodProduct = {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  imageUrl?: string;
  ingredients?: string;
  baseUnit: "g" | "ml";
  nutrientsPer100: Nutrients;
  dataSource: "manual" | "open-food-facts";
};

export type MealEntry = {
  id: string;
  productId?: string;
  mealType: MealType;
  name: string;
  brand?: string;
  quantity: number;
  unit: ConsumptionUnit;
  baseUnit: "g" | "ml";
  nutrientsPer100: Nutrients;
  consumedNutrients: Nutrients;
  source: EntrySource;
  barcode?: string;
  imageUrl?: string;
  ingredients?: string;
  createdAt: string;
};

export type WaterEntry = {
  id: string;
  amountMl: number;
  label: string;
  createdAt: string;
  source: EntrySource;
};

export type DaySummary = {
  nutrients: Nutrients;
  waterMl: number;
  caloriesByMeal: Record<MealType, number>;
};

export type DayLog = {
  date: string;
  meals: Record<MealType, MealEntry[]>;
  waterEntries: WaterEntry[];
  summary: DaySummary;
};

export type UserSettings = {
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  saturatedFatTarget: number;
  sugarsTarget: number;
  fiberTarget: number;
  waterTargetMl: number;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  heightCm: number | null;
  weightKg: number | null;
  goalWeightKg: number | null;
  leanMassKg: number | null;
  goalLeanMassKg: number | null;
  fatMassKg: number | null;
  goalFatMassKg: number | null;
  updatedAt?: string;
};

export type BodyMeasurementSnapshot = {
  id: string;
  savedAt: string;
  profile: UserProfile;
};

export type HealthDocument = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  notes?: string;
  dataUrl: string;
};
