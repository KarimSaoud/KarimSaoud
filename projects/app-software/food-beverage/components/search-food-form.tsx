"use client";

import Image from "next/image";
import { LoaderCircle, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { foodLookupService } from "@/services/food-lookup-service";
import { FoodProduct } from "@/types";
import { formatNutrient } from "@/lib/utils";

export function SearchFoodForm({
  onSelect
}: {
  onSelect: (product: FoodProduct) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    setLoading(true);
    setError(null);

    try {
      const products = await foodLookupService.searchProducts(query);
      setResults(products);
    } catch {
      setError("Ricerca temporaneamente non disponibile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca alimento o marca" />
        <Button onClick={handleSearch} disabled={!query.trim() || loading}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error ? <div className="rounded-[20px] bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <div className="space-y-3">
        {!loading && results.length === 0 ? (
          <div className="rounded-[24px] bg-secondary/70 p-4 text-sm text-muted-foreground">
            Cerca un prodotto confezionato per nome o marca. Se non lo trovi, passa alla modalità manuale.
          </div>
        ) : null}

        {results.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelect(product)}
            className="flex w-full items-center gap-3 rounded-[24px] border border-border bg-white/70 p-4 text-left transition hover:bg-white"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-[18px] bg-secondary">
              {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill className="object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{product.name}</p>
              <p className="truncate text-sm text-muted-foreground">{product.brand || "Marca non disponibile"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.nutrientsPer100.calories} kcal · P {formatNutrient(product.nutrientsPer100.protein)} · C {formatNutrient(product.nutrientsPer100.carbs)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
