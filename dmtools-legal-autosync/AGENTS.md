# Codex instructions for DMTools legal pages

Before editing legal pages, read `legal/legal.config.json` and the templates in `legal/templates/`.

Rules:
- Do not hand-edit root `privacy-policy.html`, `refund-policy.html`, or `terms-of-service.html` unless explicitly asked.
- Edit the matching template in `legal/templates/` first.
- Keep shared values in `legal/legal.config.json`.
- Run `npm run legal:update` after changes.
- Preserve the rule that DMTools only generates drafts; users review and manually send messages.
- Preserve IP, trademark, no-agency, no-auto-send, limitation-of-liability, arbitration, refund-abuse, chargeback, and digital-goods clauses unless the user explicitly requests removal.
- Keep links to Privacy Policy, Refund Policy, Terms of Service, and Cookie Policy consistent in the site footer.
- Maintain one valid HTML document per output file: one doctype, one html element, one body element.

Validation:
- Run `npm run legal:check` before committing.
- In the final response, summarize changed files and validation results.
