"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatNutrient } from "@/lib/utils";
import { useFoodLogStore } from "@/store/use-food-log-store";
import { DayLog, UserSettings } from "@/types";

type GoalKey = keyof Pick<
  UserSettings,
  "waterTargetMl" | "calorieTarget" | "fatTarget" | "saturatedFatTarget" | "carbsTarget" | "sugarsTarget" | "fiberTarget"
>;

const goalRows: Array<{
  key: GoalKey;
  label: string;
  unit: "ml" | "kcal" | "g";
  getValue: (dayLog: DayLog) => number;
}> = [
  {
    key: "waterTargetMl",
    label: "Acqua",
    unit: "ml",
    getValue: (dayLog) => dayLog.summary.waterMl
  },
  {
    key: "calorieTarget",
    label: "Kcal",
    unit: "kcal",
    getValue: (dayLog) => dayLog.summary.nutrients.calories
  },
  {
    key: "fatTarget",
    label: "Grassi",
    unit: "g",
    getValue: (dayLog) => dayLog.summary.nutrients.fat
  },
  {
    key: "saturatedFatTarget",
    label: "Saturi",
    unit: "g",
    getValue: (dayLog) => dayLog.summary.nutrients.saturatedFat
  },
  {
    key: "carbsTarget",
    label: "Carboidrati",
    unit: "g",
    getValue: (dayLog) => dayLog.summary.nutrients.carbs
  },
  {
    key: "sugarsTarget",
    label: "Zuccheri",
    unit: "g",
    getValue: (dayLog) => dayLog.summary.nutrients.sugars
  },
  {
    key: "fiberTarget",
    label: "Fibre",
    unit: "g",
    getValue: (dayLog) => dayLog.summary.nutrients.fiber
  }
];

const microRows: Array<{
  label: string;
  unit: "mg" | "mcg";
  getValue: (dayLog: DayLog) => number | undefined;
}> = [
  { label: "Sodio", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.sodium },
  { label: "Calcio", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.calcium },
  { label: "Ferro", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.iron },
  { label: "Potassio", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.potassium },
  { label: "Magnesio", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.magnesium },
  { label: "Vitamina C", unit: "mg", getValue: (dayLog) => dayLog.summary.nutrients.vitaminC },
  { label: "Vitamina D", unit: "mcg", getValue: (dayLog) => dayLog.summary.nutrients.vitaminD },
  { label: "Vitamina B12", unit: "mcg", getValue: (dayLog) => dayLog.summary.nutrients.vitaminB12 }
];

export function DailySummary({ dayLog }: { dayLog: DayLog }) {
  const settings = useFoodLogStore((state) => state.settings);
  const updateSettings = useFoodLogStore((state) => state.updateSettings);

  const handleGoalChange = (key: GoalKey, value: string) => {
    const parsed = Number(value);
    updateSettings({ [key]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 });
  };

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Riepilogo giornaliero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {goalRows.map((row) => {
            const value = row.getValue(dayLog);
            const target = settings[row.key];
            const percentage = target > 0 ? (value / target) * 100 : 0;

            return (
              <GoalProgressRow
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
          <MicroDropdown dayLog={dayLog} />
        </CardContent>
      </Card>
    </section>
  );
}

function MicroDropdown({ dayLog }: { dayLog: DayLog }) {
  const [selectedMicroRows, setSelectedMicroRows] = useState(() => microRows.map((row) => row.label));
  const selectedCount = selectedMicroRows.length;

  const toggleMicroRow = (label: string) => {
    setSelectedMicroRows((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  };

  return (
    <details className="group grid gap-2">
      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium">Micro</p>
            <p className="shrink-0 text-xs text-muted-foreground">
              {selectedCount}/{microRows.length} valori
            </p>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(selectedCount / microRows.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="flex h-8 items-center justify-center rounded-lg border border-input bg-white text-muted-foreground">
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="ml-0 grid gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
        {microRows.map((row) => (
          <label key={row.label} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <input
                type="checkbox"
                checked={selectedMicroRows.includes(row.label)}
                onChange={() => toggleMicroRow(row.label)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="truncate text-muted-foreground">{row.label}</span>
            </span>
            <span className="shrink-0 font-medium">{formatNutrient(row.getValue(dayLog), row.unit)}</span>
          </label>
        ))}
      </div>
    </details>
  );
}

function GoalProgressRow({
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
  const digits = unit === "g" && value < 10 ? 1 : 0;

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="shrink-0 text-xs text-muted-foreground">
              {formatNumber(value, digits)} / {formatNumber(target, unit === "g" && target < 10 ? 1 : 0)} {unit}
            </p>
          </div>
          <Progress value={percentage} className="mt-1.5 h-2" />
        </div>
        <label className="grid text-[0.68rem] text-muted-foreground">
          <span className="sr-only">Obiettivo {label}</span>
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
    </div>
  );
}
