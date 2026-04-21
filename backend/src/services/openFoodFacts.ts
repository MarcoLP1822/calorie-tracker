import { BarcodeResult } from "../types.js";

interface OFFProduct {
  product_name?: string;
  nutriments?: {
    "energy-kcal_serving"?: number;
    "energy-kcal_100g"?: number;
    proteins_serving?: number;
    proteins_100g?: number;
    carbohydrates_serving?: number;
    carbohydrates_100g?: number;
    fat_serving?: number;
    fat_100g?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
}

export async function lookupBarcode(barcode: string): Promise<BarcodeResult | null> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  const response = await fetch(url, {
    headers: { "User-Agent": "CalorieTrackerApp/1.0" },
  });

  if (!response.ok) return null;

  const data = await response.json() as { status: number; product?: OFFProduct };
  if (data.status !== 1 || !data.product) return null;

  const p = data.product;
  const n = p.nutriments ?? {};

  // Prefer per-serving values; fall back to per-100g (less accurate without serving size)
  const hasServingData = n["energy-kcal_serving"] != null;
  const calories = hasServingData ? (n["energy-kcal_serving"] ?? 0) : (n["energy-kcal_100g"] ?? 0);
  const protein = hasServingData ? (n["proteins_serving"] ?? 0) : (n["proteins_100g"] ?? 0);
  const carbs = hasServingData ? (n["carbohydrates_serving"] ?? 0) : (n["carbohydrates_100g"] ?? 0);
  const fat = hasServingData ? (n["fat_serving"] ?? 0) : (n["fat_100g"] ?? 0);

  return {
    name: p.product_name || "Unknown Product",
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    servingSize: p.serving_size,
    source: "openfoodfacts",
  };
}
