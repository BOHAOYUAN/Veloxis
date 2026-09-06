# Advisor pilot execution and evidence gates

## Positioning

Veloxis helps independent US financial advisors prepare, display, and explain retirement scenario changes. The current offer is a guided synthetic evaluation. Identical paths and an inspectable ledger support trust; they are not, by themselves, evidence of buyer demand.

Public demo is free. The $99 service includes two fictional case guides, facilitation notes, written onboarding, and up to three email support exchanges over 30 days from delivery. First cohort: maximum three buyers. Delivery and each reply: two business days. Refund request window: seven calendar days after delivery. No automatic conversion to a subscription or promises of future features.

## Week 1: release gate

Configuration and the observed sandbox checkout are recorded in [the payment rehearsal](PAYMENT_REHEARSAL.md). The domain and support email are owner-confirmed, but delivery and production availability still require verification.

Visitor path: public site → guided `/demo` → pilot terms and offer → optional `/workspace` product preview. The workspace restores the trusted household editor and analysis modules with browser-local persistence for fictional data. It is deliberately marked as a preview, excluded from search indexing, and has no login, cloud client record or paid access control. Those remain behind the SaaS evidence gate below.

- [ ] Public production home, demo, methodology, pilot, terms and privacy accessible.
- [ ] Final domain, functioning support mailbox, sender identity and valid postal address verified.
- [ ] Test-mode payment succeeds; provider dashboard confirms status and product/amount.
- [ ] Cancelled checkout does not cause fulfillment or a purchase confirmation.
- [ ] Test receipt reaches the buyer mailbox; full test refund is verified in the dashboard.
- [ ] Manual onboarding rehearsal sends both guides, delivery/support/refund dates and correct URLs.
- [ ] Final 90-second recording reviewed against its captions; no client information visible.
- [ ] Production UI checked at 1280px and 390px, including reset, keyboard and pending calculations.

Do not mark payment verified based on a browser redirect or a local configuration value. Keep real enrollment closed while this gate is incomplete. A live checkout link cannot substitute for a sandbox test.

## Weeks 2–6: outreach experiment

Manually select 60 independent US advisors or small firms that publicly offer retirement planning and can participate in tool selection. Do not filter by age, buy lists, or assume competitors have a particular flaw. Initial batch: five individually reviewed messages. Then approximately three new contacts per working day. Capacity and delivery issues override the daily target.

Targets, not forecasts: 12 substantive replies, six interviews, three actual demo reviews, one paid pilot. Send one follow-up after five business days and a final follow-up seven business days later. Immediately stop on refusal, unsubscribe, or hard bounce; retain a private suppression record and check it before every send. Do not use open tracking as demand evidence.

Commercial messages must use an accurate sender and subject, identify the commercial purpose, include a valid postal address and a simple opt-out. B2B is not a blanket exemption. Review the [FTC guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) before sending. Never invent an address. Templates are drafts until all bracketed fields are replaced.

Store prospect identity, source URL, why they fit, first-send/follow-up dates, delivery status, opt-out, reply date, interview notes, exact quotes, demo task outcome, repeat-use dates, payment verification and support counts in a private spreadsheet. Keep it outside the repository or in ignored `private-pilot/`. Do not include client data, payment-card details or credentials. No prospect list is populated by this implementation.

Interview first about the last actual meeting: what confused the client, what tools were used, and what workaround was needed. Then ask the advisor to independently identify the baseline, change one input, and explain the result. Record misunderstandings, whether help was needed, and what would make the tool useful. Invite only advisors who name a concrete use for the guided evaluation.

## Weeks 6–8: decision record

Record evidence and named private prospect IDs for every gate:

| Gate | Required evidence | Initial status |
|---|---|---|
| Repeated problem | Three advisors independently describe the same recurring meeting problem | Not collected |
| Repeat use | Two advisors voluntarily return or request reuse on different dates | Not collected |
| Concrete value | Two advisors identify a saved step, clearer explanation or required missing capability | Not collected |
| Recurring payment | Two advisors discuss ongoing payment for explicit functionality | Not collected |
| Scope | One shared end-to-end workflow captures the request | Not established |

Payment for guided support validates a service purchase, not software retention. Low replies trigger review of targeting, delivery and copy. Interviews without a problem trigger repositioning. Materials-only demand keeps the service model. Shared pain plus repeat use and recurring payment discussions unlock an invitation-only SaaS specification. Banking, precise taxes or complete planning requests require a new scope and budget decision.

## Conditional SaaS backlog — do not build yet

Workflow: sign in → create fictional case → save Current/Proposed → present → reopen → manage subscription. Add user-owned cases, versioned scenarios, model version/seed, server-side authorization, billing status, monitoring, backup/restore and cancellation/deletion. Payment events require signatures, idempotency and retry/order handling. Keep the public demo separate and never silently upload old browser data.

Acceptance: cross-user reads/writes denied; saved results reproducible; repeated/late events cannot incorrectly grant access; cancellations match terms; backups restore; deletion works; an advisor completes the workflow without developer assistance. Real household data requires a separate privacy/security/model release gate; removing names does not make financial data non-sensitive.

Planning envelope: one developer, roughly 20 hours/week; eight-week cash cap $50, with new spending separately approved. Estimate a further 6–10 weeks for invitation-only SaaS only after scope validation. Do not promise real-client readiness within that estimate.
