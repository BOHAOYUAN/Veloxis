# Veloxis refactor plan

## Original finding

The original Next.js application was a single-profile demo. Its `/api/generate` route returned fixed data, and its cash-flow, tax, and estate views contained presentation assumptions rather than a shared household ledger.

## Implemented credibility upgrade

- Removed the unused mock model route and unsupported model claims.
- Added account tax categories, cash-flow timing, Social Security estimate inputs, and V1-to-V2 local-data migration.
- Added a shared annual projection ledger and reproducible seeded Monte Carlo engine.
- Added Current-versus-Proposed comparison with calculation-backed deltas.
- Rebuilt cash-flow, tax-allocation, and estate views from entered or projected data.

## Phased delivery

### P0 — product and safety baseline (complete with this change)

- Establish the personal-use V1 boundary, cost controls, and a three-failure circuit breaker.
- Preserve the existing demo while documenting every non-production assumption.

### P1 — local-first planning foundation (complete)

- Add a typed household financial inventory, validation, browser-local persistence, and an editable profile/inventory view.
- Derive net worth, annual surplus, and baseline simulation inputs from the inventory.
- Keep all data in the browser and add schema/calculation tests.

### P2 — unified projection engine (complete)

- Replace component-local constants with an annual cash-flow ledger shared by baseline and named scenarios.
- Support account classes, contributions, withdrawals, inflation, retirement timing, and an auditable year-by-year table.

### P3 — scenario and strategy workspace (partially complete)

- Preserve the implemented Current and Proposed plans; named scenario libraries and explicit withdrawal-order policies remain future work.
- Tax allocation and estate views use entered account data and do not present fixed ratios as personalized results.

### P4 — explanation and reporting (partially complete)

- Calculation-backed, non-advisory comparison insights are implemented; printable exports and expanded data-quality warnings remain future work.
- Any future assistant must use structured inputs/outputs and never be treated as a source of tax, investment, or legal truth.

### P5 — commercialization readiness

- Design authentication, encryption, audit logging, consent, data deletion/export, monitoring, and jurisdiction-specific compliance before onboarding any other user.

## Verification gate

The upgrade is accepted only when local data survives a reload or migrates from V1, Current and Proposed plans are reproducible, the shared ledger balances, type-check/tests/build pass, and desktop/mobile layouts are visually checked. No GitHub push or Vercel deployment is part of this work.
