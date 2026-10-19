# DMTools Website Rescue
## Review, quote & customer approval — reusable master

**Template version:** 1.0 · October 19, 2026  
**Provider:** DMTools.fun LLC · DMTools Website Rescue  
**Mailing address:** 99 N 21st St #8, Las Vegas, NV 89101, United States  
**Contact:** rescue@dmtools.fun · https://dmtools.fun/

> MASTER TEMPLATE — NOT AN INVOICE OR CUSTOMER AGREEMENT.
> Duplicate for each customer. Replace every bracketed field, remove unused sections and internal instructions, and issue a dated, versioned copy privately. Never put customer reports, private code, customer contact details, signed approvals, or invoices in this public repository.

---

## A. Project identification

| Field | Details |
|---|---|
| Report / quote ID | [WR-YYYY-NNN] |
| Document version / issued date | [v1 · date] |
| Quote valid until | [date and timezone] |
| Customer / business | [legal customer name] |
| Authorized contact | [name, role, email] |
| Customer country / state | [country and state; identify business or consumer purchase] |
| Project | [name and public URL, if appropriate] |
| Repository / reviewed state | [repository, branch and exact commit; keep private links private] |
| Environment | [local, staging, production; dates tested] |
| Customer's intended launch | [specific features and users] |
| Review package | [Free Rescue Check / $49 scoped review / separately quoted review] |
| Review fee / payment status | [amount, currency, invoice ID; not invoiced / due / paid and verified] |

An inquiry is not an order. This report does not authorize repairs, production changes, extra charges, or automatic subscription payments.

## B. Review boundary and result

**Agreed review scope:** [files, routes, features and user journeys examined].  
**Excluded / inaccessible:** [areas not reviewed, missing access, unsupported integrations].  
**Evidence available:** [source, reproduced behavior, screenshots, logs with secrets removed, tests].  
**Overall result:** [review completed within scope / partial / blocked].

**Main recommendation:** [plain-language explanation of the first useful next step].

| Category | Meaning |
|---|---|
| Broken / Blocking | Verified failure or issue blocking the agreed launch |
| Missing | Requirement absent from the agreed launch scope |
| Messy | Maintainability, consistency, or usability cleanup |

A category is not a priority or proof of severity. Use **P1: before agreed launch**, **P2: next improvement**, or **P3: optional/later**, with an explanation. Use **Needs verification** for an unconfirmed concern. A scoped review is not an exhaustive security, accessibility, legal, or performance certification.

### Priority overview

| ID | Priority | Category | Finding / user impact | Evidence status | Dependency | Proposed action |
|---|---|---|---|---|---|---|
| F-01 | [P1] | [Broken / Blocking] | [specific failure and impact] | [Reproduced / Source observation / Needs verification] | [none or item ID] | [fix / investigate] |
| F-02 | [P1/P2] | [Missing] | [absent agreed requirement] | [evidence] | [item ID / none] | [action] |
| F-03 | [P3] | [Messy] | [cleanup and practical benefit] | [evidence] | [none] | [action] |

### Finding detail — duplicate for every finding

**ID / title:** [F-01 · specific title]  
**Category / priority / rationale:** [category · P1/P2/P3 · why this order]  
**Location:** [file/function/route/line or component; reviewed commit].  
**Expected vs. observed:** [concrete trigger, expected behavior, observed result].  
**Evidence:** [reproduction steps or source excerpt, environment, date, evidence reference].  
**Confidence / verification limit:** [what is established and what is not].  
**Proposed work:** [bounded fix or investigation].  
**Acceptance check:** [observable condition, environment and who verifies it].  
**Dependencies / assumptions:** [required work, access, provider setup].  
**Not included:** [adjacent functionality excluded].  
**Pricing status:** [fixed quote ready / investigation required before fixed quote].

Investigations have their own deliverable and agreed price. Do not invent a fixed repair price when the work is still unknown.

## C. Customer-selectable repair quote

**Currency:** [USD or agreed currency]. Prices below are actual project quotes only after completion of this document.

