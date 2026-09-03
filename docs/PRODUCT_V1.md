# Veloxis Personal Wealth OS — V1 product boundary

## Purpose

Veloxis V1 is a private, local-first wealth-planning workspace for one household. It helps its owner model assets, liabilities, income, expenses, goals, and retirement scenarios. It is a simulator, not financial, investment, tax, or legal advice.

## Default planning model

- United States planning vocabulary and USD are the initial default.
- The domain model stores ISO currency codes and jurisdiction identifiers so future modules can support other currencies and tax regimes without rewriting household data.
- A household owns one baseline plan and may later own named what-if scenarios. The baseline plan is the only editable plan in the first vertical slice.

## V1 included

1. Household profile: name, planning jurisdiction, preferred currency, and life-stage inputs.
2. Manual financial inventory: cash/investment/retirement assets, real assets, debts, annual incomes, annual expenses, and goals.
3. Derived household summary: net worth, total assets, total liabilities, annual surplus, and goal funding target.
4. Retirement plan controls that derive opening capital, annual savings, and retirement spending from the inventory while allowing the user to tune planning assumptions.
5. Deterministic annual projection and existing Monte Carlo, stress-test, cash-flow, tax-bucket, and estate visual modules.
6. Browser-local persistence and a visible data-disclaimer. No authentication or third-party data transfer.

## Explicitly excluded from V1

- Brokerage/bank aggregation, document upload, real tax filing, real-time market data, advisor/client collaboration, payment, or automated trade execution.
- Jurisdiction-specific tax conclusions, Social Security/Medicare benefit calculations, legal estate recommendations, and AI-generated advice.
- Multi-user authorization and cloud synchronization. These require separate security and compliance design before commercialization.

## Acceptance definition

A user can enter a household and financial inventory, reload the browser, see the same data and summary, then use that data to drive a retirement simulation. Invalid financial inputs are rejected before they change the plan. Existing mathematical tests and the production build remain green.
