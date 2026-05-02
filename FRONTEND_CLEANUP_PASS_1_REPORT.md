# Frontend Cleanup Pass 1 Report

## Scope

This pass stayed inside the static frontend repo only and did not touch the Chrome extension, backend, mobile app, API contracts, auth flow, pricing logic, checkout behavior, analytics event names, public URLs, route names, storage keys, or visual design.

## Frontend Structure Map

### Primary user-facing HTML pages

- `index.html` - home / marketing entry
- `pricing.html` - subscriptions and packs checkout handoff
- `app.html` - queue / generation workflow
- `presets.html` - voice / templates workflow
- `account.html` - account, usage, billing, and packs
- `packs.html` - packs dashboard / management
- `portal.html` - legacy auth-to-packs handoff page
- `store.html` - legacy packs store redirect surface

### Shared JavaScript

- `js/app-core.js` - API base, token helpers, shared fetch wrapper, token verification
- `js/auth-modal.js` - shared modal auth flow
- `js/access.js` - legacy redirect helper set, not currently referenced by any HTML page

### Shared CSS

- `styles.css` - active shared stylesheet used by current user-facing pages
- `css/styles.css` - older duplicate stylesheet path present in repo, not changed in this pass

### Duplicate or stale-looking files found but not deleted

- `login.html`, `register.html`, `signup.html` - legacy auth pages still present alongside the modal auth flow
- `portal.html` - legacy handoff page
- `store.html` - legacy store surface with an immediate redirect to `pricing.html#packs`
- `css-test.html`, `css-test-embedded.html` - test pages
- `dmtools-legal-autosync/` - duplicated legal-page source directory
- `.tmp-check-app_html.js`, `.tmp-check-presets_html.js`, `.tmp-check-pricing_html.js` - temporary syntax-check files already present and left untouched

## Files Changed

- `js/app-core.js`
- `pricing.html`
- `account.html`
- `FRONTEND_CLEANUP_PASS_1_REPORT.md`

## What Changed

### `js/app-core.js`

- Tightened two unused catch variables to `_`
- Clarified the file header comment so its shared role is easier to identify

### `pricing.html`

- Added small section comments to the inline pricing script
- Reformatted a few dense local helper functions for readability only
- Kept pricing endpoint strings, checkout behavior, analytics events, auth behavior, and UI unchanged

### `account.html`

- Added small section comments to the inline account script
- Reformatted a few dense local helpers and data-loader functions for readability only
- Kept account endpoints, auth behavior, billing behavior, upgrade CTA behavior, and UI unchanged

## What Was Intentionally Not Changed

- No endpoint strings were changed in the current primary pages
- No pricing calculations, pack filtering, checkout payloads, or Lemon Squeezy flow were changed
- No auth modal behavior, return paths, token keys, or login/register event names were changed
- No CSS class names were changed
- No files were deleted
- No admin pages, backend code, extension code, mobile code, or `language-barrier-buster/` files were edited
- No legacy pages were refactored in this pass because they need explicit approval due to auth / checkout risk

## Endpoint Consistency Check

### Current primary user-facing pages reviewed

- `pricing.html`: `/subscription/pricing`, `/user/profile`, `/packs/status`, `/checkout/create`
- `account.html`: `/user/profile`, `/account/usage`, `/account/billing`, `/packs/status`, `/packs/activate`
- `app.html`: `/user/profile`
- `presets.html`: `/user/profile`
- `js/auth-modal.js`: `/user/register`, `/user/login`
- `js/app-core.js`: `/user/profile`

### Result

- No obvious typos were found in the endpoint strings used by the current primary pages

## Broken Internal Link Check

### Clearly valid current links observed

- `/index.html`
- `/app.html`
- `/presets.html`
- `/pricing.html`
- `/pricing.html#packs`
- `/account.html`
- `/terms-of-service.html`
- `/privacy-policy.html`
- `/refund-policy.html`
- `/cookie-policy.html`
- `/contact.html`
- `/manifest.json`
- `/js/app-core.js`
- `/js/auth-modal.js`
- `/styles.css`

### No clearly broken local `href` / `src` references were fixed in this pass

- I did not change uncertain legacy links on older pages

## Suspicious Issues Found But Not Fixed

- `js/access.js` still contains redirect-based auth helpers that point to `/login.html?returnTo=...`. That conflicts with the repo's current modal-auth preference, but the file is not currently referenced by any HTML page, so I left it unchanged.
- `portal.html` checks `localStorage.getItem('token')`, while the shared frontend helpers use `authToken`. This looks stale or inconsistent, but changing it could affect a legacy auth handoff path.
- `store.html` appears legacy and immediately redirects to `pricing.html#packs`, but still contains a large inline script with duplicate auth helpers, duplicate `logout()` definitions, and hardcoded API access patterns that bypass `js/app-core.js`.
- `login.html`, `register.html`, and `signup.html` still exist even though current primary pages use the shared modal auth flow. They may be legacy fallback surfaces.
- `css/styles.css` may be an older duplicate of root `styles.css`; I did not merge or remove it without usage proof.
- Temporary syntax-check files are present at repo root and look disposable, but they were not created in this pass, so I left them alone.

## Manual Test Checklist

- [ ] Home page loads
- [ ] Signup/register modal opens
- [ ] Login flow opens
- [ ] Pricing page loads
- [ ] Pricing calls the expected backend pricing endpoint
- [ ] Checkout button still starts checkout
- [ ] Account link still works
- [ ] Queue/app page still loads
- [ ] Presets/voice page still loads
- [ ] Mobile nav/menu still works
