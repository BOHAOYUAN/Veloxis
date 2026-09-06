# Sandbox payment and manual delivery rehearsal

## Confirmed configuration

- Production origin: https://veloxis.lumiere-private.com
- Public support: haoyuanbo626@gmail.com (owner confirmed; mailbox delivery not yet verified).
- [Sandbox product checkout](https://test.checkout.dodopayments.com/buy/pdt_0Nmv6Ui2doXeFXXlsmUxL?quantity=1).
- Observed checkout: explicit Test Mode indicator, Veloxis Founding Advisor Pilot, USD 99 and the guided evaluation description. This is page inspection, not a successful payment.
- Use the buyer mailbox agreed privately with the owner. Do not publish buyer addresses, payment references or receipts in this repository.

The public website never links to this sandbox. Keep the live checkout environment variable blank and `PILOT_ENROLLMENT_OPEN=false`. The application rejects test hosts, session links, non-HTTPS links and quantities other than one for public enrollment. This is a configuration guard, not payment verification or access control.

## Rehearsal sequence

1. Open the sandbox product link and confirm **Test Mode**, product and USD amount before entering anything. Use only provider-documented test card details; never a real card. Verify current test instructions in Dodo documentation before execution.
2. Abandon one checkout before payment. Confirm no fulfillment or success claim is made. Closing a tab does not prove the provider records a cancelled payment; record its actual dashboard status.
3. Complete a separate sandbox purchase with fictional billing information and the owner's test mailbox. Record the result privately.
4. In the owner's authenticated Dodo **Test Mode** dashboard, verify product, amount, currency and successful payment status. A redirect alone is insufficient.
5. Ask the owner to confirm the actual receipt arrived, including junk mail. Do not infer receipt from the checkout page.
6. Rehearse the onboarding draft from `PILOT_EMAILS.md` using the real case materials. Prefix the subject with `[TEST]`; calculate delivery, seven-day refund and 30-day support dates from the actual rehearsal date. Owner confirms both materials and working links were received.
7. Issue the full sandbox refund from the dashboard. Check provider status and owner receipt. Never refund a live transaction as part of this rehearsal.
8. Record each outcome, timestamp and private evidence location. Payment and delivery tests remain incomplete until independently observed.

## Current verification record

| Item | Status |
|---|---|
| Sandbox checkout opens and identifies test mode | Observed |
| Correct product and USD 99 displayed | Observed |
| Successful sandbox payment confirmed in dashboard | Not tested |
| Abandonment/cancellation behavior | Not tested |
| Buyer receipt received | Not tested |
| Onboarding and materials received | Not tested |
| Full sandbox refund confirmed | Not tested |
| Public production access | Prior check returned connection closed; unverified |
| Live enrollment | Closed in local configuration |

Do not enable real checkout, deploy, send messages or represent this rehearsal as complete without the remaining checks. The `$99` service is not a software subscription. See `PILOT_EXECUTION.md` for the broader launch gate.
