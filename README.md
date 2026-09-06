# Veloxis

Veloxis is a browser-based retirement scenario visualizer for independent advisors. It demonstrates an auditable data flow from a synthetic household scenario to deterministic cash-flow projections, seeded Monte Carlo simulations, and Current Plan versus Proposed Plan comparisons.

> Educational planning simulator only. Outputs are not investment, tax, legal, or financial advice.

## What is implemented

- Editable household assets, liabilities, income, expenses, goals, and user-provided Social Security estimate.
- A public synthetic demo with two guided fictional cases that does not persist or accept real client data.
- A browser-local `/workspace` preview for editing and reopening fictional household inputs without an account or cloud sync.
- Account-sourced taxable, tax-deferred, and tax-free allocation—no fixed allocation ratios.
- A shared year-by-year cash-flow ledger in today's dollars.
- Seeded Monte Carlo projections with reproducible plan results.
- Current and Proposed plans evaluated with the same seed and compared using calculated deltas.
- Assumption stress tests and a return-versus-inflation sensitivity matrix.
- Educational estate ownership map based on entered balances without inferred legal or tax outcomes.

## Deliberate product boundary

Veloxis does not implement authentication, multi-tenant advisor workflows, bank aggregation, real tax calculations, Social Security optimization, trading, or personalized recommendations. It does not call an external language model or send household data to a third party. The workspace preview is not a login-protected SaaS: it stores fictional inputs in that browser only and is excluded from search indexing.

## Calculation model

- Monetary inputs and projections use today's dollars.
- Expected return is entered as a nominal rate; the deterministic projection and stochastic drift derive a real return using the inflation assumption.
- Retirement begins at the entered retirement age: employment savings stop and retirement spending begins in that year.
- Success probability is measured at the household's selected plan end age, never at a hard-coded age.
- Current and Proposed plans use identical simulated market paths, so displayed differences come from plan inputs rather than random sampling noise.

## Pilot execution

The public demo now starts with the fictional baseline, comparison and calculated explanation, then the annual ledger. Supporting views remain available separately. Demo changes are not saved. The pilot page links both to this guided demo and to the complete browser-local workspace preview. See [the execution gates](docs/PILOT_EXECUTION.md), [email drafts](docs/PILOT_EMAILS.md), and [90-second recording script](docs/DEMO_RECORDING.md). The recording and provider sandbox rehearsal are still outstanding; no SaaS demand evidence has been collected.

Keep `PILOT_ENROLLMENT_OPEN=false` until the sandbox payment, cancellation, receipt, refund and manual-delivery rehearsal is complete. Opening enrollment additionally requires a valid HTTPS site origin, live one-unit Dodo product checkout URL and public contact email. Sandbox links cannot enable public enrollment. These are build-time settings. The public demo remains free. Follow [the payment rehearsal](docs/PAYMENT_REHEARSAL.md); an accessible checkout is not a verified payment.

The owner-confirmed production origin and support Gmail address are public defaults in `src/lib/pilotConfig.ts`; environment variables may override them. The test buyer mailbox is not published. No checkout URL is enabled by default. The software structured data does not label the free demo as a $99 software purchase: that price belongs to the guided support service.

## Technology

- Next.js 16 and React 19
- TypeScript and Zod
- Tailwind CSS 4
- Vitest
- Canvas-based confidence-range chart

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verification

```bash
npm run type-check
npm test
npm run build
```

GitHub Actions runs type checking, tests, and the production build for pushes and pull requests.

## Founding Advisor Pilot

The public site describes a $99, one-time, 30-day Founding Advisor Pilot. The paid deliverable is a guided evaluation service: two synthetic meeting cases, facilitation notes, written onboarding, and limited email support. The public demo remains free. See [the outreach and fulfillment guide](docs/ADVISOR_PILOT.md).

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin so canonical URLs and the sitemap are generated accurately. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the public support address and `NEXT_PUBLIC_DODO_PILOT_URL` only to a public Dodo hosted checkout link. Enrollment also requires `PILOT_ENROLLMENT_OPEN=true` after the test gate passes. No Dodo API integration or secret belongs in this repository. Deploy commercial traffic on Vercel Pro rather than the non-commercial Hobby tier.
