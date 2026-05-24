# Frontend GA4 Event Alignment Report

## Scope

Searched the frontend repo for legacy and current standardized GA4 event names using:

```powershell
rg -n "free_account_created|free_account_create_error|activation_first_reply|reply_generation_failed|usage_limit_blocked|purchase_completed|sign_up_attempt|sign_up_success|sign_up_error|login_attempt|login_success|login_error|reply_generation_requested|reply_generation_started|reply_generated|reply_generation_error|reply_generation_quota_blocked|first_reply_generated|checkout_requested|checkout_created|checkout_error|payment_success|subscription_created" . --glob '!node_modules/**' --glob '!package-lock.json'
```

Files searched:

- `.gitignore`
- `.htaccess`
- `account.html`
- `Admin_index.html`
- `admin-dashboard.html`
- `admin-v3.html`
- `ANALYTICS_SIGNUP_FRONTEND_FIX_REPORT.md`
- `analytics.html`
- `app-ads.txt`
- `app.html`
- `canonicalize-styles.sh`
- `CNAME`
- `CONFLICT_REPORT.md`
- `contact.html`
- `cookie-policy.html`
- `css-test-embedded.html`
- `css-test.html`
- `css/styles.css`
- `dmtools-legal-autosync/AGENTS.md`
- `dmtools-legal-autosync/CODEX_TASK.md`
- `dmtools-legal-autosync/legal/legal.config.json`
- `dmtools-legal-autosync/legal/templates/privacy-policy.html`
- `dmtools-legal-autosync/legal/templates/refund-policy.html`
- `dmtools-legal-autosync/legal/templates/terms-of-service.html`
- `dmtools-legal-autosync/package.json`
- `dmtools-legal-autosync/privacy-policy.html`
- `dmtools-legal-autosync/README.md`
- `dmtools-legal-autosync/refund-policy.html`
- `dmtools-legal-autosync/scripts/check-legal-docs.mjs`
- `dmtools-legal-autosync/scripts/sync-legal-docs.mjs`
- `dmtools-legal-autosync/terms-of-service.html`
- `extract_shared_css.py`
- `generate-icons.js`
- `gravity-runner-privacy.html`
- `gravity-runner-support.html`
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`
- `index.html`
- `install-extension.html`
- `js/access.js`
- `js/app-core.js`
- `js/auth-modal.js`
- `login.html`
- `manifest.json`
- `packs.html`
- `PHASE1_TESTING.md`
- `portal.html`
- `presets.html`
- `PRICING_FRONTEND_CHANGE_REPORT.md`
- `pricing.html`
- `privacy-policy.html`
- `README.md`
- `refund-policy.html`
- `register.html`
- `REVENUE_FUNNEL_FRONTEND_AUDIT.md`
- `robots.txt`
- `scripts/backup-auto.ps1`
- `scripts/backup-manual.ps1`
- `scripts/backup-sync.ps1`
- `service-worker.js`
- `shared-selectors.txt`
- `signup.html`
- `store.html`
- `styles.css`
- `terms-of-service.html`
- `welcome.html`

`package-lock.json` was excluded from event searching because it is generated dependency metadata. `node_modules` was excluded if present.

## Legacy Events Found

Code:

- `welcome.html`: `free_account_create_error`
- `app.html`: `usage_limit_blocked` in single reply regeneration quota handling
- `app.html`: `usage_limit_blocked` in batch generation quota handling

Documentation-only references:

- `ANALYTICS_SIGNUP_FRONTEND_FIX_REPORT.md`: `free_account_created`, `free_account_create_error`
- `REVENUE_FUNNEL_FRONTEND_AUDIT.md`: `free_account_created`, `free_account_create_error`

Not found in live frontend code:

- `free_account_created`
- `activation_first_reply`
- `reply_generation_failed`
- `purchase_completed`

## Files Changed

- `app.html`
- `welcome.html`
- `FRONTEND_GA4_EVENT_ALIGNMENT_REPORT.md`

## Exact Replacements Made

- `welcome.html`
  - `track('free_account_create_error', ...)` -> `track('sign_up_error', ...)`

- `app.html`
  - `usage_limit_blocked` -> `reply_generation_quota_blocked` for single reply regeneration quota blocks
  - `usage_limit_blocked` -> `reply_generation_quota_blocked` for batch generation quota blocks

## Events Intentionally Left Unchanged

- `free_limit_hit` in `app.html`: left unchanged because it is not in the requested legacy mapping list and appears to distinguish the free-tier UI quota surface from paid-tier quota blocking. Changing it could alter existing free-tier funnel reporting beyond the requested standardization.
- `reply_generated` in `app.html`: already a current standard event. The payload is count/tone/plan/status metadata only, not raw message or reply text.
- `sign_up_attempt`, `sign_up_success`, `login_attempt`, and `login_success` in `js/auth-modal.js`: already current standard events. No auth behavior was changed.
- `checkout_error` in `pricing.html`: already a current standard event. Pricing and checkout behavior were left unchanged.
- `checkout_start` and `checkout_ready` in `pricing.html`: left unchanged because they are not in the requested legacy mapping list. Backend standard names are `checkout_requested` and `checkout_created`, but changing frontend checkout intent events could affect existing reports and was outside the explicit replacement list.
- `free_account_create_response_success` in `welcome.html`: left unchanged because it was not one of the specified legacy events. It is a frontend response/UI event, while backend should own authoritative `sign_up_success` where possible.
- Existing audit markdown references to old event names: left unchanged as historical documentation, not emitted frontend analytics.

## Duplicate Risk Between Frontend And Backend

- Signup: `js/auth-modal.js` emits frontend `sign_up_success` after the register/login modal receives a token. Backend now also emits standardized signup events. This can double count if both are treated as authoritative signup completion. Recommended interpretation: frontend signup events represent UI/API flow result, while backend signup events represent server-confirmed account creation.
- Welcome onboarding: `welcome.html` now emits `sign_up_error` only on frontend/API failure. It does not emit `sign_up_success`; the remaining success event is `free_account_create_response_success`, which avoids duplicating backend `sign_up_success`.
- Reply generation: `app.html` emits `reply_generated` per successful frontend-generated reply in the batch processor. Backend events should be preferred for server-confirmed generation counts. Frontend events are useful for UI flow and client-side funnel steps.
- Quota blocks: `app.html` now emits `reply_generation_quota_blocked` when the frontend receives a quota block. Backend quota events may also exist. Backend should be preferred for authoritative quota enforcement counts.
- Checkout/payment: frontend emits checkout start/ready/error UI events. No frontend `payment_success` or `subscription_created` was found, which is correct because backend/webhooks should own payment and subscription confirmation.

## Recommended GA4 Key Events

Recommended key events:

- `sign_up_success`
- `first_reply_generated`
- `reply_generated`
- `reply_generation_quota_blocked`
- `checkout_created`
- `payment_success`
- `subscription_created`

Recommended supporting funnel events, not necessarily key events:

- `sign_up_attempt`
- `sign_up_error`
- `login_success`
- `reply_generation_requested`
- `reply_generation_started`
- `reply_generation_error`
- `checkout_requested`
- `checkout_error`

## Validation Results

- Legacy/current GA4 search rerun:
  - Live legacy code references remaining from the requested list: none.
  - Legacy references remaining only in historical markdown reports: `ANALYTICS_SIGNUP_FRONTEND_FIX_REPORT.md`, `REVENUE_FUNNEL_FRONTEND_AUDIT.md`.
- `node -e` inline JavaScript syntax check for `app.html`: passed.
- `node -e` inline JavaScript syntax check for `welcome.html`: passed.
- `npm run typecheck`: not run; repo root has no `package.json`, so no script is available.
- `npm test`: not run; repo root has no `package.json`, so no script is available.
- `npm run lint`: not run; repo root has no `package.json`, so no script is available.
- `node --check` on changed JS files: no changed standalone `.js` files. Changed JavaScript is inline in HTML and was checked with `new Function(...)`.

## Privacy Check

The changed events do not add raw message text, prompt text, reply text, email, names, or customer personal data to GA4. Existing payloads remain scoped to source, result, counts, tone, plan/tier, status code, and item metadata.
