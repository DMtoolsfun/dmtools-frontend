# Tap-Out Google Play Launch Notes

Last updated: June 18, 2026

## Public URLs

- Privacy policy URL: https://dmtools.fun/tap-out-privacy.html
- Support URL: https://dmtools.fun/tap-out-support.html
- Local files reviewed:
  - `tap-out-privacy.html`
  - `tap-out-support.html`
  - `tap-out.html`

Manual live verification is still required after deployment to confirm the public URLs return the updated content.

## Current App Behavior

- App name: Tap-Out
- Package ID: `fun.dmtools.tapout`
- Accounts/login: No
- Chat/social messaging: No
- In-app purchases: No current IAP flow
- Ads: Yes
- Ad SDK: Google AdMob / Google Mobile Ads SDK via `@capacitor-community/admob`
- Ad formats currently used: banner, interstitial, rewarded
- App Open ad unit: configured for future support, not displayed by the current installed plugin version
- Consent messaging: Uses the AdMob plugin consent flow where supported
- First-party server upload by Tap-Out: No known DMTools server upload for local gameplay data
- Android permissions observed in `android/app/src/main/AndroidManifest.xml`: `android.permission.INTERNET`

## Play Console Data Safety Draft

These notes are a draft for Play Console entry and are not legal advice. Re-check the current Google Play form and the official Google Mobile Ads SDK disclosure guide before submission.

- App contains ads: Yes
- User accounts: No
- In-app purchases: No
- Location: No app-requested location permission observed. Google Mobile Ads SDK collects IP address, which Google says may be used to estimate general location.
- Contacts: No
- Photos/videos/files: No
- Microphone: No
- Camera: No
- Local player name / initials: Stored on-device as local gameplay data
- Local high scores / leaderboard: Stored on-device as local gameplay data
- Difficulty, sound, and gameplay preferences/progress: Stored on-device as local gameplay data
- Third-party SDK: Google Mobile Ads SDK / AdMob
- Official SDK disclosure source: https://developers.google.com/admob/android/privacy/play-data-disclosure

## Google Mobile Ads SDK Data Disclosure Notes

Based on Google's official Google Mobile Ads SDK Play data disclosure guide, the SDK automatically collects and shares the following data types for advertising, analytics, and fraud prevention:

- IP address
- User product interactions, including app launch, taps, and video views
- Diagnostic information, including app and SDK performance information
- Device and account identifiers, including Android advertising ID, app set ID, and applicable identifiers related to signed-in accounts on the device

Google states that data collected by the Google Mobile Ads SDK is encrypted in transit using TLS. Developers remain responsible for their own Play Data Safety answers and must also account for any additional app-specific data collection, sharing, or optional SDK features.

## Policy Text Checks

- Privacy page states Tap-Out contains ads.
- Privacy page names Google AdMob / Google Mobile Ads SDK.
- Privacy page states consent messaging is used where required or supported.
- Privacy page describes local gameplay data stored on-device.
- Privacy page states no accounts or login.
- Privacy page states no chat or social messaging.
- Privacy page avoids claiming that no data is collected or never shared.
- Support page provides `admin@dmtools.fun` and links to the privacy page.
