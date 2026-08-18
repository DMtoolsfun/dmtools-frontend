# Analytics Signup Event Audit

## Verified Root Cause

- `dmtools-frontend/js/auth-modal.js` previously emitted browser `sign_up_success` after a successful register response, which made the browser a non-authoritative signup success source.
- The partial frontend attempt still emitted browser `sign_up_success` and `free_account_created` when `response.accountCreated === true`, which would duplicate the backend success owner once the backend field existed.
- `dmtools-frontend/welcome.html` had a browser signup response-success event and the partial attempt added browser `sign_up_success` and `free_account_created` for the welcome signup path.
- `dmtools-backend/server.js` emitted backend `sign_up_attempt` on `POST /api/user/register`, duplicating browser-owned signup intent.
- `dmtools-backend/server.js` could verify real account creation at `INSERT INTO users ... RETURNING id`, but the register response did not expose a non-sensitive `accountCreated` boolean.
- Backend `sign_up_success` already fired only after PostgreSQL returned an inserted `userRow.id`; backend `free_account_created` was missing from that same authoritative creation point.

## Final Event Ownership

| Event | Final owner | Final rule |
| --- | --- | --- |
| `sign_up_attempt` | Browser | Fired once from the auth modal or welcome form after intentional signup submit validation and before calling `/user/register`. |
| `sign_up_success` | Backend | Fired only after `POST /api/user/register` inserts a new user row and PostgreSQL returns `userRow.id`. |
| `free_account_created` | Backend | Fired only after that same confirmed insert and only when the returned new user's plan is `free`. |
| `free_account_create_error` | Browser | Fired only after a registration request was started and then failed by response or request error. |

The browser no longer emits `sign_up_success` or `free_account_created`. The backend no longer emits `sign_up_attempt`.

## API Contract

- New account response: preserves the existing success response shape and adds `accountCreated: true` only from the confirmed inserted-user path.
- Duplicate/existing account response: preserves the existing `409` status and `Email already registered` error semantics, and adds `accountCreated: false`.
- Failed registration response: validation, duplicate-check database errors, insert errors, response errors, and unknown registration errors return their existing status/error semantics with `accountCreated: false`.
- Authoritative basis: `accountCreated: true` is set only after `INSERT INTO users ... RETURNING id, email, first_name, last_name, plan` returns a row with `userRow.id`.
- GA4 privacy: no emails, passwords, tokens, direct contact data, or other sensitive request values were added to GA4 payloads. The reserved GA4 `user_id` uses the same non-email internal numeric id already used by backend events. Signup success payloads continue to use safe parameters such as `endpoint`, `stage`, `status`, `method`, and `plan`.

## Funnel Identity Stitching

- The read-only GA4 account check confirmed that the backend Measurement Protocol target is the `dmtools.fun llc` web stream (`G-YFTZBVLQHF`).
- `js/app-core.js` now reads that stream's browser `client_id` and `session_id` through the supported `gtag('get', ...)` API before DMTools API calls.
- Only validated positive-number GA identifiers are forwarded in `X-GA-Client-ID` and `X-GA-Session-ID`; emails, tokens, and other request data are never used as analytics identity.
- The backend accepts those two headers through CORS, validates them again, and prefers the browser `client_id` for request-backed Measurement Protocol events. Existing deterministic identifiers remain the fallback for clients without browser GA context.
- Successful signup, login, token verification, and logout now set or clear GA4's reserved `user_id` through `gtag('set', ...)`, using the same non-email internal user id already sent by backend events.
- First-reply, reply-success, and free-limit milestone events now retain the originating request, so they receive the same client/session context when available. Webhook-confirmed purchases continue to join authenticated journeys through the existing backend `user_id`.
- Analytics retrieval is bounded to 500 ms and fail-open: blocked or unavailable analytics never prevents an API request.

## Duplicate Email Behavior

- Duplicate email still returns HTTP `409`.
- Duplicate email now includes `accountCreated: false`.
- Duplicate email continues to emit backend `sign_up_error`, not `sign_up_success` or `free_account_created`.
- The browser emits `free_account_create_error` after the failed register response and emits no signup success/account-created event.

## Files Changed

