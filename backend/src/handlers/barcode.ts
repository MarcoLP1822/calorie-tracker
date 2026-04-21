import { Env, BarcodeResult } from "../types.js";
import { lookupBarcode } from "../services/openFoodFacts.js";
import { callGeminiWithText } from "../services/gemini.js";
import { BARCODE_FALLBACK_PROMPT } from "../prompts/index.js";

export async function handleBarcodeLookup(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as { barcode?: string; useGeminiFallback?: boolean } | null;
  if (!body?.barcode || typeof body.barcode !== "string") {
    return new Response(JSON.stringify({ error: "Missing barcode" }), { status: 400 });
  }

  const barcode = body.barcode.trim();

  // Try OpenFoodFacts first
  const offResult = await lookupBarcode(barcode).catch(() => null);
  if (offResult) {
    return new Response(JSON.stringify(offResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Gemini fallback (optional — client can disable)
  if (body.useGeminiFallback !== false) {
    const geminiResult = await callGeminiWithText(
      env.GEMINI_API_KEY,
      BARCODE_FALLBACK_PROMPT(barcode)
    ).catch(() => null) as (BarcodeResult & { confidence: number }) | null;

    if (geminiResult && geminiResult.confidence > 0) {
      return new Response(JSON.stringify({ ...geminiResult, source: "gemini" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const unknown: BarcodeResult = {
    name: "Unknown Product",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    source: "unknown",
  };
  return new Response(JSON.stringify(unknown), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
