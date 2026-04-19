import type { DayLog, MealEntry, Nutrients, WaterEntry } from "@/types";
import { MEAL_ORDER } from "./constants";

export const ZERO_NUTRIENTS: Nutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  sugars: 0,
  fat: 0,
  saturatedFat: 0,
  fiber: 0,
  salt: 0,
  sodium: 0,
  calcium: 0,
  iron: 0,
  potassium: 0,
  magnesium: 0,
  vitaminA: 0,
  vitaminC: 0,
  vitaminD: 0,
  vitaminB12: 0
};

const OPTIONAL_KEYS: (keyof Nutrients)[] = [
  "sodium",
  "calcium",
  "iron",
  "potassium",
  "magnesium",
  "vitaminA",
  "vitaminC",
  "vitaminD",
  "vitaminB12"
];

export function mergeNutrients(
  left: Nutrients = ZERO_NUTRIENTS,
  right: Partial<Nutrients> = ZERO_NUTRIENTS
): Nutrients {
  const result: Nutrients = {
    calories: left.calories + (right.calories ?? 0),
    protein: left.protein + (right.protein ?? 0),
    carbs: left.carbs + (right.carbs ?? 0),
    sugars: left.sugars + (right.sugars ?? 0),
    fat: left.fat + (right.fat ?? 0),
    saturatedFat: left.saturatedFat + (right.saturatedFat ?? 0),
    fiber: left.fiber + (right.fiber ?? 0),
    salt: left.salt + (right.salt ?? 0)
  };

  OPTIONAL_KEYS.forEach((key) => {
    result[key] = (left[key] ?? 0) + (right[key] ?? 0);
  });

  return result;
}

export function scaleNutrients(nutrientsPer100: Nutrients, quantity: number) {
  const factor = quantity / 100;

  return {
    calories: nutrientsPer100.calories * factor,
    protein: nutrientsPer100.protein * factor,
    carbs: nutrientsPer100.carbs * factor,
    sugars: nutrientsPer100.sugars * factor,
    fat: nutrientsPer100.fat * factor,
    saturatedFat: nutrientsPer100.saturatedFat * factor,
    fiber: nutrientsPer100.fiber * factor,
    salt: nutrientsPer100.salt * factor,
    sodium: (nutrientsPer100.sodium ?? 0) * factor,
    calcium: (nutrientsPer100.calcium ?? 0) * factor,
    iron: (nutrientsPer100.iron ?? 0) * factor,
    potassium: (nutrientsPer100.potassium ?? 0) * factor,
    magnesium: (nutrientsPer100.magnesium ?? 0) * factor,
    vitaminA: (nutrientsPer100.vitaminA ?? 0) * factor,
    vitaminC: (nutrientsPer100.vitaminC ?? 0) * factor,
    vitaminD: (nutrientsPer100.vitaminD ?? 0) * factor,
    vitaminB12: (nutrientsPer100.vitaminB12 ?? 0) * factor
  };
}

export function sumMealEntries(entries: MealEntry[]) {
  return entries.reduce(
    (acc, entry) => mergeNutrients(acc, entry.consumedNutrients),
    ZERO_NUTRIENTS
  );
}

export function summarizeDayLog(dayLog: DayLog) {
  const caloriesByMeal = {
    breakfast: 0,
    snack1: 0,
    lunch: 0,
    snack2: 0,
    dinner: 0,
    drinks: 0
  };

  let nutrients = ZERO_NUTRIENTS;

  MEAL_ORDER.forEach((mealType) => {
    const subtotal = sumMealEntries(dayLog.meals[mealType]);
    caloriesByMeal[mealType] = subtotal.calories;
    nutrients = mergeNutrients(nutrients, subtotal);
  });

  const waterMl = dayLog.waterEntries.reduce(
    (acc: number, entry: WaterEntry) => acc + entry.amountMl,
    0
  );

  return {
    nutrients,
    waterMl,
    caloriesByMeal
  };
}
