import assert from "node:assert/strict";
import test from "node:test";

import { scaleNutrients, summarizeDayLog, ZERO_NUTRIENTS } from "../lib/nutrients";
import type { DayLog, MealEntry, Nutrients } from "../types";

const nutrientsPer100: Nutrients = {
  calories: 200,
  protein: 10,
  carbs: 20,
  sugars: 4,
  fat: 8,
  saturatedFat: 2,
  fiber: 3,
  salt: 1
};

test("scaleNutrients scales every tracked nutrient by consumed quantity", () => {
  assert.deepEqual(scaleNutrients(nutrientsPer100, 50), {
    calories: 100,
    protein: 5,
    carbs: 10,
    sugars: 2,
    fat: 4,
    saturatedFat: 1,
    fiber: 1.5,
    salt: 0.5,
    sodium: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    magnesium: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminB12: 0
  });
});

test("summarizeDayLog totals nutrients, meal calories and water entries", () => {
  const entry: MealEntry = {
    id: "entry-1",
    mealType: "breakfast",
    name: "Yogurt",
    quantity: 50,
    unit: "g",
    baseUnit: "g",
    nutrientsPer100,
    consumedNutrients: scaleNutrients(nutrientsPer100, 50),
    source: "manual",
    createdAt: "2026-04-19T00:00:00.000Z"
  };

  const dayLog: DayLog = {
    date: "2026-04-19",
    meals: {
      breakfast: [entry],
      snack1: [],
      lunch: [],
      snack2: [],
      dinner: [],
      drinks: []
    },
    waterEntries: [
      { id: "water-1", amountMl: 250, label: "Acqua", source: "quick-water", createdAt: "2026-04-19T00:00:00.000Z" },
      { id: "water-2", amountMl: 500, label: "Acqua", source: "quick-water", createdAt: "2026-04-19T01:00:00.000Z" }
    ],
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

  const summary = summarizeDayLog(dayLog);
  assert.equal(summary.nutrients.calories, 100);
  assert.equal(summary.caloriesByMeal.breakfast, 100);
  assert.equal(summary.caloriesByMeal.lunch, 0);
  assert.equal(summary.waterMl, 750);
});
