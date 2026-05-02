# Frontend Cleanup Pass 2 Legacy Auth Report

## Scope

This pass stayed in `dmtools-frontend-fresh` only and focused on investigation, documentation, and comment-only cleanup for legacy auth and route surfaces. No backend, extension, mobile, checkout, pricing, analytics, token-storage, or visual behavior was changed.

## Current Auth Standard Summary

The likely current standard auth path is:

1. Shared helpers are loaded with:
   - `/js/app-core.js`
   - `/js/auth-modal.js`
2. User-facing pages open auth via `data-auth="login"` or `data-auth="register"` buttons, or by direct calls to `DMTOOLS.openAuthModal(...)`
3. Shared modal auth posts to:
   - `/user/register`
   - `/user/login`
4. Signed-in checks use:
   - `DMTOOLS.verifyToken()`
   - `DMTOOLS.apiCall('/user/profile', ...)`
5. Shared token storage uses:
   - `localStorage['authToken']`

### Current standard by primary page

- `index.html`
  - Header `Sign in` and `Start free` use `data-auth`
  - Loads `/js/app-core.js` and `/js/auth-modal.js`
  - Also calls `DMTOOLS.verifyToken()` for auth-aware UI
- `pricing.html`
  - Header `Sign in` and `Start free` use `data-auth`
  - Loads `/js/app-core.js` and `/js/auth-modal.js`
  - Uses `DMTOOLS.verifyToken()` and `/user/profile`
- `account.html`
  - Header and signed-out CTAs use `data-auth`
  - Loads `/js/app-core.js` and `/js/auth-modal.js`
  - Uses `DMTOOLS.verifyToken()` and `/user/profile`
- `app.html`
  - Header and signed-out CTAs use `data-auth`
  - Also has direct `DMTOOLS.openAuthModal('login', { returnTo: '/app.html' })` calls in queue flow
  - Uses `DMTOOLS.verifyToken()` and `/user/profile`
- `presets.html`
  - Header and signed-out CTAs use `data-auth`
  - Also opens modal directly from hero CTA fallback
  - Uses `DMTOOLS.verifyToken()` and `/user/profile`
- `home / index.html`
  - Uses modal auth from header buttons; no direct legacy route dependency found

## Legacy / Stale Candidates

- `js/access.js`
  - Not included by any current HTML page in repo scan
  - Encodes an older redirect-based auth path through `/login.html` and `/portal.html`
- `portal.html`
  - Legacy handoff page
  - Uses `localStorage.getItem('token')` instead of shared `authToken`
  - Opens modal login or redirects to `/packs.html`
  - Current repo scan shows it is linked from `store.html`
- `signup.html`
  - Redirect shim to `/register.html`
  - No independent auth logic
- `login.html`
  - Bridge page into shared modal auth
  - Not linked from active primary pages in this scan
- `register.html`
  - Bridge page into shared modal auth
  - Receives traffic from `signup.html`
- `store.html`
  - Legacy route surface with immediate redirect to `/pricing.html#packs`
  - Still contains a large inline script and still links to `/portal.html`
- `welcome.html`
  - Not part of the current standard auth path
  - Contains a separate free-account flow that posts to `/auth/register`

## Endpoint Inventory

### Current standard auth endpoints

- `js/auth-modal.js`
  - `/user/register`
  - `/user/login`
- `js/app-core.js`
  - `/user/profile` via `DMTOOLS.verifyToken()`
- `index.html`
  - `DMTOOLS.verifyToken()`
- `pricing.html`
  - `/user/profile`
- `account.html`
  - `/user/profile`
- `app.html`
  - `/user/profile`
- `presets.html`
  - `/user/profile`

### Legacy or non-standard auth-related endpoints

- `welcome.html`
  - `/auth/register`

### Endpoints not found in repo scan

- `/auth/login`
- `/api/auth/register`
- `/api/auth/login`
- `/api/user/register`
- `/api/user/login`

### Suspicious endpoint mismatch

- `welcome.html` uses `/auth/register`, while the shared modal standard uses `/user/register`
- This was not changed in this pass because:
  - it is outside the primary production auth path described above
  - there is not yet enough proof that the older welcome flow is dead or broken
  - changing it could alter onboarding behavior

## Internal Link Inventory

### Links to `store.html`

- `index.html`
- `contact.html`
- `cookie-policy.html`
- `privacy-policy.html`
- `refund-policy.html`
- `terms-of-service.html`
- `welcome.html`
- `packs.html`
- `store.html` itself
- `install-extension.html`
- `analytics.html`
- `css-test.html`
- `css-test-embedded.html`

### Links to `portal.html`

- `store.html`
- `js/access.js` redirect helpers and defaults
- `js/auth-modal.js` comments and defaults reference `/portal.html`

### Links to `register.html`

- `signup.html` only
- `js/auth-modal.js` documentation examples only

### Links to `login.html`

- `js/access.js` redirect helper only
- `js/auth-modal.js` documentation examples only

### Links to `signup.html`

- No internal links found in current repo scan

### Links to `access.html`

- No `access.html` file or links found

## Files Changed

- `js/access.js`
- `portal.html`
- `signup.html`
- `FRONTEND_CLEANUP_PASS_2_LEGACY_AUTH_REPORT.md`

## Files Intentionally Not Changed

- `login.html`
- `register.html`
- `store.html`
- `welcome.html`
- `js/auth-modal.js`
- `js/app-core.js`
- `index.html`
- `pricing.html`
- `account.html`
- `app.html`
- `presets.html`
- All extension-related files and links
- All backend files
- All mobile surfaces
- `language-barrier-buster/`
- `.tmp-check-*.js`

## Recommended Next Pass

1. Decide whether `store.html` should remain a linked public route or become a clean redirect-only shell.
2. Decide whether `portal.html` is still needed, or whether its remaining pack handoff should move to a current standard page.
3. Decide whether `login.html` and `register.html` should remain as compatibility bridge pages with the shared modal, or be redirected later.
4. Validate `welcome.html` against the current backend contract and decide whether `/auth/register` should be migrated to `/user/register`.
5. Audit `install-extension.html` and store-related links to confirm whether `store.html` is still the desired destination.

## Manual Test Checklist

- [ ] Home page loads
- [ ] Header Start free opens expected auth flow
- [ ] Header Sign in opens expected auth flow
- [ ] Pricing page Start free/sign in still works
- [ ] Account page signed-out state still works
- [ ] Account page signed-in API calls still work
- [ ] Queue/app page auth gating still works
- [ ] Presets/voice page auth gating still works
- [ ] Legacy pages, if opened directly, do not break unexpectedly
- [ ] No checkout behavior changed
