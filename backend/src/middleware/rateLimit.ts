import { Env } from "../types.js";

export async function checkRateLimit(
  deviceId: string,
  ip: string,
  env: Env
): Promise<{ allowed: boolean; reason?: string }> {
  const dailyCap = parseInt(env.DAILY_CAP_PER_DEVICE) || 50;
  const perMinuteCap = parseInt(env.RATE_LIMIT_PER_MINUTE) || 10;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const deviceDayKey = `dev:${deviceId}:${today}`;
  const ipMinuteKey = `ip:${ip}:${Math.floor(Date.now() / 60000)}`;

  const [deviceCount, ipCount] = await Promise.all([
    env.RATE_LIMIT_KV.get(deviceDayKey),
    env.RATE_LIMIT_KV.get(ipMinuteKey),
  ]);

  const deviceRequests = parseInt(deviceCount ?? "0");
  const ipRequests = parseInt(ipCount ?? "0");

  if (deviceRequests >= dailyCap) {
    return { allowed: false, reason: "daily_cap_exceeded" };
  }
  if (ipRequests >= perMinuteCap) {
    return { allowed: false, reason: "rate_limit_exceeded" };
  }

  // Increment counters (fire and forget — don't await)
  const secondsUntilEndOfDay = 86400 - (Math.floor(Date.now() / 1000) % 86400);
  env.RATE_LIMIT_KV.put(deviceDayKey, String(deviceRequests + 1), { expirationTtl: secondsUntilEndOfDay });
  env.RATE_LIMIT_KV.put(ipMinuteKey, String(ipRequests + 1), { expirationTtl: 60 });

  return { allowed: true };
}
