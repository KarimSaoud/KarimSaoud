import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFullDate, getLastNDays } from "@/lib/date";
import { formatNumber } from "@/lib/utils";
import { DayLog } from "@/types";

export function HistoryOverview({
  logs,
  onDuplicate
}: {
  logs: Record<string, DayLog>;
  onDuplicate: (sourceDate: string, targetDate: string) => void;
}) {
  const lastSeven = getLastNDays(7);
  const entries = lastSeven
    .map((date) => logs[date])
    .filter(Boolean)
    .map((log) => ({
      date: log.date,
      calories: log.summary.nutrients.calories,
      waterMl: log.summary.waterMl
    }));

  const averageCalories = entries.length
    ? entries.reduce((acc, item) => acc + item.calories, 0) / entries.length
    : 0;
  const averageWater = entries.length
    ? entries.reduce((acc, item) => acc + item.waterMl, 0) / entries.length
    : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <Card>
        <CardHeader>
          <CardTitle>Ultimi 7 giorni</CardTitle>
          <CardDescription>Medie rapide per calorie e idratazione.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-[24px] bg-secondary/70 p-4">
            <p className="text-sm text-muted-foreground">Media calorie</p>
            <p className="mt-2 text-2xl font-semibold">{formatNumber(averageCalories)} kcal</p>
          </div>
          <div className="rounded-[24px] bg-secondary/70 p-4">
            <p className="text-sm text-muted-foreground">Media acqua</p>
            <p className="mt-2 text-2xl font-semibold">{formatNumber(averageWater)} ml</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giorni precedenti</CardTitle>
          <CardDescription>Vista compatta con duplicazione rapida nel giorno selezionato.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.values(logs)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((log) => (
              <div key={log.date} className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium capitalize">{formatFullDate(log.date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(log.summary.nutrients.calories)} kcal · {formatNumber(log.summary.waterMl)} ml
                  </p>
                </div>
                <button
                  onClick={() => onDuplicate(log.date, new Date().toISOString().slice(0, 10))}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Duplica su oggi
                </button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
