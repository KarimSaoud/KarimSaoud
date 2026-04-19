"use client";

import { useEffect } from "react";
import { Calendar, Copy } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { DailySummary } from "@/components/daily-summary";
import { MealCard } from "@/components/meal-card";
import { WaterQuickAdd } from "@/components/water-quick-add";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { MEAL_LABELS, MEAL_ORDER } from "@/lib/constants";
import { getTodayKey } from "@/lib/date";
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
      <section className="mb-5 flex justify-end">
        <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,13rem)_auto] sm:items-center lg:w-auto">
          <label className="relative block">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-3 text-sm leading-none"
            />
          </label>
          <Button
            variant="outline"
            onClick={() => duplicateDay(selectedDate, getTodayKey())}
            className="h-11 whitespace-nowrap px-4"
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplica su oggi
          </Button>
        </div>
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

      <section className="mt-6">
        <WaterQuickAdd
          totalMl={dayLog.summary.waterMl}
          entries={dayLog.waterEntries}
          onQuickAdd={(amountMl, label) => addWaterEntry(selectedDate, amountMl, label)}
          onDelete={(entryId) => removeWaterEntry(selectedDate, entryId)}
        />
      </section>
    </AppShell>
  );
}
