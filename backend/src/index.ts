import { Env } from "./types.js";
import { verifyDeviceToken, handleTokenIssue } from "./middleware/auth.js";
import { checkRateLimit } from "./middleware/rateLimit.js";
import { handleLabelAnalysis, handleMealAnalysis, handleRecipeAnalysis } from "./handlers/analyze.js";
import { handleBarcodeLookup } from "./handlers/barcode.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Device-Token",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Token issuance endpoint — no auth required
    if (path === "/auth/token") {
      return addCors(await handleTokenIssue(request, env));
    }

    // All other endpoints require a valid device token
    const token = request.headers.get("X-Device-Token");
    if (!token) return json({ error: "Missing device token" }, 401);

    const payload = await verifyDeviceToken(token, env.HMAC_SECRET);
    if (!payload) return json({ error: "Invalid or expired device token" }, 401);

    // Rate limiting
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { allowed, reason } = await checkRateLimit(payload.deviceId, ip, env);
    if (!allowed) return json({ error: reason ?? "rate_limited" }, 429);

    // Route
    let response: Response;
    try {
      switch (path) {
        case "/analyze/label":
          response = await handleLabelAnalysis(request, env);
          break;
        case "/analyze/meal":
          response = await handleMealAnalysis(request, env);
          break;
        case "/analyze/recipe":
          response = await handleRecipeAnalysis(request, env);
          break;
        case "/lookup/barcode":
          response = await handleBarcodeLookup(request, env);
          break;
        default:
          response = json({ error: "Not found" }, 404);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal error";
      response = json({ error: message }, 500);
    }

    return addCors(response);
  },
} satisfies ExportedHandler<Env>;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function addCors(response: Response): Response {
  const newResponse = new Response(response.body, response);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => newResponse.headers.set(k, v));
  return newResponse;
}
