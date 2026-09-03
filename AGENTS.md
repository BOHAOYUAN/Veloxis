# Veloxis execution guardrails

## Delivery boundaries

- This repository is a personal financial-planning simulator. Never describe an output as investment, legal, or tax advice.
- Do not deploy, push, change Git remotes, create credentials, or connect banking/brokerage services unless the user explicitly asks in the current conversation.
- Prefer local, deterministic calculations and existing dependencies. Do not add paid APIs or services without approval.

## Cost and failure circuit breaker

- Keep each change set focused on one acceptance criterion and run the smallest relevant check first.
- Count a failed command, timeout, or failed verification against its current work item. After the first failure, diagnose it; after the second, make one materially different correction; after the third consecutive failure on that work item, stop work on it.
- When tripped, do not retry variants, broaden searches, or make speculative edits. Record the command, error, attempted fixes, and the next human decision in the work summary.
- Do not run broad scans, dependency upgrades, visual generations, or external AI calls unless they are required by the accepted work item.

## Quality gate

- Keep financial domain types and validation separate from React presentation components.
- Add or update tests for deterministic financial calculations and schemas.
- Before declaring a change complete, run `npm run type-check` and `npm test`; run `npm run build` for any routing, persistence, or production-facing change.
