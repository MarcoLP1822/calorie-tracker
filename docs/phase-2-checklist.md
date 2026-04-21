# Phase 2 — Mac / Xcode Checklist

Everything here happens on the Mac. Phase 1 (this folder) is the foundation. Phase 2 is the build.

---

## Prerequisites (Do These First)

- [ ] Apple Developer account active ($99/year — required for TestFlight and App Store)
- [ ] Cloudflare Worker deployed (`wrangler deploy` from `backend/`) — see `backend/README.md`
- [ ] Worker URL confirmed working (`curl -X POST https://your-worker.workers.dev/auth/token -d '{"deviceId":"test"}'`)
- [ ] Xcode 15+ installed (required for SwiftData + iOS 17 APIs)
- [ ] iOS 17+ physical device for camera testing (Simulator has no camera)

---

## Xcode Project Setup

- [ ] Create new Xcode project: File → New → Project → iOS → App
  - Product Name: [YOUR APP NAME]
  - Team: [Your Apple Developer Team]
  - Bundle ID: `com.yourname.calorietracker` (or similar — set it once, don't change it)
  - Interface: SwiftUI
  - Language: Swift
  - Storage: SwiftData ← important
- [ ] Set iOS Deployment Target to 17.0 in project settings
- [ ] Delete the default ContentView boilerplate and follow the folder structure in `docs/architecture.md`
- [ ] Add `Privacy - Camera Usage Description` to Info.plist: `"This app uses the camera to analyze food photos and scan barcodes."`
- [ ] Add `Privacy - Photo Library Usage Description`: `"This app lets you pick photos from your library for nutrition analysis."`

---

## App Signing

- [ ] In Xcode → Signing & Capabilities → Automatically manage signing ✓
- [ ] Select your Developer Team
- [ ] Xcode will create a provisioning profile automatically
- [ ] For a physical device: connect iPhone, select it as the run target, trust it on device if prompted

---

## Implement Core Screens (Order Matters)

Build in this order — each layer depends on the previous:

1. **SwiftData models** — `FoodEntry`, `UserPrefs` (from `docs/architecture.md`)
2. **DayView** — today's log list + calorie total + "+" button (no functionality yet, just the shell)
3. **Manual log flow** — simplest path, no network needed, proves SwiftData works end-to-end
4. **ProxyService** — `URLSession` wrapper calling the Cloudflare Worker endpoints
5. **DeviceTokenService** — calls `/auth/token` on first launch, stores token in Keychain
6. **Photo log flow** — `UIImagePickerController` / `PhotosUI` → compress → base64 → proxy → result
7. **BarcodeService** — `AVCaptureSession` with `AVMetadataObjectTypeEAN13Code` etc. → sends number to proxy → result
8. **HistoryView** — calendar navigation
9. **SettingsView** — calorie goal input

---

## TestFlight

- [ ] Bump version to 1.0 (0) in Xcode
- [ ] Product → Archive (must be a real device scheme or Any iOS Device, not Simulator)
- [ ] Upload to App Store Connect via Xcode Organizer
- [ ] In App Store Connect → TestFlight → add internal tester (yourself)
- [ ] Install TestFlight on your iPhone, accept the invitation
- [ ] Test every flow: photo, barcode, manual, edit, delete, past day navigation

---

## Screen Recording for 2.1 (Required)

Apple requires a demo video if the app uses the camera or external services.

- [ ] Use iPhone screen recording: Control Center → Screen Record (with microphone off — no voiceover needed)
- [ ] Record this exact flow:
  1. App launch from home screen → log appears immediately (no login screen)
  2. Tap "+" → Photo → camera opens → point at food → wait for AI result → confirm → back on log
  3. Tap "+" → Barcode → point at package barcode → auto-detect → confirm
  4. Tap "+" → Manual → enter values → confirm
  5. Long-press a log entry → Edit → change value → save
  6. Tap the calendar → navigate to a past day
- [ ] Video should be 1–3 minutes, MP4 or MOV, uploaded under "App Review Information" in App Store Connect

---

## App Store Submission

- [ ] Screenshots in Simulator (6.7" and 6.5" — see `docs/app-store-metadata.md`)
  - Simulator: Hardware → Device → iPhone 15 Pro Max (6.7") and iPhone 14 Plus (6.5")
  - `Cmd+S` to save screenshots, or use `xcrun simctl io booted screenshot file.png`
- [ ] Fill in App Store Connect:
  - App name, subtitle, description, keywords from `docs/app-store-metadata.md`
  - Privacy policy URL (host `docs/privacy-policy.md` somewhere — GitHub Pages is fine)
  - Age rating: 4+
  - Category: Health & Fitness
- [ ] App Review Information:
  - Notes: paste from `docs/app-store-2.1-response.md` (condensed version)
  - Demo video: upload your screen recording
  - Contact info: your email and phone
- [ ] Submit for review

---

## If Review is Rejected

- If **2.1**: Send the response from `docs/app-store-2.1-response.md`
- If **5.1.1** (privacy — data collection): reference `docs/privacy-policy.md` and ensure privacy nutrition label is accurate
- If **4.2** (minimum functionality): you may need to add one more feature to show sufficient utility
- Response time is usually 24–48 hours after you reply; first submission often takes 2–7 days for review

---

## Post-Launch

- [ ] Monitor Cloudflare Worker analytics for error rates and request counts
- [ ] Set up Google Cloud billing alert ($10/month threshold)
- [ ] Add AdMob if you're going the ad route (requires app ID in Info.plist, Xcode integration)
