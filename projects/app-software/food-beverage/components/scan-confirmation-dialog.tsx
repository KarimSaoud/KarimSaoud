"use client";

import Image from "next/image";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FoodProduct, MealType } from "@/types";
import { formatNutrient } from "@/lib/utils";

export function ScanConfirmationDialog({
  open,
  onOpenChange,
  product,
  mealType,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: FoodProduct | null;
  mealType: MealType;
  onConfirm: (product: FoodProduct, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState("100");

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma alimento</DialogTitle>
          <DialogDescription>Controlla i dati recuperati e inserisci la quantità consumata.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 rounded-[24px] bg-secondary/60 p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-[20px] bg-white">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.brand || "Marca non disponibile"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{product.baseUnit === "ml" ? "Per 100 ml" : "Per 100 g"}</Badge>
                {product.barcode ? <Badge className="bg-accent">{product.barcode}</Badge> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Calorie" value={`${product.nutrientsPer100.calories} kcal`} />
            <Metric label="Proteine" value={formatNutrient(product.nutrientsPer100.protein)} />
            <Metric label="Carboidrati" value={formatNutrient(product.nutrientsPer100.carbs)} />
            <Metric label="Grassi" value={formatNutrient(product.nutrientsPer100.fat)} />
            <Metric label="Fibre" value={formatNutrient(product.nutrientsPer100.fiber)} />
            <Metric label="Sale" value={formatNutrient(product.nutrientsPer100.salt)} />
          </div>

          {product.ingredients ? (
            <div className="rounded-[22px] bg-secondary/70 p-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Ingredienti:</span> {product.ingredients}
            </div>
          ) : null}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Quantità consumata</label>
            <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onConfirm(product, Number(quantity) || 0);
              onOpenChange(false);
              setQuantity("100");
            }}
          >
            Salva in {mealType === "drinks" ? "Acqua / Bevande" : "questo pasto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-secondary/60 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
