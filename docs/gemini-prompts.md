# Gemini Prompts

Three tasks, three prompts. All use `responseMimeType: "application/json"` for structured output — no regex parsing of freeform text.

---

## Configuration

```
Model: gemini-2.0-flash-exp
Temperature: 0.1  (low — nutrition data should be factual, not creative)
Max output tokens: 512
Response MIME type: application/json
```

**Note on model ID:** The user said `gemini-3-flash-preview`. As of early 2025, the correct experimental Flash model ID is `gemini-2.0-flash-exp`. Verify at [https://ai.google.dev/gemini-api/docs/models/gemini](https://ai.google.dev/gemini-api/docs/models/gemini) before deploying. Update `GEMINI_MODEL` in `backend/src/services/gemini.ts`.

---

## Prompt 1: Nutrition Label

**Endpoint:** `POST /analyze/label`

```
You are a nutrition label reader. Analyze the nutrition facts label in this image.

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
- Never make up a product name if you cannot read it; use "Unknown Product"
```

**Expected output example:**
```json
{
  "name": "Greek Yogurt Plain",
  "servingSize": "227g",
  "calories": 130,
  "protein": 17,
  "carbs": 9,
  "fat": 0,
  "confidence": 0.95
}
```

---

## Prompt 2: Meal Photo

**Endpoint:** `POST /analyze/meal`

```
You are a nutrition estimator for restaurant and home-cooked meals. Analyze this photo of a meal.

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
- confidence < 0.4: image is blurry, partial, or food is ambiguous
```

**Expected output example:**
```json
{
  "name": "Grilled Chicken with Rice and Salad",
  "items": [
    { "name": "grilled chicken breast", "calories": 280, "protein": 53, "carbs": 0, "fat": 6 },
    { "name": "white rice", "calories": 210, "protein": 4, "carbs": 46, "fat": 0 },
    { "name": "mixed salad with dressing", "calories": 120, "protein": 2, "carbs": 8, "fat": 9 }
  ],
  "totalCalories": 610,
  "protein": 59,
  "carbs": 54,
  "fat": 15,
  "confidence": 0.72
}
```

---

## Prompt 3: Recipe

**Endpoint:** `POST /analyze/recipe`

```
You are a nutritionist analyzing a recipe from a photo (recipe card, cookbook page, or screen).

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
- If quantities are missing for key ingredients, lower confidence below 0.5
```

**Expected output example:**
```json
{
  "name": "Pasta Carbonara",
  "servings": 4,
  "perServing": {
    "calories": 520,
    "protein": 22,
    "carbs": 58,
    "fat": 22
  },
  "confidence": 0.81
}
```

---

## Confidence Threshold Guidelines (iOS App)

| Confidence | App behavior |
|------------|-------------|
| ≥ 0.75 | Show result normally |
| 0.5–0.74 | Show result with a subtle "estimate" indicator |
| < 0.5 | Show result with yellow warning: "Low confidence — check these numbers" |
| 0 | Show error: "Couldn't analyze this image" |

---

## Testing

```bash
# Install tsx for running TypeScript directly
npm install -g tsx

# Set your key
export GEMINI_API_KEY=your_key_here

# Drop test images in scripts/test-images/ then:
npx tsx scripts/test-prompts.ts
```
