# Calorie Tracker

> **In breve.** L'idea è un'app per iPhone che conta le calorie senza abbonamento e senza account: fotografi il piatto, l'etichetta o il codice a barre e un'intelligenza artificiale (Gemini) stima calorie e valori nutrizionali.
>
> **A che punto è:** a metà. Esiste solo la parte "dietro le quinte" (un piccolo server su Cloudflare che parla con Gemini e con il database di Open Food Facts) più tutta la documentazione di progetto. L'app per iPhone (la "fase 2", da fare su Mac con Xcode) non è in questo repository. Ultimo lavoro: aprile 2026.

Subscription-free iOS calorie tracker. Log meals by photo, barcode, or manual entry. AI nutrition analysis via Gemini. No account required.

**Status:** Phase 1 complete (backend + docs). Phase 2 (iOS app) starts on Mac with Xcode.

---

## Folder Map

```
calorie-tracker/
├── backend/                    Cloudflare Workers proxy (deploy this first)
│   ├── src/
│   │   ├── index.ts            Worker entry point + routing
│   │   ├── types.ts            Shared TypeScript types
│   │   ├── handlers/
│   │   │   ├── analyze.ts      /analyze/label, /analyze/meal, /analyze/recipe
│   │   │   └── barcode.ts      /lookup/barcode
│   │   ├── middleware/
│   │   │   ├── auth.ts         HMAC device token issuance + verification
│   │   │   └── rateLimit.ts    Per-device daily cap + per-IP rate limit
│   │   ├── prompts/
│   │   │   └── index.ts        Gemini prompts for each analysis type
│   │   └── services/
│   │       ├── gemini.ts       Gemini API client
│   │       └── openFoodFacts.ts OpenFoodFacts barcode lookup
│   ├── wrangler.toml           Cloudflare Worker config
│   ├── .dev.vars.example       Local secrets template (copy to .dev.vars)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md               Backend setup + deploy instructions
│
├── scripts/
│   ├── test-prompts.ts         Test Gemini prompts locally before deploying
│   └── test-images/            Drop label.jpg, meal.jpg, recipe.jpg here
│
└── docs/
    ├── product-spec.md         What the app is, user flows, out-of-scope list
    ├── architecture.md         SwiftUI + SwiftData, Gemini proxy, barcode strategy
    ├── gemini-prompts.md       Prompts for each analysis type + confidence guide
    ├── app-store-2.1-response.md  Draft App Review response for Guideline 2.1
    ├── privacy-policy.md       Privacy policy draft (needs a public URL for App Store)
    ├── app-store-metadata.md   Name options, subtitle, keywords, description, captions
    ├── economics.md            Cost per user + ad revenue break-even analysis
    └── phase-2-checklist.md   Step-by-step guide for Mac/Xcode build + submission
```

---

## Phase 1 — Done (Windows)

- [x] Product spec + user flows
- [x] Architecture decisions (SwiftUI + SwiftData, Cloudflare proxy)
- [x] Cloudflare Worker backend (TypeScript, all endpoints)
- [x] Rate limiting + HMAC device auth
- [x] Gemini prompts for label, meal, recipe analysis
- [x] OpenFoodFacts barcode lookup + Gemini fallback
- [x] Prompt test script (`scripts/test-prompts.ts`)
- [x] App Store 2.1 response template
- [x] Privacy policy draft
- [x] App Store metadata + name options
- [x] Economics analysis
- [x] Phase 2 checklist

## Phase 2 — Todo (Mac + Xcode)

- [ ] Deploy Cloudflare Worker (`cd backend && npm install && wrangler deploy`)
- [ ] Test Worker endpoints with test script
- [ ] Create Xcode project (SwiftUI + SwiftData, iOS 17 target)
- [ ] Build core screens + SwiftData models
- [ ] Implement ProxyService (URLSession → Worker)
- [ ] Implement photo capture + analysis flow
- [ ] Implement barcode scanner (AVFoundation)
- [ ] Implement manual log entry
- [ ] TestFlight internal testing
- [ ] Record screen capture for App Review
- [ ] App Store submission

---

## Blocking Decisions Before Phase 2

1. **App name** — choose from `docs/app-store-metadata.md` or bring your own
2. **Gemini model ID** — verify the correct ID at https://ai.google.dev/gemini-api/docs/models/gemini and update `backend/src/services/gemini.ts`
3. **OpenFoodFacts** — in or out? Recommendation is in (free, fast, no strings). Your call. If out, barcode path goes Gemini-only.
4. **Ads** — AdMob or nothing? Needs a decision before App Store submission (affects privacy nutrition label)
5. **Privacy policy hosting** — needs a public URL before you can submit to App Store (GitHub Pages is fine)

---

## Quick Start (Backend)

```bash
cd backend
npm install
cp .dev.vars.example .dev.vars  # fill in your Gemini key + HMAC secret
npm run dev                      # local dev at localhost:8787
```

## Quick Start (Prompt Testing)

```bash
# Drop test images in scripts/test-images/
export GEMINI_API_KEY=your_key
npx tsx scripts/test-prompts.ts
```
