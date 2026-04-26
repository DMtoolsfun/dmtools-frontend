# Codex task: install legal auto-sync system

Implement the legal auto-sync system in this repository.

## Goals
1. Add `legal/legal.config.json` for shared business, date, vendor, and payment values.
2. Add `legal/templates/privacy-policy.html`, `legal/templates/refund-policy.html`, and `legal/templates/terms-of-service.html` as the canonical source documents.
3. Add `scripts/sync-legal-docs.mjs` to render templates into root legal pages.
4. Add `scripts/check-legal-docs.mjs` to catch duplicated/broken HTML and stale dates.
5. Add package scripts:
   - `legal:sync`
   - `legal:check`
   - `legal:update`
6. Run `npm run legal:update`.
7. Commit the generated root files.

## Non-negotiable content requirements
- DMTools generates AI draft responses only.
- DMTools never sends replies or messages automatically.
- Users must review, edit, approve, and manually send any output.
- Preserve maximum legal-defensibility clauses:
  - no agency
  - no automated action
  - AI output disclaimer
  - platform independence
  - IP / copyright / trademark protections
  - reverse engineering restrictions
  - limitation of liability
  - indemnification
  - arbitration and class-action waiver
  - refund abuse prevention
  - chargeback handling
  - digital goods non-refundable language

## Acceptance criteria
- `npm run legal:update` succeeds.
- Root `privacy-policy.html`, `refund-policy.html`, and `terms-of-service.html` are regenerated.
- No duplicate html/body/footer blocks.
- Dates and business details come from `legal/legal.config.json`.
