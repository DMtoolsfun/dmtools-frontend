# Analytics Signup Frontend Fix Report

## Summary

- Old misleading event: `free_account_created`
- New safer frontend event: `free_account_create_response_success`
- The frontend no longer sends raw `error.message` values in the `free_account_create_error` GA4 payload.
- Backend should own the true `free_account_created` event after the PostgreSQL user insert succeeds.

## Details

The welcome signup flow previously fired `free_account_created` from `welcome.html` after `DMTOOLS.apiCall('/user/register')` returned. That frontend event was not authoritative for PostgreSQL user creation and could mislead analytics.

The frontend success event now uses `free_account_create_response_success` with the same non-PII metadata:

- `marketing_opt_in`
- `account_type`
- `source: welcome_onboarding`

The error event payload now uses enum-style metadata only:

- `source: welcome_onboarding`
- `result: frontend_or_api_error`

## Testing Steps

1. Open `welcome.html`.
2. Submit the free account signup flow with valid inputs.
3. Confirm the success analytics event is `free_account_create_response_success`.
4. Confirm the success payload includes only `marketing_opt_in`, `account_type`, and `source: welcome_onboarding`.
5. Force a frontend or API error during signup.
6. Confirm `free_account_create_error` sends `source: welcome_onboarding` and `result: frontend_or_api_error`.
7. Confirm no frontend code fires `free_account_created`.
