import { Env, NutritionResult, MealResult, RecipeResult } from "../types.js";
import { callGeminiWithImage } from "../services/gemini.js";
import { LABEL_PROMPT, MEAL_PROMPT, RECIPE_PROMPT } from "../prompts/index.js";

async function extractImage(request: Request): Promise<{ base64: string; mimeType: string } | null> {
  const body = await request.json().catch(() => null) as { image?: string; mimeType?: string } | null;
  if (!body?.image) return null;
  return {
    base64: body.image,
    mimeType: body.mimeType ?? "image/jpeg",
  };
}

export async function handleLabelAnalysis(request: Request, env: Env): Promise<Response> {
  const img = await extractImage(request);
  if (!img) return new Response(JSON.stringify({ error: "Missing image" }), { status: 400 });

  const result = await callGeminiWithImage(env.GEMINI_API_KEY, LABEL_PROMPT, img.base64, img.mimeType) as NutritionResult;
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleMealAnalysis(request: Request, env: Env): Promise<Response> {
  const img = await extractImage(request);
  if (!img) return new Response(JSON.stringify({ error: "Missing image" }), { status: 400 });

  const result = await callGeminiWithImage(env.GEMINI_API_KEY, MEAL_PROMPT, img.base64, img.mimeType) as MealResult;
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleRecipeAnalysis(request: Request, env: Env): Promise<Response> {
  const img = await extractImage(request);
  if (!img) return new Response(JSON.stringify({ error: "Missing image" }), { status: 400 });

  const result = await callGeminiWithImage(env.GEMINI_API_KEY, RECIPE_PROMPT, img.base64, img.mimeType) as RecipeResult;
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