| Select | Work ID / related finding | Bounded deliverable and completion check | Required dependencies | Fixed price |
|---|---|---|---|---:|
| [ ] | W-01 / F-01 | [deliverable; observable check] | [none / W-02] | [amount] |
| [ ] | W-02 / F-02 | [deliverable; observable check] | [access/provider] | [amount] |
| [ ] | W-03 / F-03 | [deliverable; observable check] | [none] | [amount] |

**Option 1 — À la carte:** [selected IDs].  
**Option 2 — Complete agreed rescue:** [all included IDs and any separately stated package adjustment].  
The customer selects one option. Dependencies cannot be silently omitted.

### Final price for the selected option

| Calculation | Amount |
|---|---:|
| Selected repair-service subtotal | [amount] |
| Explicit package adjustment, if any | [amount or 0] |
| Eligible paid review credit, applied once | −[amount or 0] |
| Approved third-party costs | [amount or 0; identify who pays] |
| Applicable tax, with basis stated | [amount or 0; confirm treatment] |
| **Total agreed project price** | **[amount]** |
| Prior project payments applied (excluding review already credited above) | −[amount or 0] |
| **Remaining balance** | **[amount]** |
| Due now / deposit | [amount and due date] |
| Later milestone payments | [amount, trigger and due date for each] |

**Review credit:** A paid $49 introductory review is credited once toward purchased repairs for the same reviewed project, consistent with the published terms. Confirm the review was paid and not previously credited. Show the credit on the repair invoice; do not charge or deduct the review twice. Do not apply it to unrelated work or create a negative service price. If selected service fees are below the available credit, state the agreed treatment of any remainder before approval.

**Credit evidence:** [original review invoice ID; payment verification; amount used on this quote; any prior use].

**Third-party costs:** [hosting, domain, licenses, subscriptions; amount, recurrence and payer]. No additional charge or recurring purchase is authorized unless listed and approved.

## D. Delivery, access and handover

- **Start condition:** [written approval + agreed payment verified + required access].
- **Target dates / timezone:** [start, milestones, completion; dependencies].
- **Required customer inputs:** [content, test accounts, response/approval responsibilities].
- **Access boundary:** [repositories/accounts/environments; least-privilege collaborator access].
- **Backups / rollback:** [who backs up, recovery location, restore procedure and owner].
- **Production deployment:** [included/excluded; exact destination; approval required before release].
- **Private code / AI tools:** [approved tool names, permitted data, relevant processing arrangement, exclusions; otherwise no confidential-code upload to external AI providers].
- **Data handling:** [test data only, or separate signed processing arrangement where required].
- **Deliverables:** [source, commit(s), deployment, report, instructions, licenses].
- **Rights / licensing:** [bespoke deliverables; retained reusable components; third-party licenses].
- **Access removal:** [who removes collaborator/service access and when].
- **Support / correction:** [any specified support period; in-scope failures against agreed checks; exclusions].
- **Remaining launch blockers after selected work:** [explicit list or none established within reviewed scope].

“Complete rescue” means the listed scope and acceptance checks, not every possible future defect. Revenue, rankings and business results are not guaranteed. New requirements or discoveries outside scope need a written change quote before additional chargeable work.

## E. Terms supplied with this quote

Attach dated copies with the customer-facing quote, rather than relying only on links that may change:

- Service terms: https://dmtools.fun/rescue-terms.html — [version/date attached].
- Cancellations & refunds: https://dmtools.fun/rescue-cancellations.html — [version/date attached].
- Privacy & regional rights: https://dmtools.fun/rescue-privacy.html — [version/date supplied].

This quote supplements those terms without removing non-waivable rights. No blanket no-refund provision, automatic acceptance by silence, or automatic early-start waiver is added here.

**Regional ordering check:** [customer type and jurisdiction reviewed; any required local disclosures, processing/transfer arrangements, trader details and cancellation information supplied]. If unresolved, mark **NOT READY TO ORDER** and resolve before accepting payment/work.

