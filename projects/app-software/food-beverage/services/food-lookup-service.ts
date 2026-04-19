import { FoodProduct, Nutrients } from "@/types";
import { createId } from "@/lib/utils";

type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  ingredients_text?: string;
  nutriments?: Record<string, number | string | undefined>;
};

type OpenFoodFactsResponse = {
  status: number;
  product?: OpenFoodFactsProduct;
};

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function mapNutrients(product?: OpenFoodFactsProduct): Nutrients {
  const nutriments = product?.nutriments ?? {};

  return {
    calories: toNumber(nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"]),
    protein: toNumber(nutriments.proteins_100g),
    carbs: toNumber(nutriments.carbohydrates_100g),
    sugars: toNumber(nutriments.sugars_100g),
    fat: toNumber(nutriments.fat_100g),
    saturatedFat: toNumber(nutriments["saturated-fat_100g"]),
    fiber: toNumber(nutriments.fiber_100g),
    salt: toNumber(nutriments.salt_100g),
    sodium: toNumber(nutriments.sodium_100g),
    calcium: toNumber(nutriments.calcium_100g),
    iron: toNumber(nutriments.iron_100g),
    potassium: toNumber(nutriments.potassium_100g),
    magnesium: toNumber(nutriments.magnesium_100g),
    vitaminA: toNumber(nutriments["vitamin-a_100g"]),
    vitaminC: toNumber(nutriments["vitamin-c_100g"]),
    vitaminD: toNumber(nutriments["vitamin-d_100g"]),
    vitaminB12: toNumber(nutriments["vitamin-b12_100g"])
  };
}

function mapProduct(product: OpenFoodFactsProduct): FoodProduct {
  const baseUnit = product?.product_name?.toLowerCase().includes("drink") ? "ml" : "g";

  return {
    id: createId("product"),
    name: product.product_name || "Prodotto senza nome",
    brand: product.brands || undefined,
    barcode: product.code,
    imageUrl: product.image_front_small_url || product.image_front_url,
    ingredients: product.ingredients_text || undefined,
    baseUnit,
    nutrientsPer100: mapNutrients(product),
    dataSource: "open-food-facts"
  };
}

async function fetchProduct(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Servizio nutrizionale non disponibile.");
  }

  return (await response.json()) as OpenFoodFactsResponse;
}

export const foodLookupService = {
  async lookupByBarcode(barcode: string): Promise<FoodProduct | null> {
    const data = await fetchProduct(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);

    if (data.status !== 1 || !data.product) {
      return null;
    }

    return mapProduct({ ...data.product, code: barcode });
  },
  async searchProducts(query: string): Promise<FoodProduct[]> {
    if (!query.trim()) {
      return [];
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error("Ricerca prodotti non disponibile.");
    }

    const data = (await response.json()) as { products?: OpenFoodFactsProduct[] };

    return (data.products ?? [])
      .filter((product) => product.product_name)
      .slice(0, 8)
      .map((product) => mapProduct(product));
  }
};