- `dmtools-backend/server.js`
  - Removed backend `sign_up_attempt`.
  - Added `accountCreated: true` to the confirmed new-account response.
  - Added `accountCreated: false` to duplicate and failed registration responses.
  - Added backend `free_account_created` at the same confirmed inserted-user point as `sign_up_success`, limited to free-plan accounts.
- `dmtools-frontend/js/auth-modal.js`
  - Preserved browser `sign_up_attempt` on intentional register submit.
  - Preserved browser `free_account_create_error` only after a started register request fails.
  - Removed browser `sign_up_success` and `free_account_created`.
- `dmtools-frontend/js/app-core.js`
  - Added browser/client/session identity forwarding for the exact backend GA4 stream.
  - Added GA4 User-ID set/clear handling across authentication state changes.
- `dmtools-frontend/welcome.html`
  - Preserved browser `sign_up_attempt` on the welcome signup submit.
  - Preserved browser `free_account_create_error` only after a started register request fails.
  - Removed browser signup success/account-created emissions from the welcome path.
- `dmtools-frontend/ANALYTICS_SIGNUP_EVENT_AUDIT.md`
  - Replaced the partial audit with this final cross-repo audit.

## Validation Actually Performed

Passed:

- `node --check .\js\app-core.js` from `C:\dev\dmtools\dmtools-frontend`
- `node --check .\js\auth-modal.js` from `C:\dev\dmtools\dmtools-frontend`
- `node --check .\server.js` from `C:\dev\dmtools\dmtools-backend`
- `git diff --check` from `C:\dev\dmtools\dmtools-frontend`
- `git diff --check` from `C:\dev\dmtools\dmtools-backend`
- `rg -n 'sign_up_attempt|sign_up_success|free_account_created|free_account_create_error|free_account_create_response_success' .\dmtools-frontend .\dmtools-backend\server.js -g '*.js' -g '*.html'` from `C:\dev\dmtools`
- Node VM browser-identity probe: valid client/session headers forwarded; invalid values omitted; User-ID set and cleared.
- Node VM blocked-analytics probe: the API request continued after the bounded analytics timeout without identity headers.
- Backend helper probe: valid client/session headers accepted, invalid values rejected, and browser client id preferred by the Measurement Protocol path.
- `npm.cmd test` from `C:\dev\dmtools\dmtools-backend` (passes, but the configured script reports `No tests specified`).

Blocked:

- No automated repository test suite exists for this code path; validation used syntax checks and focused behavioral probes.

Script discovery:

- Frontend has no `package.json`, so no frontend npm lint/test/typecheck script exists in this checkout.
- Backend `package.json` has only `test`, defined as `echo "No tests specified" && exit 0`; no backend lint/typecheck script was present.

Manual scenarios actually verified:

- No live browser, API, PostgreSQL, or GA4 DebugView scenario was manually executed in this environment.

## Manual Test Checklist

1. New successful signup
   - Submit a brand-new email through the auth modal and welcome flow.
   - Confirm `/api/user/register` returns `accountCreated: true`.
   - Confirm PostgreSQL/admin dashboard shows exactly one new user.
   - Confirm GA4 receives browser `sign_up_attempt`, backend `sign_up_success`, and backend `free_account_created` for a free account.
   - Confirm the browser does not emit `sign_up_success` or `free_account_created`.
2. Duplicate existing-email signup
   - Submit an already registered email.
   - Confirm the API returns HTTP `409` with `accountCreated: false`.
   - Confirm no new PostgreSQL user is created.
   - Confirm GA4 receives no `sign_up_success` and no `free_account_created`.
   - Confirm the browser emits `free_account_create_error` after the failed response.
3. Failed request
   - Force a validation, network, or server failure after signup submit.
   - Confirm failed responses do not include `accountCreated: true`.
   - Confirm GA4 receives browser `free_account_create_error` only after the request starts.
   - Confirm no browser or backend signup success/account-created event fires unless PostgreSQL actually inserted a new user row.
4. Existing-user login
   - Log in with an existing user.
   - Confirm login behavior and `login_success` remain unchanged.
   - Confirm no `sign_up_success` or `free_account_created` fires.
5. Signed-in reload/session restore
   - Reload signed-in pages and let token verification/auth-state detection run.
   - Confirm `auth_state_detected` behavior remains unchanged.
   - Confirm no `sign_up_success` or `free_account_created` fires on reload/session restore.
