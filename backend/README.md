# Proxy Backend — Cloudflare Workers

Cloudflare Worker that sits between the iOS app and Google Gemini. Handles auth tokens, rate limiting, and API key protection.

---

## Setup

```bash
cd backend
npm install
```

## Configure

```bash
# Copy example env file
cp .dev.vars.example .dev.vars
# Edit .dev.vars and fill in your keys

# Create KV namespace (run once)
npx wrangler kv:namespace create RATE_LIMIT_KV
npx wrangler kv:namespace create RATE_LIMIT_KV --preview
# Copy the IDs into wrangler.toml
```

## Set secrets (for production)

```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put HMAC_SECRET
# Enter values when prompted — never stored in files
```

## Run locally

```bash
npm run dev
# Worker runs at http://localhost:8787
```

## Deploy

```bash
npm run deploy
# Note the worker URL — put it in the iOS app as the base URL
```

---

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/token` | None | Issue device token on first launch |
| POST | `/analyze/label` | Token | Analyze nutrition label from photo |
| POST | `/analyze/meal` | Token | Estimate meal nutrition from photo |
| POST | `/analyze/recipe` | Token | Parse recipe nutrition from photo |
| POST | `/lookup/barcode` | Token | Look up barcode via OpenFoodFacts + Gemini fallback |

### Request format (analyze endpoints)

```json
{
  "image": "<base64-encoded image data>",
  "mimeType": "image/jpeg"
}
```

Header: `X-Device-Token: <token from /auth/token>`

### Request format (barcode)

```json
{
  "barcode": "0123456789012",
  "useGeminiFallback": true
}
```

### Token issuance

```json
POST /auth/token
{ "deviceId": "<UUID generated on device>" }

Response: { "token": "<signed token>" }
```

Tokens expire after 24 hours. The iOS app should renew automatically.

---

## Rate Limits

- **Per device:** 50 analyses/day (configurable via `DAILY_CAP_PER_DEVICE` env var)
- **Per IP:** 10 requests/minute (configurable via `RATE_LIMIT_PER_MINUTE` env var)

Both enforced via Cloudflare KV with TTL-based expiry.

---

## Gemini Model

Currently set to `gemini-2.0-flash-exp` in `src/services/gemini.ts`.

**Verify the correct model ID before deploying:** https://ai.google.dev/gemini-api/docs/models/gemini

Update the `GEMINI_MODEL` constant if needed.
