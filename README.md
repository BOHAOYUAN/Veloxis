# Veloxis Wealth OS

Veloxis is a local-first household financial-planning simulator built as a focused wealth-tech engineering portfolio project. It demonstrates an auditable data flow from household inputs to deterministic cash-flow projections, seeded Monte Carlo simulations, and Current Plan versus Proposed Plan comparisons.

> Educational planning simulator only. Outputs are not investment, tax, legal, or financial advice.

## What is implemented

- Editable household assets, liabilities, income, expenses, goals, and user-provided Social Security estimate.
- Browser-local persistence with migration from the original V1 workspace format.
- Account-sourced taxable, tax-deferred, and tax-free allocation—no fixed allocation ratios.
- A shared year-by-year cash-flow ledger in today's dollars.
- Seeded Monte Carlo projections with reproducible plan results.
- Current and Proposed plans evaluated with the same seed and compared using calculated deltas.
- Assumption stress tests and a return-versus-inflation sensitivity matrix.
- Educational estate ownership map based on entered balances without inferred legal or tax outcomes.

## Deliberate product boundary

Veloxis does not implement authentication, multi-tenant advisor workflows, bank aggregation, real tax calculations, Social Security optimization, trading, or personalized recommendations. It does not call an external language model or send household data to a third party.

## Calculation model

- Monetary inputs and projections use today's dollars.
- Expected return is entered as a nominal rate; the deterministic projection and stochastic drift derive a real return using the inflation assumption.
- Retirement begins at the entered retirement age: employment savings stop and retirement spending begins in that year.
- Success probability is measured at the household's selected plan end age, never at a hard-coded age.
- Current and Proposed plans use identical simulated market paths, so displayed differences come from plan inputs rather than random sampling noise.

## Technology

- Next.js 15 and React 19
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

## Deployment

The repository may be deployed independently, but deployment, external services, credentials, and financial-account connections are intentionally outside this project's implementation scope.