**Default for a covered consumer cancellation period:** Do not start until the applicable period has expired. Any early start needs a separately prepared, affirmative request and required acknowledgments, supplied with the applicable cancellation information. An inquiry checkbox or invoice payment alone is not that request. Do not use an unchecked template paragraph as evidence of consent.

## F. Customer approval — selected work only

Ask the customer to reply with a completed version of this statement, or use an equivalent signed approval:

> I am [name], [customer / authorized role for business]. I approve quote [ID], version [version], dated [date], for [selected option and work IDs], with an agreed total of [currency and amount].
>
> Payment terms are [due-now amount, remaining milestones and dates]. The review credit is [amount and original invoice reference / not applicable]. I received the dated service terms and cancellation policy listed in Section E and agree to them, subject to non-waivable rights.
>
> I authorize the access and work boundary stated in Section D and confirm I have authority over the supplied project/materials. Production release is [separately approved later / explicitly authorized for the listed destination and release conditions].
>
> Work may start [date or stated start conditions]. This approval does not itself waive any applicable cancellation period or authorize an unlisted AI/data transfer.
>
> Name / role: [details]  
> Date / timezone: [details]

Retain the accepted document and reply privately. Send the customer a copy of the final selected scope. Do not start based on an incomplete selection, ambiguous approval, or unverified payment.

## G. PayPal invoice copy blocks

**Review invoice**
- Reference: [WR-YYYY-NNN-REVIEW].
- Item: Website Rescue — scoped code review.
- Description: Review of [project] at [reviewed state], limited to [agreed boundary]. Deliverable: prioritized findings and proposed repair plan. Scope [ID/version/date].
- Amount: [$49 USD for the introductory package, or the separately agreed review amount].
- Due: [date].
- Note: No repairs included. Eligible introductory review credit is applied once to purchased repairs for the same reviewed project under the agreed terms.

**Repair invoice**
- Reference: [WR-YYYY-NNN-REPAIR or milestone reference].
- Items: [one item per approved work ID; preserve exact quote wording].
- Credit: Paid review credit — invoice [original review ID] — minus [amount].
- Description: Selected scope [quote ID/version/date], approved [date]. [Deposit / milestone / final balance] of [total project amount]. Remaining scheduled amount: [amount].
- Due: [date].
- Note: No additional work or third-party purchases without written agreement. Cancellation/refund rights follow the dated policy supplied with the accepted scope.

Create the invoice inside your actual PayPal Business account and verify its details before sending. Do not insert an invented payment link, mark unpaid work “paid,” request a personal/friends-and-family transfer for services, or imply that the website already processes payments. This template does not create or send an invoice.

## H. Completion and acceptance record

| Work ID | Agreed check | Result | Evidence / environment / date | Customer verification needed |
|---|---|---|---|---|
| [W-01] | [exact accepted wording] | [Passed / Failed / Not run / Blocked] | [reference] | [yes/no and what] |

**Deployment:** [URL, version/commit, date and explicit release authorization].  
**Handover:** [files/instructions/licensing delivered; ownership/access confirmed].  
**Exceptions / remaining blockers:** [list].  
**Customer acceptance:** [written reply/sign-off reference; do not infer from silence].  
**Payment:** [actual invoice references and verified status].  
**Closeout:** [support instructions and removal of temporary access].

---

### Internal send-before checklist — remove from customer copy

- [ ] All placeholders completed; quote ID/version consistent.
- [ ] Evidence distinguishes reproduced defects from assumptions.
- [ ] No secrets, unnecessary customer data, or private code in public materials.
- [ ] Selected IDs include dependencies and measurable checks.
- [ ] Totals, taxes, credit, deposits and balances independently checked.
- [ ] Applicable regional obligations assessed; required terms supplied durably.
- [ ] No confidential AI upload without the agreed tool/data arrangement.
- [ ] Explicit written approval retained before work.
- [ ] Invoice created in the real business account and payment verified as agreed.
- [ ] No claim of live readiness beyond verified agreed checks.
