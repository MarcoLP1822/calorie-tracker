export interface Env {
  RATE_LIMIT_KV: KVNamespace;
  GEMINI_API_KEY: string;
  HMAC_SECRET: string;
  DAILY_CAP_PER_DEVICE: string;
  RATE_LIMIT_PER_MINUTE: string;
  ENVIRONMENT: string;
}

export interface NutritionResult {
  name: string;
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  servingSize?: string;
  confidence: number;  // 0–1
}

export interface MealResult {
  name: string;
  items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface RecipeResult {
  name: string;
  servings: number;
  perServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  confidence: number;
}

export interface BarcodeResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  source: "openfoodfacts" | "gemini" | "unknown";
}

export interface DeviceTokenPayload {
  deviceId: string;
  issuedAt: number;
  expiresAt: number;
}
