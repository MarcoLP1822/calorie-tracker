import { Env, DeviceTokenPayload } from "../types.js";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function issueDeviceToken(deviceId: string, secret: string): Promise<string> {
  const payload: DeviceTokenPayload = {
    deviceId,
    issuedAt: Date.now(),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  const data = JSON.stringify(payload);
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  return btoa(`${data}.${sigHex}`);
}

export async function verifyDeviceToken(token: string, secret: string): Promise<DeviceTokenPayload | null> {
  try {
    const decoded = atob(token);
    const lastDot = decoded.lastIndexOf(".");
    const data = decoded.slice(0, lastDot);
    const sigHex = decoded.slice(lastDot + 1);

    const key = await importHmacKey(secret);
    const sigBytes = hexToBytes(sigHex);
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;

    const payload: DeviceTokenPayload = JSON.parse(data);
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function handleTokenIssue(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as { deviceId?: string } | null;
  if (!body?.deviceId || typeof body.deviceId !== "string" || body.deviceId.length < 8) {
    return new Response(JSON.stringify({ error: "Invalid deviceId" }), { status: 400 });
  }
  const token = await issueDeviceToken(body.deviceId, env.HMAC_SECRET);
  return new Response(JSON.stringify({ token }), { status: 200, headers: { "Content-Type": "application/json" } });
}
