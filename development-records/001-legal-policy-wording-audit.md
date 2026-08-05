# Development Record 001 — Legal Policy Wording Audit

**Date:** August 5, 2026  
**Status:** PARTIAL  
**Branch:** `agent/legal-policy-wording-audit`  
**Implementation head:** `6b72807b2d59f4d5f0eda8bf94d8f3e141e4a7c7`  
**Base:** `main` at `c9fbeaf658fed12507e82c8cb68cd9251301f468`

## Objective

Update the wording of DMTools.fun legal pages where the repository evidence and current primary guidance supported a safe correction. Preserve implementation-dependent work as explicit follow-up rather than claiming that policy text alone creates compliance.

## Scope

Included:

- Published SaaS Privacy Policy, Terms of Service, Refund Policy, and Cookie Policy.
- Tap-Out and Gravity Runner privacy policies.
- Canonical legal templates, generated bundle copies, shared dates, and legal-document validation.
- Clear disclosure of current providers, cross-site tracking, privacy-request process, recurring billing, cancellation, statutory withdrawal rights, game advertising, children, retention, and privacy choices.

Excluded:

- Analytics or advertising consent implementation.
- Global Privacy Control processing.
- Checkout, billing portal, or cancellation-flow changes.
- Mobile SDK, store-listing, Data Safety, or age-treatment configuration.
- Production deployment.
- Legal advice or attorney approval.

## Discovery

The audit found:

- Google Analytics loads before any visible consent choice.
- Cookie Policy dates conflicted.
- Nevada third-party tracking disclosure was incomplete.
- Refund and Terms wording did not fully explain statutory digital withdrawal requirements.
- The game policies lacked sufficiently specific children, retention, provider, and request disclosures.
- The legal checker covered only three generated pages and hard-coded a stale date.
- The template bundle and published root pages are separate paths and can drift.

## Implementation

Updated 14 existing files:

- Published policies: `privacy-policy.html`, `terms-of-service.html`, `refund-policy.html`, `cookie-policy.html`.
- Game policies: `tap-out-privacy.html`, `gravity-runner-privacy.html`.
- Legal configuration and templates under `dmtools-legal-autosync/legal/`.
- Generated legal bundle pages.
- `dmtools-legal-autosync/scripts/check-legal-docs.mjs`.

Key changes:

- Standardized policy dates to August 5, 2026.
- Named OpenAI, Lemon Squeezy, Railway, and Google Analytics.
- Added third-party online-tracking disclosure and a designated privacy-request process.
- Clarified recurring billing, purchase confirmation, cancellation, and non-waivable withdrawal rights.
- Disclosed the current technical consent-control gap rather than promising an unavailable control.
- Added game-specific children, retention, privacy-choice, and international-processing language.
- Expanded automated validation to nine policies and removed the hard-coded date dependency.

## Validation

| Check | Result | Evidence |
|---|---|---|
| Compare branch to main | PASSED | Branch is ahead with 14 intended modified files and no unrelated paths. |
| HTML structure | PASSED | Each of nine policy outputs has one doctype, html/body opening tag, and html/body closing tag. |
| Current date | PASSED | All nine policy outputs contain August 5, 2026. |
| Stale-date scan | PASSED | No audited output contains April 25, May 27, June 18, or July 11, 2026. |
| Required wording | PASSED | Provider, tracking, request, withdrawal, consent-gap, and game-privacy markers are present. |
| Local `npm run legal:update` | BLOCKED | GitHub CLI/local checkout was unavailable; validation was performed against branch file contents through the GitHub connector. |
| Browser/manual production check | NOT RUN | No deployment was authorized. |

## Revisions

The first validation run found that the published Terms described withdrawal rights without the exact required validation marker. The paragraph was revised to add the “Consumer withdrawal rights” label, and all nine documents passed the complete validation set on retest.

## Remaining Risks and Code-Side Work

1. Gate Google Analytics and AdSense behind region-appropriate consent and support withdrawal.
2. Implement and test Global Privacy Control for applicable sharing/targeted-advertising activity.
3. Verify Lemon Squeezy checkout disclosures, immediate-performance consent, confirmation evidence, and refund configuration.
4. Test the account and Lemon Squeezy customer-portal cancellation paths end to end.
5. Inventory every Tap-Out and Gravity Runner SDK/build variant; align policies, store Data Safety forms, age treatment, advertising identifiers, consent SDKs, and children settings.
6. Consolidate the legal bundle and published root pages into one canonical deployment pipeline.
7. Obtain qualified legal review of arbitration, class waiver, liability limits, jurisdiction, children’s privacy, and international consumer terms.

## Completion Summary

Wording and validation updates are complete. The overall compliance task remains **PARTIAL** until the code-side controls and store configurations are implemented and verified.

**Tags:** legal, privacy, cookies, billing, refunds, COPPA, consent, validation
