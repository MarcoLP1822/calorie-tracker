/**
 * Test Gemini prompts directly before deploying the worker.
 * Usage: npx tsx scripts/test-prompts.ts
 *
 * Drop test images in scripts/test-images/:
 *   - label.jpg    (a nutrition label)
 *   - meal.jpg     (a plated meal)
 *   - recipe.jpg   (a recipe card or page)
 *
 * Get a Gemini API key at https://aistudio.google.com/app/apikey
 */

import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-exp";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

if (!GEMINI_API_KEY) {
  console.error("Set GEMINI_API_KEY env var before running.");
  process.exit(1);
}

const LABEL_PROMPT = `You are a nutrition label reader. Analyze the nutrition facts label in this image.
Return ONLY valid JSON: {"name": string, "servingSize": string, "calories": number, "protein": number, "carbs": number, "fat": number, "confidence": number}`;

const MEAL_PROMPT = `You are a nutrition estimator for meals. Analyze this photo of a meal.
Return ONLY valid JSON: {"name": string, "totalCalories": number, "protein": number, "carbs": number, "fat": number, "confidence": number}`;

const RECIPE_PROMPT = `You are a nutritionist analyzing a recipe. Analyze the recipe in this image.
Return ONLY valid JSON: {"name": string, "servings": number, "perServing": {"calories": number, "protein": number, "carbs": number, "fat": number}, "confidence": number}`;

async function callGemini(prompt: string, imagePath: string): Promise<unknown> {
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString("base64");
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64 } },
        { text: prompt },
      ],
    }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 512,
    },
  };

  const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return JSON.parse(text);
}

const TEST_DIR = path.join(process.cwd(), "scripts", "test-images");

const tests: Array<{ name: string; file: string; prompt: string }> = [
  { name: "Nutrition Label", file: "label.jpg", prompt: LABEL_PROMPT },
  { name: "Meal Photo", file: "meal.jpg", prompt: MEAL_PROMPT },
  { name: "Recipe", file: "recipe.jpg", prompt: RECIPE_PROMPT },
];

(async () => {
  let ran = 0;
  for (const test of tests) {
    const filePath = path.join(TEST_DIR, test.file);
    if (!fs.existsSync(filePath)) {
      console.log(`\n[SKIP] ${test.name} — no image at scripts/test-images/${test.file}`);
      continue;
    }

    console.log(`\n[TEST] ${test.name}`);
    try {
      const result = await callGemini(test.prompt, filePath);
      console.log("Result:", JSON.stringify(result, null, 2));
      ran++;
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : err);
    }
  }

  if (ran === 0) {
    console.log("\nNo test images found. Add images to scripts/test-images/ and re-run.");
    console.log("Files needed: label.jpg, meal.jpg, recipe.jpg");
  }
})();
