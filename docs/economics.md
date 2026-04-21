# Economics — Cost Per User + Ad Revenue Model

---

## Gemini Flash Pricing (as of early 2025)

**Model: gemini-2.0-flash-exp**  
Check current pricing at: https://ai.google.dev/pricing

Approximate rates (verify before launch):
- Input: ~$0.075 per 1M tokens
- Output: ~$0.30 per 1M tokens
- Image input: ~$0.00002 per image (each counts as ~258 tokens for a standard image)

**Free tier:** 15 requests/minute, no daily cap stated — but this is a free experimental model and terms may change. Do not build a production revenue model on the assumption the free tier persists.

---

## Cost Per Active User / Month

**Assumption:** 3 photo analyses/day (baseline active user — logging lunch, dinner, one snack label)

| | Per day | Per month |
|---|---|---|
| Photo analyses | 3 | ~90 |
| Image input tokens (258 tokens × 3) | ~774 | ~23,220 |
| Text output tokens (~100 tokens each) | ~300 | ~9,000 |
| **Image cost** | ~$0.000048 | **~$0.00144** |
| **Token cost** | ~$0.0000025 | **~$0.000075** |
| **Total per user/month** | ~$0.05¢ | **~$0.002** |

**So: roughly $0.002/active user/month at 3 photos/day.** That's $2 per 1,000 active users per month.

Add Cloudflare Workers cost:
- Free tier: 100k requests/day (plenty for early growth)
- At scale (10M req/month): ~$5/month on Workers Paid ($5 base + $0.50/million)

---

## At What Scale Does This Get Expensive?

| Active users | Photos/day (avg 3) | Monthly cost |
|---|---|---|
| 1,000 | 3,000 | ~$2 |
| 10,000 | 30,000 | ~$20 |
| 100,000 | 300,000 | ~$200 |
| 1,000,000 | 3M | ~$2,000 |

**Honest take:** The economics are extremely favorable at any realistic indie app scale. If you hit 100k active users, your Gemini bill is ~$200/month. That's a nice problem to have.

The free tier risk is the real concern. If Google ends the free experimental tier for `gemini-2.0-flash-exp` and bills you retroactively or drops you without notice, you have a problem. Mitigation: move to a billed account with billing alerts from day one, even if you're on the free tier.

---

## Ad Revenue (AdMob) — What You'd Need to Break Even

**Baseline: 10,000 MAU, $20/month in Gemini costs**

Mobile app ad ARPU (AdMob banner/interstitial, conservative estimate):
- Banner only: ~$0.01–0.05/DAU/month
- Banner + 1 interstitial/session: ~$0.05–0.15/DAU/month

At 30% DAU/MAU ratio (3,000 DAU from 10k MAU):
- Conservative (banner only): 3,000 × $0.01 = $30/month
- Moderate (banner + interstitial): 3,000 × $0.10 = $300/month

**Break-even: you need roughly $20/month to cover costs at 10k MAU. Even the most conservative ad setup (banner only) covers this.**

---

## Free-Tier Ceiling

With the per-device daily cap set to 50 analyses:
- 50 × 3 endpoints = up to 150 Cloudflare requests/device/day
- Cloudflare free: 100k requests/day = supports ~666 highly active devices
- This is a non-issue until you're at scale

---

## Verdict

The economics work. A solo dev monetizing with minimal ads can run this app profitably at any realistic scale under 1M MAU. The only real risk is Gemini pricing changes. Monitor it. Set billing alerts. Add a graceful error if the API becomes unavailable rather than silently failing.

**Single action item:** Create a Google Cloud billing account (not just an API key), set a $10/month alert, and use a billed project even while on the free tier — so you have visibility before any surprise bill.
