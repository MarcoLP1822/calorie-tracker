# Architecture — Calorie Tracker

---

## iOS App Stack

### Framework: SwiftUI
No debate here. UIKit is unnecessary complexity for a solo dev on a greenfield app in 2024+. SwiftUI + SwiftData is the modern stack Apple is actively investing in.

### Storage: SwiftData
**Recommendation: SwiftData over CoreData.**

Why:
- SwiftData is CoreData underneath but with a Swift-native API — no NSManagedObjectContext boilerplate
- Declarative model definitions with `@Model` macro
- Works seamlessly with SwiftUI via `@Query`
- Easier to read and maintain solo

Tradeoff: SwiftData requires iOS 17+. That's acceptable — iOS 17 adoption is >90% as of early 2025, and the user base for a new app will skew toward recent hardware.

**iOS Floor: iOS 17.0**

### Architecture Pattern: MVVM
Light MVVM. SwiftUI views, `@Observable` ViewModels, SwiftData models. Don't over-engineer this — no Coordinator pattern, no DI framework. Solo dev, ship fast.

### Dependencies (Minimal)
- **None for core app.** AVFoundation handles barcode scanning. SwiftUI handles UI. SwiftData handles persistence.
- Optional later: `swift-log` for structured logging if needed.

No third-party package manager required for v1 beyond what Xcode provides natively.

---

## Data Model (SwiftData)

```swift
@Model class FoodEntry {
    var id: UUID
    var date: Date
    var name: String
    var calories: Double
    var protein: Double   // grams
    var carbs: Double     // grams
    var fat: Double       // grams
    var logMethod: LogMethod  // .photo, .barcode, .manual
    var confidence: Double?   // AI-only, 0–1
}

@Model class DaySettings {
    var date: Date  // day-level key
    var calorieGoal: Double
}

@Model class UserPrefs {
    var dailyCalorieGoal: Double
    var onboardingComplete: Bool
}

enum LogMethod: String, Codable { case photo, barcode, manual }
```

---

## Gemini Integration

### Flow
```
iOS App → HTTPS → Cloudflare Worker (proxy) → Gemini API
```

The app never holds the Gemini key. The proxy handles authentication, rate limiting, and structured output parsing.

### Why a proxy (not direct from app)?
- API key can't be hardcoded in an app binary — trivially extractable
- Centralizes rate limiting and abuse defense
- Lets you swap AI providers later without an app update
- Keeps costs observable in one place

### Proxy: Cloudflare Workers
- Free tier: 100k requests/day — plenty for v1
- Globally distributed, fast cold starts
- KV for rate limiting counters
- TypeScript, deploy with `wrangler`

See `backend/` for full implementation.

---

## Barcode Handling

**Recommendation: Don't send barcode images to Gemini. It's slower and more expensive than it needs to be.**

Here's the better path:

1. **AVFoundation** (on-device, free) reads the barcode number in real time — no network call, no cost, instant.
2. App sends just the barcode number (string) to the proxy.
3. Proxy hits **OpenFoodFacts API** first — free, no key, massive database of real packaged products.
4. If OpenFoodFacts has no result, proxy can fall back to Gemini with a text prompt: `"Provide estimated nutrition for a product with barcode {number}"` — though Gemini doesn't have a barcode database, so this mostly returns generic estimates.

**Decision for Marco:**
- OpenFoodFacts covers ~3M products and is reliable for packaged food. It's free and fast. You said "bypass nutrition databases," but OFF isn't really a nutrition database you manage — it's a free API call. Strongly recommend including it.
- If you want to keep it pure AI-only, the barcode fallback to Gemini still works; it just returns lower-quality data for unknown products.
- Either way, barcode *image* scanning via Gemini is not worth it.

---

## Cloudflare Worker Proxy

### Endpoints
| Method | Path | Input | Output |
|--------|------|-------|--------|
| POST | `/analyze/label` | base64 image | `{name, calories, protein, carbs, fat, servingSize, confidence}` |
| POST | `/analyze/meal` | base64 image | `{name, items[], totalCalories, protein, carbs, fat, confidence}` |
| POST | `/analyze/recipe` | base64 image | `{name, servings, perServing: {calories, protein, carbs, fat}, confidence}` |
| POST | `/lookup/barcode` | `{barcode: string}` | `{name, calories, protein, carbs, fat, source: "openfoodfacts"\|"gemini"\|"unknown"}` |

### Auth & Abuse Defense
- First app launch: app sends a device fingerprint → proxy issues an HMAC-signed token (24h TTL, renewable)
- Every subsequent request includes this token in `X-Device-Token` header
- Not bulletproof (can be extracted from memory), but stops casual abuse
- Per-device daily hard cap: configurable in worker env (default: 50 analyses/day)
- Per-IP rate limit: 10 req/min via Cloudflare KV

### Privacy
- No request content is logged (no images, no food names)
- Only logged: device token hash, endpoint called, timestamp, response time
- Logs stored in Cloudflare's analytics, not in KV or D1

---

## Local-First Principle

All food data lives in SwiftData on the user's device. The proxy only sees images and barcodes transiently — nothing is stored server-side. This is a privacy feature and a simplicity feature.

---

## Folder Structure (iOS, Phase 2)

```
CalorieTracker/
├── App/
│   └── CalorieTrackerApp.swift
├── Models/
│   ├── FoodEntry.swift
│   └── UserPrefs.swift
├── Views/
│   ├── DayView.swift          ← main screen, today's log
│   ├── LogSheet/
│   │   ├── PhotoLogView.swift
│   │   ├── BarcodeLogView.swift
│   │   └── ManualLogView.swift
│   ├── HistoryView.swift
│   └── SettingsView.swift
├── ViewModels/
│   ├── DayViewModel.swift
│   └── LogViewModel.swift
├── Services/
│   ├── ProxyService.swift     ← all network calls
│   ├── BarcodeService.swift   ← AVFoundation wrapper
│   └── DeviceTokenService.swift
└── Utilities/
    └── Extensions.swift
```
