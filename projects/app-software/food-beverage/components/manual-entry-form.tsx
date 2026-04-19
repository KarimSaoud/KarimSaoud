"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodProduct, MealType, Nutrients } from "@/types";

const INITIAL_NUTRIENTS: Nutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  sugars: 0,
  fat: 0,
  saturatedFat: 0,
  fiber: 0,
  salt: 0
};

export function ManualEntryForm({
  mealType,
  onSubmit
}: {
  mealType: MealType;
  onSubmit: (product: FoodProduct, quantity: number) => void;
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [baseUnit, setBaseUnit] = useState<"g" | "ml">("g");
  const [nutrients, setNutrients] = useState<Nutrients>(INITIAL_NUTRIENTS);

  const updateNutrient = (key: keyof Nutrients, value: string) => {
    setNutrients((current) => ({
      ...current,
      [key]: Number(value) || 0
    }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit(
          {
            id: `manual-${Date.now()}`,
            name,
            brand: brand || undefined,
            baseUnit,
            nutrientsPer100: nutrients,
            dataSource: "manual"
          },
          Number(quantity) || 0
        );
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input required placeholder="Nome alimento" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Marca opzionale" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <Input
          required
          type="number"
          min="0"
          placeholder="Quantità consumata"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex rounded-full bg-secondary p-1">
          <button
            type="button"
            onClick={() => setBaseUnit("g")}
            className={`flex-1 rounded-full px-3 py-2 text-sm ${baseUnit === "g" ? "bg-card text-foreground" : "text-muted-foreground"}`}
          >
            grammi
          </button>
          <button
            type="button"
            onClick={() => setBaseUnit("ml")}
            className={`flex-1 rounded-full px-3 py-2 text-sm ${baseUnit === "ml" ? "bg-card text-foreground" : "text-muted-foreground"}`}
          >
            ml
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input type="number" min="0" placeholder="Kcal / 100" value={nutrients.calories} onChange={(e) => updateNutrient("calories", e.target.value)} />
        <Input type="number" min="0" placeholder="Proteine / 100" value={nutrients.protein} onChange={(e) => updateNutrient("protein", e.target.value)} />
        <Input type="number" min="0" placeholder="Carboidrati / 100" value={nutrients.carbs} onChange={(e) => updateNutrient("carbs", e.target.value)} />
        <Input type="number" min="0" placeholder="Zuccheri / 100" value={nutrients.sugars} onChange={(e) => updateNutrient("sugars", e.target.value)} />
        <Input type="number" min="0" placeholder="Grassi / 100" value={nutrients.fat} onChange={(e) => updateNutrient("fat", e.target.value)} />
        <Input type="number" min="0" placeholder="Saturi / 100" value={nutrients.saturatedFat} onChange={(e) => updateNutrient("saturatedFat", e.target.value)} />
        <Input type="number" min="0" placeholder="Fibre / 100" value={nutrients.fiber} onChange={(e) => updateNutrient("fiber", e.target.value)} />
        <Input type="number" min="0" placeholder="Sale / 100" value={nutrients.salt} onChange={(e) => updateNutrient("salt", e.target.value)} />
      </div>

      <Button className="w-full" type="submit">
        Salva in {mealType === "drinks" ? "Acqua / Bevande" : "questo pasto"}
      </Button>
    </form>
  );
}
