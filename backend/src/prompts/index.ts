export const LABEL_PROMPT = `You are a nutrition label reader. Analyze the nutrition facts label in this image.

Return ONLY valid JSON matching this schema exactly. No extra text.

Schema:
{
  "name": string,          // product name as shown on label
  "servingSize": string,   // e.g. "1 cup (240ml)" or "28g"
  "calories": number,      // kcal per serving
  "protein": number,       // grams per serving
  "carbs": number,         // total carbohydrates, grams per serving
  "fat": number,           // total fat, grams per serving
  "confidence": number     // your confidence 0.0–1.0 that values are accurate
}

Rules:
- Use values PER SERVING, not per 100g
- If label is partially visible, estimate missing values and lower confidence accordingly
- confidence < 0.5 means label was unclear or mostly obscured
- Never make up a product name if you cannot read it; use "Unknown Product"`;

export const MEAL_PROMPT = `You are a nutrition estimator for restaurant and home-cooked meals. Analyze this photo of a meal.

Return ONLY valid JSON matching this schema exactly. No extra text.

Schema:
{
  "name": string,           // brief description, e.g. "Chicken Caesar Salad"
  "items": [
    {
      "name": string,       // component name, e.g. "grilled chicken"
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "totalCalories": number,
  "protein": number,        // total grams
  "carbs": number,          // total grams
  "fat": number,            // total grams
  "confidence": number      // 0.0–1.0
}

Rules:
- Estimate standard restaurant portion sizes unless the image gives clear size context
- List the 3–6 main components as items; small garnishes can be included in totals without separate items
- confidence > 0.7: meal is clearly visible and identifiable
- confidence 0.4–0.7: meal is recognizable but portion size or ingredients are unclear
- confidence < 0.4: image is blurry, partial, or food is ambiguous`;

export const RECIPE_PROMPT = `You are a nutritionist analyzing a recipe from a photo (recipe card, cookbook page, or screen).

Return ONLY valid JSON matching this schema exactly. No extra text.

Schema:
{
  "name": string,           // recipe name
  "servings": number,       // number of servings as stated or estimated
  "perServing": {
    "calories": number,
    "protein": number,      // grams
    "carbs": number,        // grams
    "fat": number           // grams
  },
  "confidence": number      // 0.0–1.0
}

Rules:
- Read the ingredients list and calculate nutrition per serving
- If servings are not stated, estimate based on recipe yield and typical portion sizes
- confidence reflects how clearly you could read the ingredients and quantities
- If quantities are missing for key ingredients, lower confidence below 0.5`;

export const BARCODE_FALLBACK_PROMPT = (barcode: string) =>
  `A product has barcode ${barcode}. If you have any knowledge of this specific product, provide its nutrition information. If you do not recognize this specific barcode, return confidence: 0 with zeroed nutrition values.

Return ONLY valid JSON:
{
  "name": string,
  "servingSize": string,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number
}`;
