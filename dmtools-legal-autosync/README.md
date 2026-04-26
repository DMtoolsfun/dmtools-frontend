# DMTools Legal Auto-Sync System

This bundle turns the three legal pages into template-driven, Codex-friendly source files.

## Files
- `legal/legal.config.json` — shared business, date, vendor, and payment values.
- `legal/templates/privacy-policy.html` — canonical Privacy Policy.
- `legal/templates/refund-policy.html` — canonical Refund Policy.
- `legal/templates/terms-of-service.html` — canonical Terms of Service.
- `scripts/sync-legal-docs.mjs` — renders templates into root HTML files.
- `scripts/check-legal-docs.mjs` — validates basic structure and current dates.
- `AGENTS.md` — Codex instructions.
- `CODEX_TASK.md` — prompt/task file to hand to Codex.

## Install
Copy these files into your repo root, then run:

```bash
npm run legal:update
```

## Daily use
Edit only:

```text
legal/legal.config.json
legal/templates/*.html
```

Then run:

```bash
npm run legal:update
```

## Codex prompt
Paste the contents of `CODEX_TASK.md` into Codex, or ask Codex:

> Read AGENTS.md and CODEX_TASK.md. Install the legal auto-sync system, run validation, and propose a PR.
