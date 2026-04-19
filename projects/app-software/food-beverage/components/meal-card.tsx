"use client";

import { Plus } from "lucide-react";

import { AddEntrySheet } from "@/components/add-entry-sheet";
import { EntryRow } from "@/components/entry-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sumMealEntries } from "@/lib/nutrients";
import { formatNumber, formatNutrient } from "@/lib/utils";
import { MealEntry, MealType } from "@/types";

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
  const subtotal = sumMealEntries(entries);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">
            {formatNumber(subtotal.calories)} kcal · P {formatNutrient(subtotal.protein)} · C {formatNutrient(subtotal.carbs)} · G {formatNutrient(subtotal.fat)}
          </CardDescription>
        </div>
        <AddEntrySheet mealType={mealType}>
          <Button size="sm" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi
          </Button>
        </AddEntrySheet>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-lg bg-secondary/70 p-4 text-sm leading-6 text-muted-foreground">
            Nessun alimento registrato. Aggiungi manualmente, cerca un prodotto o usa la scansione.
          </div>
        ) : (
          entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onDelete={() => onDelete(entry.id)}
              onQuantityChange={(quantity) => onQuantityChange(entry.id, quantity)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
