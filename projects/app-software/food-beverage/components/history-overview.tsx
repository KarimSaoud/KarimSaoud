"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DailySummary } from "@/components/daily-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MEAL_LABELS, MEAL_ORDER } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import { BodyMeasurementSnapshot, DayLog, MealEntry, WaterEntry } from "@/types";

const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export function HistoryOverview({
  logs,
  measurementHistory,
  onEnsureDay
}: {
  logs: Record<string, DayLog>;
  measurementHistory: BodyMeasurementSnapshot[];
  onEnsureDay: (date: string) => void;
}) {
  const today = getDateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const measurementsByDate = useMemo(() => {
    return measurementHistory.reduce<Record<string, BodyMeasurementSnapshot>>((acc, snapshot) => {
      const dateKey = snapshot.savedAt.slice(0, 10);
      const current = acc[dateKey];

      if (!current || snapshot.savedAt > current.savedAt) {
        acc[dateKey] = snapshot;
      }

      return acc;
    }, {});
  }, [measurementHistory]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("it-IT", {
        month: "long",
        year: "numeric"
      }).format(visibleMonth),
    [visibleMonth]
  );

  const openDateWindow = (date: string) => {
    onEnsureDay(date);
    setSelectedDate(date);
  };

  const selectedLog = selectedDate ? logs[selectedDate] : null;
  const selectedMeasurement = selectedDate ? measurementsByDate[selectedDate] : null;
  const selectedMeasurementLines = selectedMeasurement ? buildMeasurementLines(selectedMeasurement) : [];

  return (
    <div>
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="capitalize">{monthLabel}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const log = logs[day.key];
              const measurement = measurementsByDate[day.key];
              const measurementLines = measurement ? buildMeasurementLines(measurement) : [];
              const isCurrentMonth = day.date.getMonth() === visibleMonth.getMonth();
              const isToday = day.key === today;
              const isFuture = day.key > today;

              return (
                <button
                  key={day.key}
                  onClick={() => openDateWindow(day.key)}
                  className={cn(
                    "grid min-h-20 rounded-lg border p-2 text-left transition",
                    "border-border bg-white/70 hover:border-primary/50 hover:bg-secondary/70",
                    !isCurrentMonth && "opacity-45"
                  )}
                >
                  <span className="flex items-center justify-between gap-1 text-sm font-medium">
                    {day.date.getDate()}
                    {isToday ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
                  </span>
                  {log || measurementLines.length > 0 ? (
                    <span className="mt-auto text-[0.68rem] leading-4 opacity-80">
                      {log ? (
                        <>
                          {formatNumber(log.summary.nutrients.calories)} kcal
                          <br />
                          {formatNumber(log.summary.waterMl)} ml
                        </>
                      ) : null}
                      {measurementLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  ) : isFuture ? (
                    <span className="mt-auto text-[0.68rem] opacity-70">programma</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedDate !== null} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="max-h-[min(90vh,900px)] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedDate ? formatSelectedDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>

          {selectedLog ? (
            <HistoricalDayDetails
              dayLog={selectedLog}
              measurementLines={selectedMeasurementLines}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HistoricalDayDetails({
  dayLog,
  measurementLines
}: {
  dayLog: DayLog;
  measurementLines: string[];
}) {
  return (
    <div className="grid gap-5">
      <DailySummary dayLog={dayLog} />

      {measurementLines.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {measurementLines.map((line) => {
            const [label, ...valueParts] = line.split(" ");

            return <Metric key={line} label={label} value={valueParts.join(" ")} />;
          })}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {MEAL_ORDER.filter((mealType) => mealType !== "drinks").map((mealType) => (
          <HistoryMealCard
            key={mealType}
            title={MEAL_LABELS[mealType]}
            entries={dayLog.meals[mealType]}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {dayLog.meals.drinks.length > 0 ? (
          <HistoryMealCard title={MEAL_LABELS.drinks} entries={dayLog.meals.drinks} />
        ) : null}
        <HistoryWaterCard entries={dayLog.waterEntries} totalMl={dayLog.summary.waterMl} />
      </div>
    </div>
  );
}

function HistoryMealCard({ title, entries }: { title: string; entries: MealEntry[] }) {
  return (
    <div className="rounded-lg border border-border bg-white/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">{entries.length} elementi</span>
      </div>

      <div className="mt-3 grid gap-3">
        {entries.length > 0 ? (
          entries.map((entry) => <HistoryEntryRow key={entry.id} entry={entry} />)
        ) : (
          <div className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">Nessun alimento registrato.</div>
        )}
      </div>
    </div>
  );
}

function HistoryEntryRow({ entry }: { entry: MealEntry }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{entry.name}</p>
          <p className="text-sm text-muted-foreground">
            {[entry.brand, `${formatNumber(entry.quantity)} ${entry.unit}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium">{formatNumber(entry.consumedNutrients.calories)} kcal</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>P {formatNumber(entry.consumedNutrients.protein, entry.consumedNutrients.protein < 10 ? 1 : 0)} g</span>
        <span>C {formatNumber(entry.consumedNutrients.carbs, entry.consumedNutrients.carbs < 10 ? 1 : 0)} g</span>
        <span>G {formatNumber(entry.consumedNutrients.fat, entry.consumedNutrients.fat < 10 ? 1 : 0)} g</span>
        <span>Zuccheri {formatNumber(entry.consumedNutrients.sugars, entry.consumedNutrients.sugars < 10 ? 1 : 0)} g</span>
        <span>Fibre {formatNumber(entry.consumedNutrients.fiber, entry.consumedNutrients.fiber < 10 ? 1 : 0)} g</span>
      </div>
    </div>
  );
}

function HistoryWaterCard({ entries, totalMl }: { entries: WaterEntry[]; totalMl: number }) {
  return (
    <div className="rounded-lg border border-border bg-white/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Acqua / Bevande</h3>
        <span className="text-sm font-medium">{formatNumber(totalMl)} ml</span>
      </div>

      <div className="mt-3 grid gap-2">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 p-3">
              <span className="font-medium">{entry.label}</span>
              <span className="text-sm text-muted-foreground">{formatNumber(entry.amountMl)} ml</span>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">Nessuna bevanda registrata.</div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function buildMeasurementLines(snapshot: BodyMeasurementSnapshot) {
  const profile = snapshot.profile;

  return [
    profile.weightKg === null ? null : `Peso ${formatKg(profile.weightKg)}`,
    profile.leanMassKg === null ? null : `Magra ${formatKg(profile.leanMassKg)}`,
    profile.fatMassKg === null ? null : `Grassa ${formatKg(profile.fatMassKg)}`
  ].filter((line): line is string => Boolean(line));
}

function formatKg(value: number) {
  return `${formatNumber(value, value % 1 === 0 ? 0 : 1)} kg`;
}

function buildCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date,
      key: getDateKey(date)
    };
  });
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 12, 0, 0, 0);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  const weekday = new Intl.DateTimeFormat("it-IT", { weekday: "long" }).format(date);
  const numericDate = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);

  return `${weekday} ${numericDate}`;
}
