# App Store Guideline 2.1 — Draft Response

> This is a template. Fill in [BRACKETED] sections before submitting.
> Guideline 2.1 rejections mean Apple thinks the app has limited utility or is incomplete. The response needs to be specific and calm, not defensive.

---

**To:** App Review  
**App:** [YOUR APP NAME] — [App ID]  
**Version:** [VERSION NUMBER]  
**Rejection:** Guideline 2.1 — Performance: App Completeness

---

Thank you for reviewing [YOUR APP NAME]. I'd like to address the 2.1 concern and provide clarification on the app's functionality and how to test it.

**What the app does:**

[YOUR APP NAME] is a personal calorie and macro tracking app. It solves a specific problem: most calorie trackers either charge $8–15/month for basic features, or bury essential functionality behind accounts and sign-up flows. This app requires no account, no subscription, and no login. Users open the app and start logging immediately.

Core functionality:
- Log food by taking a photo of a meal, nutrition label, or recipe — the app uses AI to estimate nutrition automatically
- Log food by scanning a product barcode — the app looks up nutrition data and presents it for confirmation
- Log food manually by entering values directly
- View daily calorie and macro totals
- Browse past days via a calendar view
- Set a personal daily calorie goal

**How to test (no account or login required):**

1. Launch the app
2. On the main screen, tap the "+" button
3. Select "Photo" to analyze a meal or label (point at any food item)
4. The app sends the image to our AI backend and returns estimated nutrition within 3–5 seconds
5. Confirm the entry — it appears in today's log immediately
6. Tap "Barcode" from the "+" menu, point at any packaged food product barcode — it auto-detects and shows nutrition
7. Tap "Manual" to enter values by hand — no network required
8. Tap any log entry to view detail, edit, or delete it
9. Navigate to past days using the calendar icon in the top right

**External services used:**

- **Google Gemini API** (via our proxy at [YOUR_WORKER_URL]): Used for AI-powered nutrition analysis from photos. Images are sent to Google's API and not stored server-side. See Google's privacy policy: https://policies.google.com/privacy
- **OpenFoodFacts API** (https://world.openfoodfacts.org): Used for barcode product lookup. Only the barcode number is sent — no images, no user data.

**Network requirement note:**

Photo and barcode analysis require an internet connection. Manual entry works fully offline. The app displays a clear error if the network is unavailable during AI analysis.

**Regulatory note:**

This app does not make any medical or health claims. It is a logging tool. Calorie tracking for personal awareness is not a regulated medical device category. The App Store description and in-app copy do not include any medical or clinical language.

**Screen recording:**

[NOTE: You must record a screen capture on a physical device yourself — Simulator does not support the camera. Record: app launch → "+" → Photo (point at food) → result displayed → confirmed → appears in log. Submit via App Store Connect under "App Review Information > Demo Video."]

**Regional availability:**

The app is available globally. UI language is English only in version 1.0.

---

**Do NOT write in your App Store description or marketing copy:**

- "helps manage your diet" → vague health claim
- "improves health" → medical-adjacent
- "tracks your nutrition for better wellness" → implied health benefit
- "recommended for weight loss" → medical claim
- Anything implying clinical accuracy of AI estimates

Safe language: "log your food," "track your daily calories," "see what you eat," "calorie counter."

---

If you have specific concerns about functionality that wasn't clear during review, I'm happy to provide a screen recording walkthrough or additional test credentials. The app has no login, so testing all features requires only installing it.

Thank you.

[YOUR NAME]  
[CONTACT EMAIL]
