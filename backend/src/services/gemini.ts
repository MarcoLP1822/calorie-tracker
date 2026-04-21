// Gemini Flash model — verify this ID against Google's API docs before deploying
const GEMINI_MODEL = "gemini-2.0-flash-exp";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiImagePart {
  inlineData: { mimeType: string; data: string };
}
interface GeminiTextPart {
  text: string;
}

export async function callGeminiWithImage(
  apiKey: string,
  prompt: string,
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<unknown> {
  const parts: Array<GeminiImagePart | GeminiTextPart> = [
    { inlineData: { mimeType, data: base64Image } },
    { text: prompt },
  ];

  const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,  // low temp for factual nutrition data
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const result = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  return JSON.parse(text);
}

export async function callGeminiWithText(apiKey: string, prompt: string): Promise<unknown> {
  const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const result = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  return JSON.parse(text);
}
