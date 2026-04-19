"use client";

import { useEffect } from "react";
import { Calendar, Copy } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { DailySummary } from "@/components/daily-summary";
import { MealCard } from "@/components/meal-card";
import { WaterQuickAdd } from "@/components/water-quick-add";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHydrated } from "@/hooks/use-hydrated";
import { MEAL_LABELS, MEAL_ORDER } from "@/lib/constants";
import { formatFullDate, getTodayKey } from "@/lib/date";
import { useFoodLogStore } from "@/store/use-food-log-store";

export default function HomePage() {
  const hydrated = useHydrated();
  const selectedDate = useFoodLogStore((state) => state.selectedDate);
  const dayLogs = useFoodLogStore((state) => state.dayLogs);
  const ensureDay = useFoodLogStore((state) => state.ensureDay);
  const setSelectedDate = useFoodLogStore((state) => state.setSelectedDate);
  const duplicateDay = useFoodLogStore((state) => state.duplicateDay);
  const addWaterEntry = useFoodLogStore((state) => state.addWaterEntry);
  const removeWaterEntry = useFoodLogStore((state) => state.removeWaterEntry);
  const removeMealEntry = useFoodLogStore((state) => state.removeMealEntry);
  const updateMealQuantity = useFoodLogStore((state) => state.updateMealQuantity);
  useEffect(() => {
    ensureDay(selectedDate);
  }, [ensureDay, selectedDate]);

  if (!hydrated) {
    return null;
  }

  const dayLog = dayLogs[selectedDate];

  if (!dayLog) {
    return null;
  }

  return (
    <AppShell currentPath="/">
      <section className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard giornaliera</p>
          <h2 className="mt-1 text-2xl font-semibold capitalize leading-tight">{formatFullDate(selectedDate)}</h2>
        </div>

        <Card className="w-full lg:max-w-xl">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm"
              />
            </div>
            <Button variant="outline" onClick={() => duplicateDay(selectedDate, getTodayKey())}>
              <Copy className="mr-2 h-4 w-4" />
              Duplica su oggi
            </Button>
          </CardContent>
        </Card>
      </section>

      <DailySummary dayLog={dayLog} />

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
        {MEAL_ORDER.filter((mealType) => mealType !== "drinks").map((mealType) => (
          <MealCard
            key={mealType}
            title={MEAL_LABELS[mealType]}
            mealType={mealType}
            entries={dayLog.meals[mealType]}
            onDelete={(entryId) => removeMealEntry(selectedDate, mealType, entryId)}
            onQuantityChange={(entryId, quantity) => updateMealQuantity(selectedDate, mealType, entryId, quantity)}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <MealCard
          title={MEAL_LABELS.drinks}
          mealType="drinks"
          entries={dayLog.meals.drinks}
          onDelete={(entryId) => removeMealEntry(selectedDate, "drinks", entryId)}
          onQuantityChange={(entryId, quantity) => updateMealQuantity(selectedDate, "drinks", entryId, quantity)}
        />

        <WaterQuickAdd
          totalMl={dayLog.summary.waterMl}
          entries={dayLog.waterEntries}
          onQuickAdd={(amountMl) => addWaterEntry(selectedDate, amountMl)}
          onDelete={(entryId) => removeWaterEntry(selectedDate, entryId)}
        />
      </section>
    </AppShell>
  );
}
