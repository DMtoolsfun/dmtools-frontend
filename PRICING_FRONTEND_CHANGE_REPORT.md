# Pricing Frontend Change Report

## Files changed

- `pricing.html`
- `account.html`
- `app.html`
- `packs.html`
- `store.html`
- `PRICING_FRONTEND_CHANGE_REPORT.md`

## What changed

- Removed the Monthly / Weekly / Annual segmented billing toggle from the public pricing page.
- Updated subscription rendering to show monthly plans only.
- Removed interval fallback behavior that could display a monthly plan with a weekly or annual suffix.
- Updated pricing card suffixes to use each rendered plan's actual billing interval.
- Hid founder, test, first-user, and non-public pack entries from public pack rendering.
- Updated public pricing page headline, subheadline, subscription copy, and pack copy.
- Updated necessary customer-facing fallback pricing text in account and app surfaces.
- Converted `store.html` and `packs.html` into legacy compatibility redirects to `/pricing.html#packs`.
- Made `pricing.html` the canonical public pricing surface.

## Old pricing text removed

- Free plan references to 10 replies/responses per month were replaced with 5 replies/month.
- Starter subscription references to $19/month and 500 replies were replaced with $9/month and 100 replies/month.
- Pro subscription references to $59/month and 2,000 replies were replaced with $29/month and 500 replies/month.
- Business subscription references to $149/month and 8,000 replies were replaced with $79/month and 2,000 replies/month.
- Old public pack prices $3.99, $9.99, $16.99, and $34.99 were removed from legacy pack/store pages by redirecting those pages to pricing.
- Founder/Test Pack public display was removed or filtered from public pricing-related rendering.

## New public pricing

- Free: 5 replies/month
- Starter Plan: $9/month, 100 replies/month
- Pro Plan: $29/month, 500 replies/month
- Business Plan: $79/month, 2,000 replies/month
- Quick Pack: $5, 25 replies
- Starter Pack: $12, 100 replies
- Pro Pack: $29, 300 replies

## Monthly-only note

`pricing.html` is the canonical pricing surface. Public pricing is monthly-only for now. Weekly and annual public plan selection is not shown on the pricing page.

## Legacy compatibility note

`store.html` and `packs.html` are legacy compatibility redirect pages. Old external links to those pages now land on `/pricing.html#packs` and no longer maintain separate pricing copy, pack amounts, or checkout logic.

## Manual test checklist

- [ ] pricing page loads
- [ ] no weekly/annual toggle appears
- [ ] Starter shows $9/month and 100 replies
- [ ] Pro shows $29/month and 500 replies
- [ ] Business shows $79/month and 2,000 replies
- [ ] Quick Pack shows $5 and 25 replies
- [ ] Starter Pack shows $12 and 100 replies
- [ ] Pro Pack shows $29 and 300 replies
- [ ] Founder/Test Pack is not visible publicly
- [ ] checkout buttons still call existing checkout flow
- [ ] signed-in and signed-out checkout still work
- [ ] mobile layout still works
- [ ] `/store.html` redirects to `/pricing.html#packs`
- [ ] `/packs.html` redirects to `/pricing.html#packs`
