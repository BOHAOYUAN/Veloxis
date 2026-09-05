# Founding Advisor Pilot

## Scope

Veloxis is offering a $99, one-time, 30-day guided evaluation for independent US advisors who want to test a clearer Current Plan versus Proposed Plan retirement conversation. The public demonstration uses fictional household data only. It does not accept real client data or provide investment, tax, legal, or financial advice.

The paid deliverable is a service package, not restricted access to the public demo. It includes the two guided synthetic meeting cases in [the case guide](PILOT_CASE_GUIDES.md), facilitation notes, written onboarding, and up to three email support exchanges during the 30-day period.

## Before inviting anyone

1. Prepare the two case guides and facilitation notes that will be attached to the onboarding email.
2. Deploy the site with Vercel Pro and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the public address used for delivery, support, privacy requests, and refunds.
4. Create a one-time $99 digital product in Dodo Payments and place its hosted checkout URL in `NEXT_PUBLIC_DODO_PILOT_URL`.
5. Use Dodo test mode to validate checkout, cancellation, refund, receipt, and manual fulfillment. Never place Dodo API keys in this repository.
6. Confirm the purchase page, checkout description, receipt, and onboarding email all describe the same deliverables and refund window.
7. Record each prospect, message date, response, interview notes, demo invitation, and purchase manually in a private spreadsheet.

## Written interview message

**Subject:** Quick feedback on a retirement scenario conversation tool?

Hi {Name},

I’m building Veloxis, a browser-based retirement scenario visualizer for independent advisors. It compares a current plan with a proposed plan using identical simulated market paths, so clients can see what changed and why.

I’m looking for blunt feedback, not a sale. Would you be open to reviewing a short synthetic demo and answering a few questions by email?

Thank you,

{Your name}

## Questions to ask

1. In a retirement planning meeting, which part of explaining a plan change takes the most effort?
2. What tool do you use now, and where does it become awkward or slow?
3. In which meeting would this demonstration be useful, if any? What would make you distrust it?
4. What would have to be true for a 30-day synthetic-data evaluation to be worth $99?

## Manual onboarding after a paid pilot

1. Verify the successful payment in Dodo and send the two case guides, facilitation notes, and `/demo` URL within two business days.
2. State in writing that only fictional scenarios may be used and no client data may be entered.
3. Send the methodology, privacy, and pilot terms links. State the delivery date, support end date, and remaining support exchanges.
4. Respond to each of up to three support exchanges within two business days.
5. At day 21, ask for a short written feedback response. Do not promise feature delivery, compliance review, or ongoing service.
6. Accept a full-refund request received within seven calendar days after delivery and initiate it through Dodo to the original payment method.
