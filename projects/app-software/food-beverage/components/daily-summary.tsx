import { ComponentType } from "react";
import { Droplets, Flame, Salad, Wheat } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DEFAULT_SETTINGS, MEAL_LABELS, MEAL_ORDER } from "@/lib/constants";
import { formatNumber, formatNutrient } from "@/lib/utils";
import { DayLog } from "@/types";

import { MacroBar } from "@/components/macro-bar";

export function DailySummary({ dayLog }: { dayLog: DayLog }) {
  const summary = dayLog.summary;
  const macroTotal = summary.nutrients.protein + summary.nutrients.carbs + summary.nutrients.fat;
  const proteinPct = macroTotal ? (summary.nutrients.protein * 4 * 100) / (summary.nutrients.calories || 1) : 0;
  const carbsPct = macroTotal ? (summary.nutrients.carbs * 4 * 100) / (summary.nutrients.calories || 1) : 0;
  const fatPct = macroTotal ? (summary.nutrients.fat * 9 * 100) / (summary.nutrients.calories || 1) : 0;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Riepilogo giornaliero</CardTitle>
          <CardDescription>Totali automatici di macro, micronutrienti e acqua.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={Flame} label="Calorie" value={`${formatNumber(summary.nutrients.calories)} kcal`} />
            <StatTile icon={Salad} label="Proteine" value={formatNutrient(summary.nutrients.protein)} />
            <StatTile icon={Wheat} label="Carboidrati" value={formatNutrient(summary.nutrients.carbs)} />
            <StatTile icon={Droplets} label="Acqua" value={`${formatNumber(summary.waterMl)} ml`} />
          </div>

          <div className="space-y-4">
            <MacroBar label={`Proteine ${formatNumber(proteinPct, 0)}%`} value={summary.nutrients.protein} total={DEFAULT_SETTINGS.proteinTarget} />
            <MacroBar label={`Carboidrati ${formatNumber(carbsPct, 0)}%`} value={summary.nutrients.carbs} total={DEFAULT_SETTINGS.carbsTarget} />
            <MacroBar label={`Grassi ${formatNumber(fatPct, 0)}%`} value={summary.nutrients.fat} total={DEFAULT_SETTINGS.fatTarget} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricLine label="Fibre" value={formatNutrient(summary.nutrients.fiber)} />
            <MetricLine label="Sale" value={formatNutrient(summary.nutrients.salt)} />
            <MetricLine label="Zuccheri" value={formatNutrient(summary.nutrients.sugars)} />
            <MetricLine label="Grassi saturi" value={formatNutrient(summary.nutrients.saturatedFat)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuzione della giornata</CardTitle>
          <CardDescription>Quota calorie per pasto e micronutrienti disponibili.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            {MEAL_ORDER.map((mealType) => {
              const calories = summary.caloriesByMeal[mealType];
              const percentage = summary.nutrients.calories ? (calories / summary.nutrients.calories) * 100 : 0;
              return (
                <div key={mealType} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{MEAL_LABELS[mealType]}</span>
                    <span className="font-medium">{formatNumber(calories)} kcal</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </div>

          <div className="grid gap-2 rounded-[24px] bg-secondary/70 p-4 text-sm">
            <MetricLine label="Sodio" value={formatNutrient(summary.nutrients.sodium, "mg")} />
            <MetricLine label="Calcio" value={formatNutrient(summary.nutrients.calcium, "mg")} />
            <MetricLine label="Ferro" value={formatNutrient(summary.nutrients.iron, "mg")} />
            <MetricLine label="Potassio" value={formatNutrient(summary.nutrients.potassium, "mg")} />
            <MetricLine label="Magnesio" value={formatNutrient(summary.nutrients.magnesium, "mg")} />
            <MetricLine label="Vitamina C" value={formatNutrient(summary.nutrients.vitaminC, "mg")} />
            <MetricLine label="Vitamina D" value={formatNutrient(summary.nutrients.vitaminD, "mcg")} />
            <MetricLine label="Vitamina B12" value={formatNutrient(summary.nutrients.vitaminB12, "mcg")} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-secondary/70 p-4">
      <Icon className="mb-3 h-4 w-4 text-muted-foreground" />
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
