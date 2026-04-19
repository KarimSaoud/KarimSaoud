"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber, formatNutrient } from "@/lib/utils";
import { MealEntry } from "@/types";

export function EntryRow({
  entry,
  onDelete,
  onQuantityChange
}: {
  entry: MealEntry;
  onDelete: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-white/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{entry.name}</p>
          <p className="text-sm text-muted-foreground">
            {[entry.brand, `${formatNumber(entry.quantity)} ${entry.unit}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Elimina alimento">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{formatNumber(entry.consumedNutrients.calories)} kcal</span>
        <span>•</span>
        <span>P {formatNutrient(entry.consumedNutrients.protein)}</span>
        <span>•</span>
        <span>C {formatNutrient(entry.consumedNutrients.carbs)}</span>
        <span>•</span>
        <span>G {formatNutrient(entry.consumedNutrients.fat)}</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={500}
          step={5}
          value={entry.quantity}
          onChange={(event) => onQuantityChange(Number(event.target.value))}
          className="h-2 w-full accent-[#1e3b2d]"
        />
        <div className="min-w-16 rounded-full bg-secondary px-3 py-2 text-center text-sm font-medium">
          {formatNumber(entry.quantity)} {entry.unit}
        </div>
      </div>
    </div>
  );
}
