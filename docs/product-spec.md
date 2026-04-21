# Product Spec — Calorie Tracker

**Version:** 0.1 (Phase 1 draft)  
**Owner:** Marco  
**Status:** Pre-build

---

## The Problem

Every calorie tracker charges $8–15/month for features that should be free. The ones that are free are bloated, gamified, or require an account just to log a banana. Inconsistency kills tracking habits. The #1 reason people stop: it takes too many taps.

## What This App Does

A dead-simple iOS app for logging food and tracking calories + macros. Three ways to log:

1. **Photo** — point camera at a meal, nutrition label, or recipe page → AI estimates nutrition
2. **Barcode** — scan a barcode → product lookup → confirm and log
3. **Manual** — type food name + numbers

That's it. No account required. No subscription.

---

## Target User

Someone who wants to track calories without drama. They've tried MyFitnessPal, got frustrated, quit. They're not a fitness influencer. They want a number at the end of the day, not a social feed.

---

## User Flows (Minimum Taps to Log)

### Photo Path (Meal / Label / Recipe)
1. Tap "+" → Tap "Photo"
2. Take photo (or pick from library)
3. AI returns: name, calories, protein, carbs, fat
4. Review → confirm (or adjust quantity/serving)
5. Logged. Done. **5 taps.**

### Barcode Path
1. Tap "+" → Tap "Barcode"
2. Point camera at barcode — auto-detects (no tap to capture)
3. Product found → review nutrition panel
4. Confirm
5. Logged. Done. **4 taps (3 if auto-confirmed).**

### Manual Path
1. Tap "+" → Tap "Manual"
2. Type food name, calories, and optionally protein/carbs/fat
3. Confirm
4. Logged. Done. **3 taps + typing.**

### Edit / Delete
- Long-press any log entry → Edit or Delete
- Edit brings back the same confirm screen with pre-filled values

---

## Core Features (v1)

- Daily log (today's entries + running calorie total)
- Calendar view to navigate past days
- Macro breakdown: calories, protein, carbs, fat
- Per-entry detail (time, method used to log, edit/delete)
- Configurable daily calorie goal (set once, stored locally)
- AI photo analysis via proxy (label, meal, recipe)
- Barcode scan via device camera + product lookup
- Dark mode support (follows system)
- No account, no login, no sync — local only in v1

---

## Out of Scope (v1)

These are off the table for v1. Do not add them "just in case."

- Social features of any kind
- Gamification (streaks, badges, leaderboards)
- Exercise / activity tracking
- Water tracking
- Meal planning / recipes saved in-app
- Nutrition database search (text search for "chicken breast")
- Third-party account login (Apple, Google)
- iCloud sync
- Apple Health integration
- Widgets
- Notifications / reminders
- Localization (English only)
- iPad support

---

## Design Principles

1. **Fewer taps wins.** Every extra screen is a reason to quit.
2. **Instant feedback.** AI response should feel fast. Show a spinner with progress, not a blank screen.
3. **Trust the user.** Don't ask for confirmation twice. Don't add "are you sure?" dialogs for non-destructive actions.
4. **No dark patterns.** No "start free trial" nudges. No ratings prompts after 3 days. (Optional: rate after 30 days of use.)
5. **Privacy by default.** Photos aren't stored server-side. No analytics in v1 unless lightweight and transparent.

---

## Monetization

- Free download, no subscription
- Minor banner/interstitial ads (e.g., AdMob) to cover server costs
- Economics: see `docs/economics.md`

---

## Success Metric (v1)

A user can log their lunch in under 30 seconds from unlock.
