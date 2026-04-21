# Privacy Policy — [APP NAME]

**Last updated:** [DATE]  
**Developer:** Marco / [YOUR COMPANY OR NAME]  
**Contact:** marco@boresrl.com

---

## What data this app uses

### Data stored on your device

All food logs, calorie goals, and usage history are stored locally on your device using iOS's built-in storage (SwiftData). This data never leaves your device except as described below.

No account is required. No data is linked to your identity.

### Data sent to our server

When you use the photo analysis feature, the image you take is sent to our backend server (hosted on Cloudflare) solely for the purpose of AI nutrition analysis. We do not store images after the analysis is complete.

Our server logs:
- An anonymous device identifier (generated on first launch, never tied to your name or Apple ID)
- The type of request (photo analysis, barcode lookup)
- Timestamps and response times

Our server does **not** log:
- Images
- Food names or nutrition results
- Your location
- Any personal information

### Data sent to third parties

**Google Gemini API:**  
Photos are sent to Google's Gemini AI service for nutrition analysis. Google processes these images per their API terms of service and privacy policy. Google does not use API data to train models (per their current policy — verify at [https://ai.google.dev/gemini-api/terms](https://ai.google.dev/gemini-api/terms)).

**OpenFoodFacts:**  
When scanning a barcode, only the barcode number (a string of digits) is sent to OpenFoodFacts. No images, no user data.

**Advertising:**  
The app may show ads via [ADMOB / AD NETWORK NAME]. Standard ad identifiers (IDFA/IDFV) may be used per your iOS privacy settings. You can opt out of personalized ads in iOS Settings → Privacy → Tracking.

---

## Apple Privacy Nutrition Label

| Data Type | Collected | Linked to Identity | Used for Tracking |
|-----------|-----------|-------------------|-------------------|
| Identifiers (Device ID) | Yes | No | No |
| Usage Data | Yes (aggregate only) | No | No |
| Photos | Transient (not stored) | No | No |
| Health & Fitness (food logs) | No — stored on device only | — | — |
| Location | No | — | — |
| Contact Info | No | — | — |

When submitting to App Store Connect, select:
- **Data Not Linked to You** → Identifiers → Device ID (used for rate limiting)
- **Data Not Collected** for everything else

---

## GDPR (EU Users)

**Legal basis:** Legitimate interest (providing the service you requested).

**Your rights:**
- **Access / Export:** All your food data is on your device. Export by deleting and reinstalling — there's nothing server-side to export.
- **Deletion:** Delete the app. All local data is removed. Server-side logs (anonymous device ID + timestamps) are deleted within 30 days.
- **Correction:** Edit any log entry in-app.
- **Objection to processing:** Contact marco@boresrl.com — for analytics/logging objections, we can disable your device ID's logging.

**Data controller:** Marco / [YOUR COMPANY]  
**Contact for privacy requests:** marco@boresrl.com

---

## Children

This app does not knowingly collect data from users under 13. It does not target children.

---

## Changes to this policy

If we change what data is collected, we will update this document and note the new date at the top. We will not retroactively change data practices for data already collected.
