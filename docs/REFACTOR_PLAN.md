# Veloxis refactor plan

## Current-state finding

The current Next.js application is a polished single-profile demo. Its `/api/generate` route returns fixed data, and its cash-flow, tax, and estate views contain presentation assumptions rather than a shared household ledger. The existing Monte Carlo engine and its ten tests are useful foundations, but they cannot yet model a real household or preserve a plan.

## Phased delivery

### P0 — product and safety baseline (complete with this change)

- Establish the personal-use V1 boundary, cost controls, and a three-failure circuit breaker.
- Preserve the existing demo while documenting every non-production assumption.

### P1 — local-first planning foundation

- Add a typed household financial inventory, validation, browser-local persistence, and an editable profile/inventory view.
- Derive net worth, annual surplus, and baseline simulation inputs from the inventory.
- Keep all data in the browser and add schema/calculation tests.

### P2 — unified projection engine

- Replace component-local constants with an annual cash-flow ledger shared by baseline and named scenarios.
- Support account classes, contributions, withdrawals, inflation, retirement timing, and an auditable year-by-year table.

### P3 — scenario and strategy workspace

- Add cloned named scenarios, comparison views, stress assumptions, and explicit withdrawal-order policies.
- Rebuild tax-bucket and estate views on the shared projection data; do not present fixed ratios as personalized results.

### P4 — explanation and reporting

- Add a non-advisory plan narrative grounded only in calculated data, printable exports, and data-quality warnings.
- An AI assistant, if added, must use structured inputs/outputs and never be treated as a source of tax, investment, or legal truth.

### P5 — commercialization readiness

- Design authentication, encryption, audit logging, consent, data deletion/export, monitoring, and jurisdiction-specific compliance before onboarding any other user.

## Tonight's verification gate

P1 is accepted only when a fresh household can be created locally, its inputs survive a reload, derived values update correctly, the simulation consumes those values, and type-check, tests, and production build pass. No GitHub push or Vercel deployment is part of this work.
