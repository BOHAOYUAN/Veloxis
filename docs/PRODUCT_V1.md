# Veloxis Personal Wealth OS — interview-demo product boundary

## Purpose

Veloxis V1 is a private, local-first wealth-planning workspace for one household. It helps its owner model assets, liabilities, income, expenses, goals, and retirement scenarios. It is a simulator, not financial, investment, tax, or legal advice.

## Default planning model

- United States planning vocabulary and USD are the initial default.
- The domain model stores ISO currency codes and jurisdiction identifiers so future modules can support other currencies and tax regimes without rewriting household data.
- A household owns a read-only Current Plan derived from its inventory and one editable Proposed Plan used for comparison.

## V1 included

1. Household profile: name, planning jurisdiction, preferred currency, and life-stage inputs.
2. Manual financial inventory: cash/investment/retirement assets, real assets, debts, annual incomes, annual expenses, and goals.
3. Derived household summary: net worth, total assets, total liabilities, annual surplus, and goal funding target.
4. Retirement plan controls that derive opening capital, annual savings, retirement spending, goals, and an entered Social Security estimate from the inventory.
5. A shared deterministic annual ledger plus seeded Monte Carlo, stress-test, cash-flow, account tax-allocation, and educational estate modules.
6. Current-versus-Proposed comparison using identical simulated market paths and calculation-backed explanations.
7. Browser-local persistence and a visible data disclaimer. No authentication or third-party data transfer.

## Explicitly excluded from V1

- Brokerage/bank aggregation, document upload, real tax filing, real-time market data, advisor/client collaboration, payment, or automated trade execution.
- Jurisdiction-specific tax conclusions, Social Security/Medicare benefit calculations, legal estate recommendations, and generated financial advice.
- Multi-user authorization and cloud synchronization. These require separate security and compliance design before commercialization.

## Acceptance definition

A user can enter a household and financial inventory, reload the browser, compare Current and Proposed plans reproducibly, and trace cash-flow values to a shared annual ledger. Invalid persisted data is rejected. Mathematical tests, type checking, production build, and desktop/mobile visual checks remain green.
