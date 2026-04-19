"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { WaterEntry } from "@/types";

export function WaterQuickAdd({
  totalMl,
  entries,
  onQuickAdd,
  onDelete
}: {
  totalMl: number;
  entries: WaterEntry[];
  onQuickAdd: (amountMl: number) => void;
  onDelete: (entryId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>Acqua / Bevande</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Accesso rapido per ml e storico bevute del giorno.</p>
        </div>
        <div className="shrink-0 rounded-lg bg-secondary px-3 py-2 text-sm font-medium">{formatNumber(totalMl)} ml</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[250, 500, 1000].map((amount) => (
            <Button key={amount} variant="outline" onClick={() => onQuickAdd(amount)}>
              <Plus className="mr-2 h-4 w-4" />+{amount === 1000 ? "1 L" : `${amount} ml`}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="rounded-lg bg-secondary/60 p-4 text-sm text-muted-foreground">Nessuna bevanda registrata oggi.</div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-4 py-3">
                <div>
                  <p className="font-medium">{entry.label}</p>
                  <p className="text-sm text-muted-foreground">{formatNumber(entry.amountMl)} ml</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)}>
                  Rimuovi
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
