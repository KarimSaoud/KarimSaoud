"use client";

import { Plus } from "lucide-react";

import { AddEntrySheet } from "@/components/add-entry-sheet";
import { EntryRow } from "@/components/entry-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { sumMealEntries } from "@/lib/nutrients";
import { formatNumber } from "@/lib/utils";
import { useFoodLogStore } from "@/store/use-food-log-store";
import { MealEntry, MealType, Nutrients, UserSettings } from "@/types";

type GoalKey = keyof Pick<
  UserSettings,
  "waterTargetMl" | "calorieTarget" | "fatTarget" | "saturatedFatTarget" | "carbsTarget" | "sugarsTarget" | "fiberTarget"
>;

const mealGoalRows: Array<{
  key: GoalKey;
  label: string;
  unit: "ml" | "kcal" | "g";
  getValue: (nutrients: Nutrients) => number;
}> = [
  { key: "waterTargetMl", label: "Acqua", unit: "ml", getValue: () => 0 },
  { key: "calorieTarget", label: "Kcal", unit: "kcal", getValue: (nutrients) => nutrients.calories },
  { key: "fatTarget", label: "Grassi", unit: "g", getValue: (nutrients) => nutrients.fat },
  { key: "saturatedFatTarget", label: "Saturi", unit: "g", getValue: (nutrients) => nutrients.saturatedFat },
  { key: "carbsTarget", label: "Carboidrati", unit: "g", getValue: (nutrients) => nutrients.carbs },
  { key: "sugarsTarget", label: "Zuccheri", unit: "g", getValue: (nutrients) => nutrients.sugars },
  { key: "fiberTarget", label: "Fibre", unit: "g", getValue: (nutrients) => nutrients.fiber }
];

export function MealCard({
  title,
  mealType,
  entries,
  onDelete,
  onQuantityChange
}: {
  title: string;
  mealType: MealType;
  entries: MealEntry[];
  onDelete: (entryId: string) => void;
  onQuantityChange: (entryId: string, quantity: number) => void;
}) {
  const settings = useFoodLogStore((state) => state.settings);
  const updateSettings = useFoodLogStore((state) => state.updateSettings);
  const subtotal = sumMealEntries(entries);
  const showMealGoals = mealType !== "drinks";

  const handleGoalChange = (key: GoalKey, value: string) => {
    const parsed = Number(value);
    updateSettings({ [key]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
        </div>
        <AddEntrySheet mealType={mealType}>
          <Button size="sm" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi
          </Button>
        </AddEntrySheet>
      </CardHeader>
      <CardContent className="space-y-3">
        {showMealGoals ? (
          <div className="space-y-3 rounded-lg bg-secondary/40 p-3">
            {mealGoalRows.map((row) => {
              const value = row.getValue(subtotal);
              const target = settings[row.key];
              const percentage = target > 0 ? (value / target) * 100 : 0;

              return (
                <MealGoalProgressRow
                  key={row.key}
                  label={row.label}
                  unit={row.unit}
                  value={value}
                  target={target}
                  percentage={percentage}
                  onTargetChange={(nextValue) => handleGoalChange(row.key, nextValue)}
                />
              );
            })}
          </div>
        ) : null}

        {entries.length > 0 ? (
          entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onDelete={() => onDelete(entry.id)}
              onQuantityChange={(quantity) => onQuantityChange(entry.id, quantity)}
            />
          ))
        ) : null}
      </CardContent>
    </Card>
  );
}

function MealGoalProgressRow({
  label,
  unit,
  value,
  target,
  percentage,
  onTargetChange
}: {
  label: string;
  unit: "ml" | "kcal" | "g";
  value: number;
  target: number;
  percentage: number;
  onTargetChange: (value: string) => void;
}) {
  const valueDigits = unit === "g" ? 1 : 0;
  const targetDigits = unit === "g" && target < 10 ? 1 : 0;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="shrink-0 text-xs text-muted-foreground">
            {formatNumber(value, valueDigits)} / {formatNumber(target, targetDigits)} {unit}
          </p>
        </div>
        <Progress value={percentage} className="mt-1.5 h-2" />
      </div>
      <label className="grid gap-1 text-[0.68rem] text-muted-foreground">
        Obiettivo {label}
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          step={unit === "g" ? 1 : 50}
          value={target}
          onChange={(event) => onTargetChange(event.target.value)}
          className="h-8 rounded-lg px-2 text-right text-xs"
        />
      </label>
    </div>
  );
}
